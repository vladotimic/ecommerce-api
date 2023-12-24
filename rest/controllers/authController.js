const crypto = require('crypto');
const createError = require('http-errors');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require('../lib/mail');
const {
  createJwtToken,
  attachCookiesToResponse,
  clearCookies,
} = require('../lib/jwt');
const createHash = require('../lib/createHash');
const logger = require('../lib/logger');

const createTokenUser = (payload) => {
  return {
    name: payload.name,
    userId: payload._id,
    role: payload.role,
  };
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an email...');
  const emailAlreadyExists = await userService.getByEmail(email);
  if (emailAlreadyExists) {
    throw new createError.BadRequest('Invalid request');
  }
  logger.debug('User found.');

  const verificationToken = crypto.randomBytes(40).toString('hex');

  logger.debug('Creating new user...');
  await userService.create({
    name,
    email,
    password,
    verificationToken,
  });
  logger.debug('User created.');

  const origin = 'http://localhost:3000';
  logger.debug('Sending verification email...');
  await sendVerificationEmail(name, email, verificationToken, origin);
  logger.debug('Verification email sent');

  res.status(201).send('Account created. Check your email for confirmation!');
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an email...');
  const user = await userService.getByEmail(email);
  if (!user) {
    throw new createError.Unauthorized('Unauthenticated');
  }
  logger.debug('User found.');

  logger.debug('Comparing password...');
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new createError.Unauthorized('Unauthenticated');
  }
  logger.debug('Password compared.');

  if (!user.isVerified) {
    throw new createError.Unauthorized('Please verify your email');
  }

  const payload = createTokenUser(user);

  let refreshToken = '';
  logger.debug('Finding existing refresh token');
  const existingToken = await tokenService.getByUser(user._id);
  if (existingToken) {
    logger.debug('Refresh token found.');
    const { isValid } = existingToken;
    if (!isValid) {
      throw new createError.Unauthorized('Unauthenticated');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse(res, payload, refreshToken);
    return res.status(200).json();
  }

  refreshToken = createJwtToken(payload);
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

const logout = async (req, res) => {
  logger.debug('Deleting refresh token by user...');
  await tokenService.deleteByUser(req.user.userId);
  logger.debug('Refresh token deleted.');

  // Old way
  // res.cookie('accessToken', null, {
  //   httpOnly: true,
  //   expires: new Date(Date.now()),
  // });
  // res.cookie('refreshToken', null, {
  //   httpOnly: true,
  //   expires: new Date(Date.now()),
  // });

  // Simple way
  clearCookies();

  res.status(204).send();
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

  if (!email || !verificationToken) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an email...');
  const user = await userService.getByEmail(email);
  if (!user) {
    throw new createError.Unauthorized('Unauthenticated');
  }
  logger.debug('User found.');

  if (user.verificationToken !== verificationToken) {
    throw new createError.Unauthorized('Unauthenticated');
  }

  user.isVerified = true;
  user.verificationDate = new Date().toISOString();
  user.verificationToken = '';

  logger.debug('Updating user info...');
  await user.save();
  logger.debug('User updated.');

  res.status(200).send('Email verified');
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  if (!email || !password || !token) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an email...');
  const user = await userService.getByEmail(email);
  if (user) {
    logger.debug('User found.');
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;

      logger.debug('Updating user info...');
      await user.save();
      logger.debug('User updated.');
    }
  }

  res.status(204).send();
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new createError.BadRequest('Invalid request');
  }

  logger.debug('Finding user by an email...');
  const user = await userService.getByEmail(email);
  if (user) {
    logger.debug('User found.');
    const passwordToken = crypto.randomBytes(70).toString('hex');
    const origin = 'http://localhost:3000';
    await sendResetPasswordEmail(user.name, user.email, passwordToken, origin);

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;

    logger.debug('Updating user info...');
    await user.save();
    logger.debug('User updated.');
  }

  res.status(204).send();
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
};
