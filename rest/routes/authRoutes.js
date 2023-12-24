const express = require('express');
const {
  register,
  login,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
} = require('../controllers/authController');
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  verifyEmailSchema,
} = require('../schemas/authSchema');
const { authenticate, validate } = require('../middlewares');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/logout', authenticate, logout);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

module.exports = router;
