const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a price'],
      default: 4.5,
      unique: [true, 'A tour name must be unique'],
      trim: true,
      maxLength: [40, 'A tour name must have less or equal to 40 characters'],
      minLength: [10, 'A tour name must be more than 10 characters'],
    },
    slug: String,
    duration: {
      type: String,
      required: [true, 'A tour must have a duration'],
      trim: true,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a max group size'],
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A difficulty is either easy, medium, or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this keyword only works on document creation
        validator: function (val) {
          return val < this.price; // discountPrice < price
        },
        message: 'Discount price ({VALUE}) must be less than the price',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be >= 1.0'],
      max: [5, 'A rating must be <= 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a Cover Image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: Array,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware: 'save' runs before .save() and .create() but NOT .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// EMBEDDING EXAMPLE
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('save', function (next) {
//   console.log('[Austin] Will save document...');
//   next();
// });

// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.post('save', function (doc, next) {
//   console.log('[Austin] doc:', doc);
//   next();
// });

// Query Middleware: runs before .find(), .findOne(), ...
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: false });
  this.start = Date.now();
  next();
});

// runs after .find(), .findOne, ...
tourSchema.post(/^find/, function (docs, next) {
  console.log('[Austin] Query took (ms):', Date.now() - this.start);
  next();
});

// Aggregation Middleware:
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: false } });
  console.log('[Austin] this:', this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
