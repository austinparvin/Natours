const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const { helmet, csp } = require('./utils/helmet_csp_config');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set(`views`, path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Set security HTTP headers
app.use(helmet);
csp(app);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);
app.use(compression());
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
/* EX: logging in using only a password
{ 
  "email": { "$gt": "" },
  "password": "common-password"
}
*/

app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Cannot find ${req.originalUrl} on the server. ❌`,
    404
  );

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
