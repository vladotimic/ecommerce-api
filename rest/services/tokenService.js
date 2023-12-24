const Token = require('../models/Token');

const getByUser = async (user) => {
  const token = await Token.findOne({ user });
  return token;
};

const deleteByUser = async (user) => {
  const token = await Token.findOneAndDelete({ user });
  return token;
};

const create = async (item) => {
  const token = await Token.create(item);
  return token;
};

module.exports = {
  getByUser,
  deleteByUser,
  create,
};
