const express = require('express');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updatePassword,
  updateUser,
} = require('../controllers/userController');
const {
  getSingleUserSchema,
  updatePasswordSchema,
  updateUserSchema,
} = require('../schemas/userSchema');
const { authenticate, authorize, validate } = require('../middlewares');

const router = express.Router();

router.get('/', [authenticate, authorize('admin')], getAllUsers);
router.get('/show-me', authenticate, showCurrentUser);
router.patch(
  '/update-user',
  authenticate,
  validate(updateUserSchema),
  updateUser
);
router.patch(
  '/update-password',
  authenticate,
  validate(updatePasswordSchema),
  updatePassword
);
router.get('/:id', authenticate, validate(getSingleUserSchema), getSingleUser);

module.exports = router;
