const { Schema, model, Types } = require('mongoose');
const logger = require('../lib/logger');

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Provide rating title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Provide rating comment'],
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findOneAndUpdate(
      {
        _id: productId,
      },
      {
        averageRating: Math.ceil(result[0].averageRating || 0),
        numOfReviews: result[0].numOfReviews || 0,
      }
    );
  } catch (error) {
    logger.error(error);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = model('Review', reviewSchema);
