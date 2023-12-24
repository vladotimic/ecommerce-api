const jwt = require('jsonwebtoken');
const logger = require('./logger');

const createJwtToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = (res, user, refreshToken) => {
  const accessTokenJWT = createJwtToken({ user });
  const refreshTokenJWT = createJwtToken({ user, refreshToken });

  const oneDay = 1000 * 60 * 60 * 24; // 1 day
  const thirtyDays = 1000 * 60 * 60 * 24 * 30; // 30 days

  logger.debug('Creating cookies...');
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + thirtyDays),
  });
  logger.debug('Cookies created.');
};

const clearCookies = (res) => {
  logger.debug('Deleting cookies...');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  logger.debug('Cookies deleted.');
};

module.exports = {
  createJwtToken,
  isTokenValid,
  attachCookiesToResponse,
  clearCookies,
};
