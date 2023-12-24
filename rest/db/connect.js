const { connect } = require('mongoose');
const logger = require('../lib/logger');

const connectToDB = async (url) => {
  try {
    await connect(url);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error);
  }
};

module.exports = connectToDB;
