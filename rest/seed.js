require('dotenv').config();

const connectToDB = require('./db/connect');
const logger = require('./lib/logger');
const productService = require('./services/productService');
const products = require('./data/products.json');

const seed = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    await productService.deleteAll();
    await productService.create(products);
    logger.info('Products seeded!');
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
seed();
