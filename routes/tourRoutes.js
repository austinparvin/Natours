const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  validateTourData,
} = require('../controllers/tourController');

router.param('id', (req, res, next, val) => {
  console.log('[Austin] val:', val);
  next();
});

router.param('id', checkId);

// prettier-ignore
router
  .route('/')
  .get(getAllTours)
  .post(validateTourData, createTour);

// prettier-ignore
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
