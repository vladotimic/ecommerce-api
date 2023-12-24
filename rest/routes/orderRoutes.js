const express = require('express');
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getOrdersByUser,
  updateOrder,
} = require('../controllers/orderController');
const {
  createOrderSchema,
  getSingleOrderSchema,
  updateOrderSchema,
} = require('../schemas/orderSchema');
const { authenticate, authorize, validate } = require('../middlewares');

const router = express.Router();

router
  .route('/')
  .get([authenticate, authorize('admin')], getAllOrders)
  .post(authenticate, validate(createOrderSchema), createOrder);
router.get('/show-my-orders', authenticate, getOrdersByUser);
router
  .route('/:id')
  .get(authenticate, validate(getSingleOrderSchema), getSingleOrder)
  .patch(authenticate, validate(updateOrderSchema), updateOrder);

module.exports = router;
