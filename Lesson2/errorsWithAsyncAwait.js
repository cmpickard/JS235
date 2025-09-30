// When learning about promises, We wrote a flakyService function and used
// then and catch to manage its result. Now, rewrite the code that calls
// flakyService to use async / await instead. Don't change the flakyService
// function itself.

function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject(new Error("Operation failed"));
    }
  });
}

// flakyService().then(console.log).catch(console.error);

async function tryFlakyService() {
  try {
    let result = await flakyService();
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
}

tryFlakyService();

// Write an async function to provide the same behavior as our promise
// chain in this code:

function operation() {
  return new Promise((resolve) => {
    console.log("Operation started");
    setTimeout(() => {
      resolve("Operation complete");
    }, 1000);
  });
}

// operation()
//   .then(console.log)
//   // Logs: Operation complete
//   .finally(() => {
//     console.log("Cleaning up resources...");
//     // Always logs after operation completion
//   });

async function tryOperation() {
  try {
    let result = await operation();
    console.log(result);
  } finally {
    console.log("Cleaning up resources");
  }
}

tryOperation();

// Update retryOperation to use async / await:

// function retryOperation(operationFunc) {
//   let attempts = 0;

//   function attempt() {
//     return operationFunc().catch((err) => {
//       if (attempts < 2) {
//         attempts++;
//         console.log(`Retry attempt #${attempts}`);
//         return attempt();
//       } else {
//         throw err;
//       }
//     });
//   }

//   return attempt().catch(() => console.error("Operation failed"));
// }

async function retryOperation(operationFunc) {
  let attempts = 0;
  let result = null;

  while (attempts < 2) {
    try {
      result = await operationFunc();
      break;
    } catch (_) {
      attempts++;
      if (attempts < 2) {
        console.log(`Retry attempt #${attempts}`);
      } else {
        console.log("Operation failed");
      }
    }
  }

  return result;
}

retryOperation();

// Rewrite loadData to use async / await. Then, show how we would utilize
// the function instead of the existing call to then:

// function loadData() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (Math.random() > 0.5) {
//         resolve("Data loaded");
//       } else {
//         reject("Network error");
//       }
//     }, 1000);
//   }).catch(() => {
//     console.error("An error occurred. Attempting to recover...");
//     // Return a recovery promise
//     return Promise.resolve("Using cached data");
//   });
// }

// loadData().then(console.log);
// // Logs "Data loaded" or "Using cached data"

async function loadData() {
  function load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("Data loaded");
        } else {
          reject(new Error("Network error"));
        }
      }, 1000);
    });
  }

  try {
    console.log(await load());
  } catch (_) {
    console.error("An error occurred. Attempting to recover...");
    console.log("Using cached data");
  }
}

loadData();