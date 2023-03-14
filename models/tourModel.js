const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a price'],
    default: 4.5,
    unique: [true, 'A tour name must be unique'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: Number,
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
