const User = require('../models/User');

const getAllUsers = async () => {
  const users = await User.find({ role: 'user' }).select('-password');
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  return user;
};

const getByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const create = async (item) => {
  const user = await User.create(item);
  return user;
};

module.exports = {
  getByEmail,
  getAllUsers,
  getUserById,
  create,
};
