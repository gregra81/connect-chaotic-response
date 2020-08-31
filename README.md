# Connect Chaotic Response
> A lightweight connect/express middleware that plugs chaotic http behaviour into your server

Chaotic is intended for anyone who needs to test scenarios where his server might become flaky in the best case, non-responsive in the worst case and anything between. It enables to plug (in a configurable fashion) random http errors and timeouts into any node server that uses connect/express (or connect/express like) HTTP server framework. 


By default Chaotic will run in the `optimistic` mode that for 99% of requests to your server, will do nothing special for successful responses (http 2xx codes) and http 3xx responses. 1% of your server requests will be "hijacked" by the Chaotic middleware and will randomly generate error responses (http 4xx or 5xx codes) or a timed out (successful) response. For other, more "interesting" ;) modes, see the [Configuration](#configuration) section.

## Installation

```
npm install connect-chaotic-response --save
```

## Usage as an express/connect middleware

```js
const express = require('connect');

// get the Chaotic response module
const ChaoticResponse = require('connect-chaotic-response');
const app = connect();

// Create a new chaoticResponse, optionaly with options
const chaoticResponse = new ChaoticResponse(options);

// wire your app with the Chaoutic middleware
app.use(chaoticResponse.middleware);

app.listen(3000);

```

## Configuration
Chaotic supports these modes:

* `optimistic` - 99% - normal, 0.5% - 401, 0.1% - 429, 0.1% - 500, 0.1% - 503, 0.1% - 504, 0.1% - 7 seconds (by default) timeout
* `pessimistic` - 50% - normal, 5% - 401, 5% - 429, 10% - 500, 10% - 503, 10% - 504, 10% - 7 seconds (by default) timeout
* `timeout` - 1% - normal, 1% - 401, 6% - 429, 1% - 500, 1% - 503, 10% - 504, 80% - 7 seconds (by default) timeout
* `failure` - 1% - normal, 1% - 401, 5% - 429, 40% - 500, 40% - 503, 10% - 504, 3% - 7 seconds (by default) timeout

To set a specific mode:
```js
// Create a new chaoticResponse, with the 'pessimistic' mode
const chaoticResponse = new ChaoticResponse({mode: 'pessimistic'});

// wire your app with the Chaoutic middleware
app.use(chaoticResponse.middleware);
```
You could also change the mode sometime later in your program by calling `ChaoticResponse.setMode(mode);`.

### Options
The `chaoticResponse` constructor accepts an optional object with these options:

* `mode` - As explained above. Supports optimistic, pessimistic, timeout, failure
* `timeout` - The timeout in milliseconds for timed out responses
* `customMode` - Enables to create a personal chaotic mode that consists of any (allowed) http responses and their related weights. `customMode` accepts an object of two arrays: `responses` and `weights` that represent the desired mix of the server's flaky behaviour. For a the full list of allowed http codes see [the responses list](../blob/master/lib/responses.js). If the `customMode` option is provided together with the `mode` option, Chaotic will ignore the `mode` option and use the `customMode` behaviour.

An example of using `customMode` + changing default timeout:
```js

// Set a custom mode and a 10 seconds timeout
const options = {
  customMode: {
    responses: [200, 201, 409, 500, 0],
    weights: [5, 5, 2, 2, 1]
  },
  timeout: 10000
};

// Create a new chaoticResponse, with the above options
const chaoticResponse = new ChaoticResponse(options);

// wire your app with the Chaoutic middleware
app.use(chaoticResponse.middleware);
```

### Callback for error responses
By default the middleware doesn't call `next()` for an error response and simply returns an error. If you require to
run a function that is fired whenever an error occurs, you can add you callback function by setting the `ChaoticResponse.callbackOnError`.

## Contributing

1. Fork it
1. Install dependencies `npm install`
1. Ensure `npm test` and `npm run lint` run successfully
1. Submit a pull request
