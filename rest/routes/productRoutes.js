const express = require('express');
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { getProductReviews } = require('../controllers/reviewController');
const {
  getAllProductsSchema,
  productIdSchema,
  createSchema,
  updateProductSchema,
} = require('../schemas/productSchema');
const { authenticate, authorize, validate } = require('../middlewares');

const router = express.Router();

router
  .route('/')
  .get(validate(getAllProductsSchema), getAllProducts)
  .post(
    [authenticate, authorize('admin')],
    validate(createSchema),
    createProduct
  );
router
  .route('/:id')
  .get(validate(productIdSchema), getSingleProduct)
  .patch(
    [authenticate, authorize('admin')],
    validate(updateProductSchema),
    updateProduct
  )
  .delete(
    [authenticate, authorize('admin')],
    validate(productIdSchema),
    deleteProduct
  );
router.get('/:id/reviews', getProductReviews);

module.exports = router;
