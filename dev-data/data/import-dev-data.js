const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config();
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('[Austin] DB connection successful');
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const dataReset = async () => {
  try {
    await Tour.deleteMany();
    console.log('[Austin] Tour Collection Data Deleted');
    await User.deleteMany();
    console.log('[Austin] User Collection Data Deleted');
    await Review.deleteMany();
    console.log('[Austin] Review Collection Data Deleted');

    await Tour.create(tours);
    console.log('[Austin] Tour Collection Data Created');
    await User.create(users, { validateBeforeSave: false });
    console.log('[Austin] User Collection Data Created');
    await Review.create(reviews);
    console.log('[Austin] Review Collection Data Created');
  } catch (error) {
    console.log('[Austin] error:', error);
  }
  process.exit(0);
};

const command = process.argv[2];
if (command === '--data-reset') {
  dataReset();
}
