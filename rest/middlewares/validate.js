const createError = require('http-errors');

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    throw new createError.BadRequest('Invalid request');
  }
};

module.exports = validate;
