const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('File uploaded not an image, image upload only', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! please use /signUp instead',
  });
};

const getCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400
      )
    );
  }

  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
    }
  );
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getUser = getOne(User);
const getAllUsers = getAll(User);
// DO NOT update passwords with this!
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
  getCurrentUser,
  uploadUserPhoto,
  resizeUserPhoto,
};
