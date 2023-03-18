const express = require('express');

const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

// prettier-ignore
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

// prettier-ignore
router
  .route('/:id')
  .patch(updateReview)
  .delete(protect, restrictTo('admin'), deleteReview)

module.exports = router;
