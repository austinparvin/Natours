const express = require('express');

const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

router.param('id', (req, res, next, val) => {
  console.log('[Austin] val:', val);
  next();
});

// prettier-ignore
router
  .route('/')
  .get(getAllTours)
  .post(createTour);

// prettier-ignore
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
