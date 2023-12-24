const { Schema, model, Types } = require('mongoose');

const singleOrderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const orderSchema = new Schema({
  tax: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  orderItems: [singleOrderSchema],
  status: {
    type: String,
    enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
    default: 'pending',
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
  },
});

module.exports = model('Order', orderSchema);
