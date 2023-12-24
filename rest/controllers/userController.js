const createError = require('http-errors');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const checkPermission = require('../lib/checkPermission');
const { createJwtToken, attachCookiesToResponse } = require('../lib/jwt');
const logger = require('../lib/logger');

const createTokenUser = (payload) => {
  return {
    name: payload.name,
    userId: payload._id,
    role: payload.role,
  };
};

const getAllUsers = async (req, res) => {
  logger.debug('Retrieving list of users...');
  const users = await userService.getAllUsers();
  logger.debug('Users retrieved.');
  res.status(200).json({
    users,
  });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  logger.debug('Finding user by an id...');
  const user = await userService.getUserById(id);
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  logger.debug('User found.');

  checkPermission(req.user, user._id);

  res.status(200).json(user);
};

const showCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an id...');
  const user = await userService.getUserById(req.user.userId);
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  logger.debug('User found.');

  user.email = email;
  user.name = name;

  logger.debug('Updating user...');
  await user.save();
  logger.debug('User updated.');

  const payload = createTokenUser(user);
  const refreshToken = createJwtToken(payload);
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;

  logger.debug('Saving refresh token...');
  await tokenService.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });
  logger.debug('Refresh token saved.');
  attachCookiesToResponse(res, payload, refreshToken);

  res.status(204).send();
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an id...');
  const user = await userService.getUserById(req.user.userId);
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  logger.debug('User found.');

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new createError.Unauthorized('Unauthenticated');
  }

  user.password = newPassword;

  logger.debug('Updating user password...');
  await user.save();
  logger.debug('User password updated.');

  res.status(204).send();
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
};
