const Review = require('../models/Review');

const getAll = async () => {
  const reviews = await Review.find().populate({
    path: 'product',
    select: 'name company price',
  });
  return reviews;
};

const getReviewsByProduct = async (product) => {
  const reviews = await Review.find({ product });
  return reviews;
};

const getReviewByProductAndUser = async (product, user) => {
  const review = await Review.findOne({
    product,
    user,
  });
  return review;
};

const getById = async (id) => {
  const review = await Review.findById(id);
  return review;
};

const create = async (item) => {
  const review = await Review.create(item);
  return review;
};

module.exports = {
  getAll,
  getReviewsByProduct,
  getReviewByProductAndUser,
  getById,
  create,
};
