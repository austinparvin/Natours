const Calculator = require('./test-module-1');

const calc1 = new Calculator();
console.log(calc1.add(2, 3));

// const calc2 = require('./test-module-2');
const { add, multiply, divide } = require('./test-module-2');
console.log(add(5, 3));
console.log(multiply(5, 3));
console.log(divide(15, 5));

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
