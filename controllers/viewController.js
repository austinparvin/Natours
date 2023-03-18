const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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

const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({
    slug: req.params.slug,
  }).populate({
    path: 'reviews',
    fields: 'review ratings user',
  });
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});

module.exports = { getOverview, getTour };
