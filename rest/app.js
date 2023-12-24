const express = require('express');
require('express-async-errors');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./lib/logger');
const connectToDB = require('./db/connect');
const {
  errorMiddleware,
  notFoundMiddleware,
  sanitizer,
} = require('./middlewares');
const {
  authRouter,
  productRouter,
  reviewRouter,
  orderRouter,
  userRouter,
} = require('./routes');

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(sanitizer);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await connectToDB(process.env.MONGO_URI);
  logger.info(`Server is running on http://localhost:${port} 🚀🚀🚀`);
});
