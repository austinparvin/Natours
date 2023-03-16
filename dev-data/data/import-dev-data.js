const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const checkAsync = require('../../utils/catchAsync');

dotenv.config();
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('[Austin] DB connection successful');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('[Austin] Data Successfully Loaded');
  } catch (error) {
    console.log('[Austin] error:', error);
  }
  process.exit(0);
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('[Austin] Tour Collection Data Deleted');
  } catch (error) {
    console.log('[Austin] error:', error);
  }
  process.exit(0);
};

const resetUsers = checkAsync(async () => {
  try {
    await User.deleteMany();
    console.log('[Austin] User Collection Data Deleted');

    const sanitizedData = users.map((el) => {
      const userData = {
        name: el.name,
        email: el.email,
        role: el.role,
        active: el.active,
        photo: el.photo,
        password: 'password',
        passwordConfirm: 'password',
      };
      return userData;
    });

    await Promise.all(
      sanitizedData.map((sanitizedUser) => User.create(sanitizedUser))
    );

    console.log('[Austin] User Data Successfully Loaded');
  } catch (error) {
    console.log('[Austin] error:', error);
  }
  process.exit(0);
});
const command = process.argv[2];
if (command === '--import') {
  importData();
} else if (command === '--delete') {
  deleteData();
} else if (command === '--user-reset') {
  resetUsers();
}
