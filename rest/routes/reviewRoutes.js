const express = require('express');
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const {
  createReviewSchema,
  getSingleReviewSchema,
  updateProductSchema,
} = require('../schemas/reviewSchema');
const { authenticate, validate } = require('../middlewares');

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(authenticate, validate(createReviewSchema), createReview);
router
  .route('/:id')
  .get(validate(getSingleReviewSchema), getSingleReview)
  .patch(authenticate, validate(updateProductSchema), updateReview)
  .delete(authenticate, validate(getSingleReviewSchema), deleteReview);

module.exports = router;
