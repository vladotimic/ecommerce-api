const createError = require('http-errors');
const { clearCookies } = require('../lib/jwt');
const logger = require('../lib/logger');
const { BadRequest, NotFound, Unauthorized, Forbidden } = createError;

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof BadRequest) {
    logger.error('Bad Request', err);
    return res.status(400).send(err);
  }
  if (err instanceof NotFound) {
    logger.error('Not Found', err);
    return res.status(404).send(err);
  }
  if (err instanceof Unauthorized) {
    logger.error('Unauthenticated', err);
    clearCookies(res);
    return res.status(401).send(err);
  }
  if (err instanceof Forbidden) {
    logger.error('Unauthorized', err);
    return res.status(403).send(err);
  }
  if (err.code === 11000) {
    let value = Object.keys(err.keyPattern)[0];
    value = value[0].toUpperCase() + value.slice(1);
    logger.error(err);
    return res.status(400).send(`${value} already exists!`);
  }
  logger.error('Internal Server Error', err);
  res.status(500).send(err);
};

module.exports = errorMiddleware;
