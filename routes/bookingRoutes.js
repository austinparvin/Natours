const express = require('express');
const {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require('./../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
router.use(protect, restrictTo('admin'));

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

// prettier-ignore
router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

// prettier-ignore
router
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
