/* eslint-disable max-len */
// In the last assignment, we wrote our promise-based version of washLaundry.
// Expand upon this by rewriting the bakeCookies function from this assignment
// to use promises. Then, invoke the functions such that we start our laundry
// and then begin baking cookies.

// function washLaundry() {
//   console.log("Putting clothes in wash.");
//   console.log("Adding soap.");

//   console.log("Washing laundry...");
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Buzz!");
//       resolve();
//     }, 5000);
//   });
// }

// function bakeCookies() {
//   console.log("Beginning baking");
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('Brrrng!');
//       resolve();
//     }, 2000);
//   });
// }

// washLaundry().then(() => {
//   console.log("Folding Laundry.");
//   console.log("Putting away Laundry.");
// });

// bakeCookies().then(() => {
//   console.log("Cookies are done!");
// });


// Continuing with our chores example, expand upon the previous problem to
// complete our "after laundry" and "after cookies" actions once each task
// has been completed. Write a doChores function that manages both
// washLaundry and bakeCookies.

// function doChores() {
//   washLaundry().then(() => {
//     console.log("Folding Laundry.");
//     console.log("Putting away Laundry.");
//   });

//   bakeCookies().then(() => {
//     console.log("Cookies are done!");
//   });
// }

// doChores();

// Rewrite this callback-based downloadFile function as a new promise-based
// function called downloadFilePromise. Instead of using a callback, it should
// return a promise that resolves with the message "Download complete!"
// after a delay.

// Copy Code
// function downloadFile(callback) {
//   console.log("Downloading file...");
//   setTimeout(() => {
//     callback("Download complete!");
//   }, 1500);
// }

// function downloadFilePromise() {
//   return new Promise((resolve) => {
//     console.log('starting download');
//     setTimeout(() => {
//       resolve('download complete!');
//     }, 1500);
//   });
// }

// downloadFilePromise().then((msg) => console.log(msg));

// Convert this processData function to a new function named processDataPromise
// that uses promises. This function should return a promise that processes
// an array of numbers after a delay, utilizing the .then() method for
// logging the altered array.

// function processData(numbers, callback) {
//   setTimeout(() => {
//     const processed = numbers.map(callback);
//     console.log(processed);
//   }, 1000);
// }

// // Example usage:
// processData([1, 2, 3], (number) => number * 2);
// // After 1 second, logs: [2, 4, 6]
// Here's how we'll use our new promise-based version:
// // Example usage:
// processDataPromise([1, 2, 3], (number) => number * 2).then((processedNumbers) => {
//   console.log(processedNumbers);
//   // After 1 second, logs: [2, 4, 6]

function processDataPromise(arr, callback) {
  let result = [];
  return new Promise((resolve) => {
    setTimeout(() => {
      arr.forEach(num => result.push(callback(num)));
      resolve(result);
    }, 1000);
  });
}

processDataPromise([1, 2, 3], num => num + 1).then((value) => {
  console.log(value);
});