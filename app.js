const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const port = 3000;

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server side', app: 'Fixes' });
// });

// app.post('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'You can post to this endpoint...', app: 'Fixes' });
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
