const { object, string, bool, number, array } = require('yup');

const getAllProductsSchema = object({
  query: object({
    search: string(),
    featured: bool(),
    company: string(),
    fields: string(),
    numericFields: string(),
    sort: string(),
    page: number(),
    limit: number(),
  }),
});

const productIdSchema = object({
  params: object({
    id: string().required(),
  }),
});

const createSchema = object({
  body: object({
    name: string().max(100).required('Provide name'),
    price: number().required('Provide price'),
    description: string().max(100).required('Provide description'),
    image: string(),
    category: string()
      .oneOf(['office', 'kitchen', 'bedroom'])
      .required('Provide product category'),
    company: string()
      .oneOf(['ikea', 'liddy', 'marcos'])
      .required('Provide company name'),
    colors: array().of(string()).required(),
    featured: bool(),
    freeShipping: bool(),
    inventory: number().required(),
    averageRating: number(),
    numOfReviews: number(),
    user: string().required(),
  }),
});

const updateProductSchema = object({
  params: object({
    id: string().required(),
  }),
  body: object({
    name: string().max(100).required('Provide name'),
    price: number().required('Provide price'),
    description: string().max(100).required('Provide description'),
    image: string(),
    category: string()
      .oneOf(['office', 'kitchen', 'bedroom'])
      .required('Provide product category'),
    company: string()
      .oneOf(['ikea', 'liddy', 'marcos'])
      .required('Provide company name'),
    colors: array().of(string()).required(),
    featured: bool(),
    freeShipping: bool(),
    inventory: number().required(),
    averageRating: number(),
    numOfReviews: number(),
  }),
});

module.exports = {
  getAllProductsSchema,
  productIdSchema,
  createSchema,
  updateProductSchema,
};
