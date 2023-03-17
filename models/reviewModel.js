const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Review must contain a description'],
    },
    rating: {
      type: Number,
      required: [true, 'Review must contain a rating'],
      min: [0, 'Rating must not be less than 0'],
      max: [5, 'Rating must not be more than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
