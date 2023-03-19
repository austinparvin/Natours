const Tour = require('../models/tourModel');
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

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  console.log('[Austin] tour.guides:', tour.guides);
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

module.exports = { getOverview, getTour };
