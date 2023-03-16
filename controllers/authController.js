const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and passwords exist
  if (!email || !password) {
    return next(new AppError('Please provide email AND password', 400));
  }

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 400));
  }

  // check JWT and send token to client
  const token = '';

  res.status(200).json({
    status: 'success',
    token,
  });
};

module.exports = {
  signup,
  login,
};
