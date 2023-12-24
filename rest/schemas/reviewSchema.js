const { object, string, number } = require('yup');

const getSingleReviewSchema = object({
  params: object({
    id: string().required(),
  }),
});

const createReviewSchema = object({
  body: object({
    rating: number().min(1).max(5).required('Provide rating'),
    title: string().max(100).required('Provide rating title'),
    comment: string().required('Provide rating comment'),
    product: string().required(),
  }),
});

const updateProductSchema = object({
  params: object({
    id: string().required(),
  }),
  body: object({
    rating: number().min(1).max(5).required('Provide rating'),
    title: string().max(100).required('Provide rating title'),
    comment: string().required('Provide rating comment'),
  }),
});

module.exports = {
  getSingleReviewSchema,
  createReviewSchema,
  updateProductSchema,
};
