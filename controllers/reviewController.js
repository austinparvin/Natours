const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getReview = getOne(Review);
const getAllReviews = getAll(Review);
const createReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
};
