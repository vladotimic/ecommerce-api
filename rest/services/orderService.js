const Order = require('../models/Order');

const getAll = async () => {
  const orders = await Order.find();
  return orders;
};

const getById = async (id) => {
  const order = await Order.findById(id);
  return order;
};

const getUserOrders = async (user) => {
  const orders = await Order.find({ user });
  return orders;
};

const create = async (item) => {
  const order = await Order.create(item);
  return order;
};

module.exports = {
  getAll,
  getById,
  getUserOrders,
  create,
};
