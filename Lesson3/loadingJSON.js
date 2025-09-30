// Write some JavaScript code that loads JSON data from
// https://api.github.com/repos/rails/rails, parses the JSON into a
// JavaScript object, and then logs the HTTP status code and the number of
// open issues to the console. The property to get the number of open
// issues is open_issues. You may assume the API will always return valid
// JSON data.

// 200
// 1159 // This should be whatever the current value is. Will vary.

async function contactRails(path) {
  try {
    let result = await fetch(path);
    console.log(result.status);
    let json = await result.json();
    console.log(json.open_issues_count);
  } catch (_) {
    console.log('The request could not be completed!');
  }
}

contactRails('https://api.github.com/repos/rails/rails');

// Extend the code from the previous exercise to log the message 'The request
// could not be completed!' to the console when the request produces an
// error. You may replace the URL in the previous exercise with
// "hts://api.github.com/repos/rails/rails" so that the error handler will
// be triggered.

contactRails("hts://api.github.com/repos/rails/rails");