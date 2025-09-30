/* eslint-disable no-confusing-arrow */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable indent */
// Create a function called flakyService that simulates a service that
// sometimes fails. The function should return a promise that resolves with
// "Operation successful" or rejects with "Operation failed" randomly.
// Use .then() for a successful operation log and .catch() for logging a
// failed operation.

function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > .5) {
      resolve();
    } else {
      reject();
    }
  });
}

let resolveService = () => console.log("Operation successful");
let rejectService = () => console.log("Operation failed");

let servicePromise = flakyService();
servicePromise.then(resolveService)
              .catch(rejectService);

// Imagine a situation where you must clean up resources (e.g., close a file)
// whether an operation succeeds or fails. Create a promise that resolves
// with "Operation complete" and demonstrate how to perform cleanup after
// the operation completes using .finally().

let promise2 = new Promise((resolve) => resolve('Operation Complete'));
promise2.finally(() => console.log('doing cleanup'));

// Practice chaining promises by creating a chain of four promises. The
// first promise should resolve with a number; then, the chain should double
// the number and add 5 in successive .then() calls. Log the result after the
// final operation.

let promise3 = new Promise(resolve => resolve(10));
promise3.then((val) => new Promise(resolve => resolve(val * 2)))
        .then((val) => new Promise(resolve => resolve(val + 5)))
        .then((val) => console.log(val)); // 25

// Suppose you are fetching user data from an API. Handle the error thrown
// by this fetchUserData function, catch it, and log only the error message.
// Then, use .finally() to log "Fetching complete".

function fetchUserData() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    setTimeout(() => reject({ error: "User not found" }), 500);
  });
}

fetchUserData().catch((errorObj) => console.log(errorObj.error))
               .finally(() => console.log('fetching complete'));

// Implement a function retryOperation that attempts to perform an operation
// by calling a provided function, operationFunc. If operationFunc throws an
// error, retryOperation should retry the operation up to two additional times
// before giving up and logging "Operation failed".

// // Example usage:
// retryOperation(
//   () =>
//     new Promise((resolve, reject) =>
//       Math.random() > 0.33
//         ? resolve("Success!")
//         : reject(new Error("Fail!"))
//     )
// );

function retryOperation(func, retries = 3) {
  if (retries === 0) {
    console.log('Operation failed');
    return;
  }

  let promise = func();
  promise.then()
         .catch(() => retryOperation(func, retries - 1));
}

retryOperation(
  () =>
    new Promise((resolve, reject) =>
      Math.random() > 0.33
        ? resolve("Success!")
        : reject(new Error("Fail!"))
    )
);

// Imagine an async operation represented by mockAsyncOp that can either
// resolve or reject. You want to ensure that no matter the outcome, you log
// "Operation attempted" after the operation has been completed.

function mockAsyncOp() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Operation succeeded");
      } else {
        reject("Operation failed");
      }
    }, 1000);
  });
}
mockAsyncOp().finally(() => console.log('operation attempted'));


// Implement a loadData function that fetches data but sometimes fails. It
// should return a promise that either fulfills with "Data loaded" or rejects
// with "Network error". Use a .catch() block to return a recovery promise
// that resolves with "Using cached data" in case of failure.

function loadData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0) {
                resolve('Data loaded');
            } else {
                reject('Network error');
            }
        }, 500);
    }).catch(() => {
        console.log('Encountered a network error. Recovering...');
        return new Promise((resolve) => resolve('using cached data'));
    });
}

loadData().then((val) => console.log(val));
