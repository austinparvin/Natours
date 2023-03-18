const express = require('express');

const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

// prettier-ignore
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

// prettier-ignore
router
  .route('/:id')
  .patch(updateReview)
  .delete(protect, restrictTo('admin'), deleteReview)

module.exports = router;
