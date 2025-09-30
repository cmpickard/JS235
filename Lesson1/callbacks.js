// Write a function basicCallback that receives a callback function and a
// numeric argument. This function should execute the callback after 2
// seconds, passing it the number it received as an argument.


// // Example usage:
// basicCallback((number) => {
//   console.log(number * 2);
// }, 5);
// // After 2 seconds, logs: 10

// function basicCallback(callback, number) {
//   setTimeout(callback.bind(null, number), 2000);
// }

// basicCallback((num) => console.log(num), 10);

// Create a function downloadFile that receives a callback function as an
// argument and simulates downloading a file by logging "Downloading file..."
// After a delay of 1.5 seconds, it should call the callback with the
// argument "Download complete!".

// function downloadFile(callback) {
//   console.log('Downloading file...');
//   setTimeout(callback.bind(null, 'download complete'), 1500);
// }

// downloadFile((str) => console.log(str));

// Write a function processData that takes in two parameters: an array of
// numbers and a callback function. This function should use setTimeout to
// simulate a time-consuming computation by waiting 1 second. After the
// delay, the callback should be applied to each number in the array.
// Then, the new array should be logged.

function processData(nums, callback) {
  let applyCallback = function() {
    console.log(nums.map(num => callback(num)));
  };

  setTimeout(applyCallback, 1000);
}

function addOne(num) {
  return num + 1;
}

let nums = [1,2,3,4];
processData(nums, addOne);

// Build a function waterfallOverCallbacks that chains the execution of
// multiple callbacks. This function should take an array of callbacks
// and an initial value as arguments. The main function should pass the
// return value of each callback to the next callback in the array, using
// the initial value as the argument to the first callback.

// Copy Code
// // Example usage:
// const double = (x) => x * 2;
// waterfallOverCallbacks([double, double, double], 1);
// // Logs: 8

function waterfallOverCallbacks(...callbacks) {
  let val = callbacks.pop();
  return callbacks.reduce((acc, callback) => callback(acc), val);
}

const double = x => x * 2;
console.log(waterfallOverCallbacks(double, double, double, 1));

// Consider the function startCounter that accepts a callback. It should
// use setInterval to call the callback every second, incrementing and
// logging a counter variable each time. Also, provide a way for the
// callback to stop the counter after reaching a specified value.

// // Example usage:
// startCounter((count) => {
//   console.log(count);
//   return count === 5;
// });
// // Logs 1, 2, 3, 4, 5, then stops

function count(count) {
  console.log(count);
  return count === 5;
}

function startCounter(callback) {
  let count = 0;
  let id = setInterval(() => {
    count++;
    if (callback(count)) clearInterval(id);
  }, 1000);
}

startCounter(count);