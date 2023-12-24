const createError = require('http-errors');
const { isTokenValid, attachCookiesToResponse } = require('../lib/jwt');
const Token = require('../models/Token');

const authenticate = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new createError.Unauthorized('Unauthenticated');
    }

    attachCookiesToResponse(res, payload.user, existingToken.refreshToken);

    req.user = payload.user;
    next();
  } catch (error) {
    throw new createError.Unauthorized('Unauthenticated');
  }
};

const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new createError.Forbidden('Unauthorized');
    }
    next();
  };
};

module.exports = { authenticate, authorize };
