const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const { deleteOne, updateOne, createOne } = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
};
