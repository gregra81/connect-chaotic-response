# Connect Chaotic Response
Chaotic http responses middleware for connect and express. It enables to plug (configurable) random http errors and timeouts into any node server that uses connect/express (or connect/express like) HTTP server framework.


By default Chaotic will run in the `optimistic` mode that for 99% of requests to your server, will do nothing special for successfull responses (http 2xx codes) and http 3xx responses. 1% of your server requests will be "hijacked" by the Chaotic middleware and will randomly generate error responses (http 4xx or 5xx codes) or a timed out (succesffull) response. For other, more "interesting" ;) modes, see the [Configuration](#configuration) section.

## Installation

```
npm install connect-chaotic-response --save
```

## Usage as an express/connect middleware

```js
const express = require('connect');
const chaoticResponse = require('connect-chaotic-response');
const app = connect();

const ChaoticResponse = new chaoticResponse();
app.use(ChaoticResponse.middleware);

app.listen(3000);

```

## Configuration
 

Other supported modes are:
* `pessimistic` - Will return as is 50% of your server requests, 5% for 

## Contributing

1. Fork it
1. Install dependencies `npm install`
1. Ensure `npm test` and `npm run lint` run successfully
1. Submit a pull request
