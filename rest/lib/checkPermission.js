const createError = require('http-errors');

const checkPermission = (reqUser, resourceId) => {
  if (reqUser.role === 'admin') return;
  if (reqUser.userId === resourceId.toString()) return;
  throw createError.Forbidden('Unauthorized');
};

module.exports = checkPermission;
