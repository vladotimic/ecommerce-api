const createError = require('http-errors');
const productService = require('../services/productService');
const logger = require('../lib/logger');

const getAllProducts = async (req, res) => {
  logger.debug('Retrieving all products...');
  const results = await productService.getAll(req);
  logger.debug('Products retrieved.');

  res.status(200).json(results);
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  logger.debug('Finding product by an id...');
  const product = await productService.getById(id);
  if (!product) {
    throw new createError.NotFound('Product not found');
  }
  logger.debug('Found single product.');

  res.status(200).json(product);
};

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  logger.debug('Creating product...');
  const product = await productService.create(req.body);
  logger.debug('Product created.');

  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  logger.debug('Updating product...');
  const product = await productService.update(id, req.body);
  if (!product) {
    throw new createError.NotFound('Product not found');
  }
  logger.debug('Product updated.');

  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  logger.debug('Deleting product...');
  const product = await productService.getById(id);
  if (!product) {
    throw new createError.NotFound('Product not found');
  }
  logger.debug('Product deleted.');

  await product.remove();

  res.status(204).send();
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
