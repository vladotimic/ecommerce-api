const { object, string, number, array } = require('yup');

const getSingleOrderSchema = object({
  params: object({
    id: string().required(),
  }),
});

const updateOrderSchema = object({
  params: object({
    id: string().required(),
  }),
  body: object({
    paymentIntentId: string().required(),
  }),
});

const createOrderSchema = object({
  body: object({
    items: array()
      .of(
        object({
          name: string().required,
          price: number().required(),
          amount: number().required(),
          user: string().required,
        })
      )
      .required(),
    shippingFee: number().required(),
    tax: number().required(),
  }),
});

module.exports = {
  getSingleOrderSchema,
  updateOrderSchema,
  createOrderSchema,
};
