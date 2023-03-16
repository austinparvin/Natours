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

const { protect, restrictTo } = require('../controllers/authController');

router.param('id', (req, res, next, val) => {
  console.log('[Austin] val:', val);
  next();
});

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
// prettier-ignore
router
  .route('/')
  .get(protect, getAllTours)
  .post(createTour);

// prettier-ignore
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
.delete(protect, restrictTo('admin','lead-guides'), deleteTour);

module.exports = router;
