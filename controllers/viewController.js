const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getOverview = catchAsync(async (req, res) => {
  // get tour data
  const tours = await Tour.find();
  // build template
  // render template with tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
});

const getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Account',
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

const updateUserData = catchAsync(async (req, res, next) => {
  console.log('[Austin] req:', req);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Account',
    user: updatedUser,
  });
});

const allowCDNScripts = (req, res, next) => {
  res.set('Content-Security-Policy', "frame-src 'self'");
  next();
};

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  allowCDNScripts,
};
