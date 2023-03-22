const Stripe = require('stripe');

const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

const webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const createBookingSession = catchAsync(async (session) => {
    console.log('session:', session);
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.line_items[0].price_data.unit_amount;
    await Booking.create({ tour, user, price });
  });

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    await createBookingSession(event.data.object);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.sendStatus(200).json({
    received: true,
  });
});

const getAllBookings = getAll(Booking);
const createBooking = createOne(Booking);
const getBooking = getOne(Booking);
const updateBooking = updateOne(Booking);
const deleteBooking = deleteOne(Booking);

module.exports = {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  webhookCheckout,
};
