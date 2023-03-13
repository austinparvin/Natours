const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const checkId = (req, res, next, val) => {
  const tour = tours.find((tour) => tour.id == val);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id == id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour {here}',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
};
