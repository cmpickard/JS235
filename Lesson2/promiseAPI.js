/* eslint-disable prefer-promise-reject-errors */
// Use Promise.all() to execute two instances of the flakyService function and
// one of the loadData function concurrently. Log the results if all the
// operations are successful. Handle the situation where one or more of the
// promises might fail by logging "One or more operations failed".

function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject("Operation failed");
    }
  });
}

function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Data loaded");
      } else {
        reject("Network error");
      }
    }, 1000);
  });
}

let flake1 = flakyService();
let flake2 = flakyService();
let load = loadData();
let allPromises = Promise.all([flake1, flake2, load]);
allPromises
  .then((results) => console.log(results))
  .catch(() => console.log('One or more operations failed'));

// Imagine you have two promises, firstResource and secondResource, that
// resolve after different intervals. Use Promise.race() to log the value
// of whichever promise resolves first.

const firstResource = new Promise((resolve) =>
  setTimeout(() => resolve("First resource loaded"), 500)
);
const secondResource = new Promise((resolve) =>
  setTimeout(() => resolve("Second resource loaded"), 1000)
);

Promise.race([firstResource, secondResource]).then((value) => {
  console.log(value);
});

// You have multiple instances of flakyService promises. Implement a strategy
// using Promise.allSettled() to execute all services but log all the different
// outcomes, whether fulfilled or rejected.

const services = [flakyService(), flakyService(), flakyService()];
Promise.allSettled(services).then(results => {
  services.forEach((_, idx) => `Service #${idx + 1}: ${results[idx]}`);
});

// Once again, you have multiple instances of flakyService promises. Implement
// a strategy using Promise.any() to execute all services and return the result
// of the first service that succeeds. If all services fail, log an error
// message.

// const services = [flakyService(), flakyService(), flakyService()];
Promise.any(services)
  .then((result) => console.log(result))
  .catch(() => "All services failed");

// Implement a function timeoutPromise(promise, ms) that takes a promise and
// a timeout duration in milliseconds. If the promise resolves before the
// timeout, return its result. Otherwise, reject with the message "Operation
// timed out".

// You can use the loadData function, which takes one second to resolve or
// reject, to test out your method.

// Example usage:

// timeoutPromise(loadData(), 500)
//   .then(console.log)
//   .catch(console.error);
// // Expected output: "Operation timed out" (because it exceeds 500ms)

function timeoutPromise(promise, ms) {
  let timedPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject("Operation timed out.");
    }, ms);
  });

  return Promise.race([promise, timedPromise]);
}