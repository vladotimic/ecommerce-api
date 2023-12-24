const { Schema, model, Types } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Provide name'],
      maxlenth: 100,
    },
    price: {
      type: Number,
      required: [true, 'Provide price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Provide description'],
      maxlenth: 100,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Provide company name'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: "{VALUE} isn't supported",
      },
    },
    colors: {
      type: [String],
      default: ['#000000'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 1,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: true,
});

productSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = model('Product', productSchema);
