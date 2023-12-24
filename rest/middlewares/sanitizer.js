const createError = require('http-errors');
const sanitizeHtml = require('sanitize-html');

const sanitize = (value) =>
  sanitizeHtml(value, {
    allowedTags: [],
  });

const clean = (object) =>
  Object.entries(object).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: sanitize(value),
    };
  }, {});

const sanitizeMiddleware = async (req, res, next) => {
  try {
    const { body, query, params } = req;
    req.body = clean(body);
    req.query = clean(query);
    req.params = clean(params);
    next();
  } catch (error) {
    throw new createError.BadRequest('Invalid request');
  }
};

module.exports = sanitizeMiddleware;
