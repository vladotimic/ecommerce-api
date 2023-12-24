const { object, string } = require('yup');

const getSingleUserSchema = object({
  params: object({
    id: string().required(),
  }),
});

const updateUserSchema = object({
  body: object({
    name: string().min(3).max(100).required(),
    email: string().email().required(),
  }),
});

const updatePasswordSchema = object({
  body: object({
    oldPassword: string().required(),
    newPassword: string().required(),
  }),
});

module.exports = {
  getSingleUserSchema,
  updateUserSchema,
  updatePasswordSchema,
};
