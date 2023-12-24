const createError = require('http-errors');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const orderService = require('../services/orderService');
const productService = require('../services/productService');
const checkPermission = require('../lib/checkPermission');
const logger = require('../lib/logger');

const createOrder = async (req, res) => {
  const { items: cartItems, shippingFee, tax } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new createError.BadRequest('Invalid request');
  }
  if (!tax || !shippingFee) {
    throw new createError.BadRequest('Invalid request');
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    logger.debug('Finding product by an id...');
    const product = await productService.getById(item.product);
    if (!product) {
      throw new createError.NotFound('Product not found');
    }
    logger.debug('Product found.');

    const { name, price, _id } = product;
    const singleOrder = {
      name,
      price,
      product: _id,
      amount: item.amount,
    };

    orderItems = [...orderItems, singleOrder];
    subtotal += item.amount * price;
  }

  const total = subtotal + shippingFee + tax;

  logger.debug('Creating stripe payment intent...');
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
  });
  logger.debug('Payment intent created.');

  logger.debug('Saving order in table...');
  const order = await orderService.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  logger.debug('Order saved.');

  res.status(201).json({
    order,
    clientSecret: order.clientSecret,
  });
};

const getAllOrders = async (req, res) => {
  logger.debug('Finding all orders...');
  const orders = await orderService.getAll();
  logger.debug('Orders found.');
  res.status(200).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;

  logger.debug('Finding single order...');
  const order = await orderService.getById(id);
  if (!order) {
    throw new createError.NotFound('Order not found');
  }
  logger.debug('Order found.');

  checkPermission(req.user, order.user);

  res.status(200).json(order);
};

const getOrdersByUser = async (req, res) => {
  logger.debug('Finding all orders of single user...');
  const orders = await orderService.getUserOrders(req.user.userId);
  logger.debug('Orders found.');
  res.status(200).json({ orders });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  logger.debug('Finding single order...');
  const order = await orderService.getById(id);
  if (!order) {
    throw new createError.NotFound('Order not found');
  }
  logger.debug('Order found.');

  checkPermission(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getOrdersByUser,
  updateOrder,
};
