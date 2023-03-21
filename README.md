# Natours
## _Tour Booking Demo Web App: Node.js, Express, MongoDB_
&nbsp;
[![N|Solid](https://www.natours.dev/img/logo-green.png)](https://nodesource.com/products/nsolid)
&nbsp;

This is a simple web application developed with Node.js, and Express, MongoDB Atlas and server-side Pug templated rendering using REST API principles. The application allows authenticated users to browse and book tours from a list of available tours. It also allows tour operators to create and manage tours, view bookings, and update tour information.

## How to run locally

To run this application locally, you will need to have Node.js installed on your machine. You can download Node.js from [https://nodejs.org/en/](https://nodejs.org/en/). For context this application was developed 2023 with Node v18.0.0

### Installing

1. Clone the repository to your local machine
2. Navigate to the project directory in your terminal
3. Run `npm install` to install the necessary dependencies

### Thrid Party App Setup

1. Create an account with **Mongo DB Atlas**, then create an empty DB and take note of the database `url` and `password`
2. Create a **Mailtrap** account and take note of the `host`, `port`, `username`, and `password`
3. Create a **Sendmail** account and take note of the `username`, and `password`
4. Create a **stripe** account and take note of the `privateKey`

### .env Setup

1. Using the `template.env` file create a `.env` file with all the carroted values updated with the noted values from section above.

### Data Setup


1. Navigate to the project directory in your terminal
2. Run `npm run data-reset` to seed initial data

### Running the Application

To run the application, navigate to the project directory in your terminal and run the following command:

 `npm run start:dev`
 
This will start the application and it will be accessible at `http://localhost:3000`.

### API Endpoints

The API provides the following endpoints:

### Booking Routes
`GET /bookings`: Get all bookings.
`POST /bookings`: Create a new booking.
`GET /bookings/:id`: Get a single booking by its ID.
`PATCH /bookings/:id`: Update a booking by its ID.
`DELETE /bookings/:id`: Delete a booking by its ID.

### Review Routes
`GET /reviews`: Get all reviews.
`POST /reviews`: Create a new review (restricted to authenticated users).
`GET /reviews/:id`: Get a single review by its ID.
`PATCH /reviews/:id`: Update a review by its ID (restricted to authenticated users and admins).
`DELETE /reviews/:id`: Delete a review by its ID (restricted to authenticated users and admins).

### Tour Routes
`GET /tours/top-5-cheap`: Get the top 5 cheapest tours.
`GET /tours/tour-stats`: Get tour statistics.
`GET /tours/monthly-plan/:year`: Get the monthly plan for a specific year (restricted to admins and lead guides).
`GET /tours/tours-within/:distance/center/:latlng/unit/:unit`: Get tours within a certain distance of a location.
`GET /tours/distances/:latlng/unit/:unit`: Get distances from a certain point to all tours.
`GET /tours`: Get all tours.
`POST /tours`: Create a new tour (restricted to admins and lead guides).
`GET /tours/:id`: Get a single tour by its ID.
`PATCH /tours/:id`: Update a tour by its ID (restricted to admins and lead guides).
`DELETE /tours/:id`: Delete a tour by its ID (restricted to admins and lead guides).

### User Routes
`POST /users/signup`: Sign up a new user.
`POST /users/login`: Log in an existing user.
`GET /users/logout`: Log out the current user.
`POST /users/forgotPassword`: Send a password reset email to the user.
`PATCH /users/resetPassword/:token`: Reset the user's password using a reset token.
`PATCH /users/password`: Update the user's password (restricted to authenticated users).
`GET /users/currentUser`: Get the current user's data.
`PATCH /users/currentUser`: Update the current user's data (restricted to authenticated users).
`DELETE /users/currentUser`: Delete the current user's account (restricted to authenticated users).
`GET /users`: Get all users (restricted to admins).
`POST /users`: Create a new user (restricted to admins).
`GET /users/:id`: Get a single user by their ID (restricted to admins).
`PATCH /users/:id`: Update a user by their ID (restricted to admins).
`DELETE /users/:id`: Delete a user by their ID (restricted to admins).

### View Routes
`GET /`: Get an overview of all tours.
`GET /tour/:slug`: Get a single tour by its slug.
`GET /login`: Get the login form.
`GET /me`: Get the current user's account page (restricted to authenticated users).
`GET /my-tours`: Get the current user's booked tours page (restricted to authenticated users).

## Built With To Demonstrate Understanding of:

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)

## NPM Packages Used:

* [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme): Optimized bcrypt in JavaScript with zero dependencies
* [compression](https://github.com/expressjs/compression#readme): Node.js compression middleware
* [cookie-parser](https://github.com/expressjs/cookie-parser#readme): Parse Cookie header and populate req.cookies with an object keyed by the cookie names
* [dotenv](https://github.com/motdotla/dotenv#readme): Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
* [express-csp](https://github.com/yahoo/express-csp#readme): allows you to set the content-security-policy for your Express Application
* [express-mongo-sanitize](https://github.com/fiznool/express-mongo-sanitize#readme): Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection
* [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit#readme): Basic rate-limiting middleware for Express
* [helmet](https://helmetjs.github.io/): helps you secure your Express apps by setting various HTTP headers
* [hpp](https://github.com/analog-nico/hpp#readme): protect against HTTP Parameter Pollution attacks
* [html-to-text](https://github.com/html-to-text/node-html-to-text#readme): HTML to X converters
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme): An implementation of JSON Web Tokens
* [morgan](https://github.com/expressjs/morgan#readme): HTTP request logger middleware for node.js
* [multer](https://github.com/expressjs/multer#readme): for handling multipart/form-data, primarily uploading files
* [nodemailer](https://nodemailer.com/about/): allow easy as cake email sending
* [prettier](https://prettier.io/): An opinionated code formatter
* [pug](https://github.com/pugjs/pug/tree/master/packages/pug#readme): template engine for Node.js
* [sharp](https://github.com/lovell/sharp#readme): to convert large images in common formats to smaller, web-friendly images
* [slugify](https://github.com/simov/slugify#readme): create slugs
* [stripe](https://github.com/stripe/stripe-node#readme): convenient access to the Stripe API
* [validator](https://github.com/validatorjs/validator.js#readme): library of string validators and sanitizers
* [xss-clean](https://github.com/jsonmaur/xss-clean#readme): sanitize user input coming from POST body, GET queries, and url params

## Author

* Austin Parvin

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.