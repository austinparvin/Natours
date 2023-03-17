const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// MIDDLEWARE STACK
// Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Router mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 404 catch
app.all('*', (req, res, next) => {
  const err = new AppError(
    `Cannot find ${req.originalUrl} on the server. ❌`,
    404
  );

  next(err);
});

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
