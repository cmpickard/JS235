/* eslint-disable no-unused-vars */
// Convert the downloadFilePromise function you saw previously to an
// asynchronous function named asyncDownloadFile. Utilize await to pause
// execution until the file download completes before logging the success
// message.

// function downloadFilePromise() {
//   return new Promise((resolve) => {
//     console.log('starting download');
//     setTimeout(() => {
//       resolve('download complete!');
//     }, 1500);
//   });

async function asyncDownloadFile() {
  console.log('Downloading file...');
  const message = await new Promise(resolve => {
    setTimeout(() => {
      resolve('Download complete!');
    }, 1500);
  });
  console.log(message);
}

// asyncDownloadFile();

// Create a processNTimes function that takes an array of numbers, a
// callback, and a number, n, as an argument. The function should utilize
// the processDataPromise function we wrote before and apply it to the
// input array of numbers n times. Here's an example:

function processDataPromise(numbers, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const processed = numbers.map(callback);
      resolve(processed);
    }, 1000);
  });
}

let squareIt = num => num * num;

async function processNTimes(nums, callback, times) {
  while (times > 0) {
    nums = await processDataPromise(nums, callback);
    times--;
  }

  return nums;
}

// processNTimes([1,2,3], squareIt, 3).then(console.log);

// Write a getReady function that utilizes at least three asynchronous
// functions that you write to simulate getting ready in the morning. Each
// task should take time and not begin until the task before has been
// completed. getReady should utilize async / await.

// Here's an example of how your getReady function may behave:

// getReady();
// // Good morning!
// // Petting cat...
// // Getting dressed... (5 seconds later)
// // Brushing teeth...  (3 seconds later)
// // I'm ready!         (2 seconds later)

async function getReady() {
  console.log(await shower());
  console.log(await brushTeeth());
  console.log(await getDressed());
}

function shower() {
  console.log('Showering!');
  return new Promise((resolve) => {
    setTimeout(resolve, 1000, 'Done showering!');
  });
}

function brushTeeth() {
  console.log('Brushing Teeth!');
  return new Promise((resolve) => {
    setTimeout(resolve, 1000, 'Done brushing!');
  });
}

function getDressed() {
  console.log('Getting Dressed!');
  return new Promise((resolve) => {
    setTimeout(resolve, 1000, 'Done dressing!');
  });
}

makeCoffee();
getReady();


// Expand upon the previous problem to demonstrate that async functions are
// non-blocking. Write another makeCoffee function that should start a pot
// of coffee before we start getting ready for the day. After some delay,
// we should signal that the coffee is ready.

async function makeCoffee() {
  console.log('Starting the coffee');
  console.log(await new Promise(resolve => setTimeout(resolve, 4000, 'Brewed!')));
}