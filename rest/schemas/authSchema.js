const { object, string } = require('yup');

const registerSchema = object({
  body: object({
    name: string().min(3).max(100).required(),
    email: string().email().required(),
    password: string().required(),
  }),
});

const loginSchema = object({
  body: object({
    email: string().email().required(),
    password: string().required(),
  }),
});

const verifyEmailSchema = object({
  body: object({
    password: string().required(),
    verificationToken: string().required(),
  }),
});

const resetPasswordSchema = object({
  body: object({
    email: string().email().required(),
    password: string().required(),
    token: string().required(),
  }),
});

const forgotPasswordSchema = object({
  body: object({
    email: string().email().required(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
