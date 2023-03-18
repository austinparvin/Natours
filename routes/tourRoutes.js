const express = require('express');

const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const reviewRouter = require('./reviewRoutes');

const { protect, restrictTo } = require('../controllers/authController');

router.use('/:tourId/reviews', reviewRouter);

router.param('id', (req, res, next, val) => {
  console.log('[Austin] val:', val);
  next();
});

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guides'), getMonthlyPlan);
// prettier-ignore
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guides'), createTour);

// prettier-ignore
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guides'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guides'), deleteTour);

module.exports = router;
