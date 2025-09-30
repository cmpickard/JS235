// Write out the raw text of the HTTP request that will be sent to the server
// by the last example above.

/*
  let data = { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke' };
  let json = JSON.stringify(data);

  let response = await fetch('https://lsjs230-book-catalog.herokuapp.com/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: json,
  });


POST /books HTTP/1.1
Host: lsjs230-book-catalog.herokuapp.com
Content-Type: application/json; charset=utf-8
Accept: * /*

{
  'title': 'Eloquent JavaScript',
  'author': 'Marijn Haverbeke'
}

*/


// Write some JavaScript to create a new product by sending a request to the
// JSON API on our web store. To create a product, make a POST request to
// https://ls-230-web-store-demo.herokuapp.com/v1/products. To make the
// post request, you'll need the following:

// Content-Type header set to application/json; charset=utf-8
// Authorization header set to token AUTH_TOKEN
// json object with the following properties:
// name
// sku (must have 3 or more characters)
// price (must be an integer greater than 0)

async function createProduct() {
  let data = {
    name: 'hammer',
    sku: 'HAM345',
    price: 12,
  };

  let json = JSON.stringify(data);
  let result = await fetch('https://ls-230-web-store-demo.herokuapp.com/v1/products',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'token AUTH_TOKEN',
      },
      body: json,
    }
  );
  console.log(result);
}

createProduct();