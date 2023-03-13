const fs = require('fs');
const crypto = require('crypto');
process.env.UV_THREADPOOL_SIZE = 1;

const start = Date.now();
setTimeout(() => console.log('Timer 1 finished'), 0);

setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('./test-file.txt', () => {
  console.log('I/O finished');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);

  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, ' Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, ' Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, ' Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, ' Password Encrypted');
  });
});

console.log('Hello from the top-level code!');

// With this code we would expect the following output:
// Hello from the top-level code!
// Immediate 1 finished
// Timer 1 finished
// I/O finished
// Process.nextTick
// Timer 2 finished
// Timer 3 finished
// Immediate 2 finished

// But sometimes the following can happen:
//   Hello from the top-level code!
// a Timer 1 finished
// b Immediate 1 finished
//   I/O finished
//   Process.nextTick
// c Immediate 2 finished
// d Timer 2 finished
// e Timer 3 finished

// Why was a before b?
// Technically, the poll phase controls when timers are executed.
// Without a scheduled I/O loop phase, there is no control on callback execution order.
// By moving the fs.readFile() to the top, you can always guarantee timer => setImmediate execution order

// Why was c before d & e?
// when we are in the polling phase, it will actually wait there for a I/O task or for an expired timer.
// So technically the next phase is setImmediate() within the fs.readFile() callback
