const AppError = require('../utils/appError');

const sendErrorForDev = (err, req, res) => {
  console.log('[Austin] err:', err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: `Something went wrong`,
      msg: err.message,
    });
  }
};

const sendErrorForProd = (err, req, res) => {
  console.log('[Austin] err:', err);
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: `Something went wrong`,
      msg: err.message,
    });
  }

  return res.status(err.statusCode).render('error', {
    title: `Something went wrong`,
    msg: 'Please try again later',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleExpiredTokenError = () =>
  new AppError('Token Expired. Please login again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError')
      sendErrorForProd(handleCastErrorDB(err), req, res);
    if (err.code === 11000)
      sendErrorForProd(handleDuplicateFieldsDB(err), req, res);
    if (err.name === 'ValidationError')
      sendErrorForProd(handleValidationErrorDB(err), req, res);
    if (err.name === 'JsonWebTokenError')
      sendErrorForProd(handleJWTError(), req, res);
    if (err.name === 'TokenExpiredError')
      sendErrorForProd(handleExpiredTokenError(), req, res);

    sendErrorForProd(err, req, res);
  }
};
