const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendJWTToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendJWTToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and passwords exist
  if (!email || !password) {
    return next(new AppError('Please provide email AND password', 400));
  }

  // check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // check JWT and send token to client
  createSendJWTToken(user, 200, res);
});

const logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

const protect = catchAsync(async (req, res, next) => {
  // 1) get token, check if there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists', 401)
    );
  }

  // 4) check it user changed password after JWT issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password.  Please log in again.', 401)
    );
  }

  // Grant Access to protected route
  req.user = freshUser;
  next();
});

// Only for rendered pages, there should be no error
const isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) get token, check if there
  if (req.cookies.jwt) {
    // 2) verification token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 3) check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next();
    }

    // 4) check it user changed password after JWT issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // There is a logged in user
    res.locals.user = freshUser;
    return next();
  }
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user via email from req
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError('There is no user with that email address', 404));
  }

  // 2) generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send back via email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request to reset your password via sending your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email, please try again later',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const encryptedResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encryptedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token !expired && user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired'), 400);
  }
  // 3) update changedPasswordAt
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) log user in, send JWT to client
  createSendJWTToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, passwordConfirm, password } = req.body;

  // get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log('[Austin] user:', user);

  // check if posted password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Password given was incorrect', 401));
  }
  // if so update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // log user in
  createSendJWTToken(user, 200, res);
});

module.exports = {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  isLoggedIn,
};
