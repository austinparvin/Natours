const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1
  // fs.readFile('./test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  // Solution 2: Streams (this causes Back Pressure)
  // Readable stream is emitting 'data' events faster than we can res.write() them
  // const readable = fs.createReadStream('./test-file.txt');
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   res.end();
  // });
  // readable.on('error', () => {
  //   res.statusCode = 500;
  //   res.end('file not found');
  // });
  // Solution 3: Pipe

  const readable = fs.createReadStream('./test-file.txt');
  readable.pipe(res)
});

server.listen(8000, '127.0.0.1', () => console.log('Listening...'));
