const createError = require('http-errors');
const reviewService = require('../services/reviewService');
const productService = require('../services/productService');
const checkPermission = require('../lib/checkPermission');
const logger = require('../lib/logger');

const getAllReviews = async (req, res) => {
  logger.debug('Finding all reviews...');
  const reviews = await reviewService.getAll();
  logger.debug('Reviews found.');

  res.status(200).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;

  logger.debug('Finding review by an id...');
  const review = await reviewService.getById(id);
  if (!review) {
    throw new createError.NotFound('Review not found');
  }
  logger.debug('Review found.');

  res.status(200).json(review);
};

const getProductReviews = async (req, res) => {
  const { id } = req.params;

  logger.debug('Finding reviews for single product...');
  const reviews = await reviewService.getReviewsByProduct(id);
  logger.debug('Reviews found.');

  res.status(200).json({
    reviews,
  });
};

const createReview = async (req, res) => {
  const { product } = req.body;

  logger.debug('Finding product by an id...');
  const isValidProduct = await productService.getById(product);
  if (!isValidProduct) {
    throw new createError.BadRequest('Invalid request');
  }
  logger.debug('Product found.');

  logger.debug('Checking if there is review by product id and user id...');
  const alreadySubmitted = await reviewService.getReviewByProductAndUser(
    product,
    req.user.userId
  );
  if (alreadySubmitted) {
    throw new createError.BadRequest('Invalid request');
  }
  logger.debug('Checking done.');

  req.body.user = req.user.userId;
  logger.debug('Saving review...');
  const review = await reviewService.create(req.body);
  logger.debug('Review saved.');

  res.status(201).json(review);
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  logger.debug('Finding review by an id...');
  const review = await reviewService.getById(id);
  if (!review) {
    throw new createError.NotFound('Review not found');
  }
  logger.debug('Review found.');

  checkPermission(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  logger.debug('Saving review...');
  await review.save();
  logger.debug('Review saved.');

  res.status(200).json(review);
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  logger.debug('Finding review by an id...');
  const review = await reviewService.getById(id);
  if (!review) {
    throw new createError.NotFound('Review not found');
  }
  logger.debug('Review found.');

  checkPermission(req.user, review.user);

  logger.debug('Removing review...');
  await review.remove();
  logger.debug('Review removed.');

  res.status(204).send();
};

module.exports = {
  getAllReviews,
  getSingleReview,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
