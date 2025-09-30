/* eslint-disable no-unused-vars */
// Write a function named startCounting that logs a number to the console
// every second, starting with 1. Each number should be one greater than
// the previous number.

let id;

function startCounting() {
  let count = 0;
  id = setInterval(() => {
    count++;
    console.log(count);
  }, 1000);
}

// Extend the code from the previous problem with a stopCounting function
// that stops the logger when called.

function stopCounting() {
  clearInterval(id);
}


// Write a program that does the following:

// Logs "Starting..." immediately.
// Every 2 seconds, logs "Hello!".
// After 10 seconds, stops logging "Hello!" and logs "Goodbye!".

console.log('Starting...');
let clearID = setInterval(() => console.log('Hello!'), 2000);
setTimeout(() => {
  clearInterval(clearID);
  console.log('Goodbye!');
}, 10000);