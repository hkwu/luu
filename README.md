# luu
[![Latest Stable Version](https://img.shields.io/npm/v/luu.svg)](https://www.npmjs.com/package/luu)
[![License](https://img.shields.io/github/license/hkwu/luu.svg)](https://www.npmjs.com/package/luu)

A Node.js client library for the University of Waterloo's Open Data API.

## Installation

```bash
npm install --save luu
```

## Usage
Import the `Client` from luu.

```js
import { Client } from 'luu';

const client = new Client('YOUR_API_KEY');
```

Make a request.

```js
// request() returns a promise which resolves to a Fetch Response object
// the client will reject the promise automatically for non 200-level HTTP responses
client.request('foodservices/menu')
  .then(response => response.json())
  .then(console.log)
  .catch(console.error);
```

You can specify parameters for the endpoint string as well. This library uses [sprintf-js](https://www.npmjs.com/package/sprintf-js) to parse the endpoint string. Pre-defined parameterized endpoint strings are exported through `Constants`.

```js
import { Constants } from 'luu';

client.request(Constants.FS_YEAR_WEEK_MENU, {
  year: 2015,
  week: 2,
}).then(console.log);

// equivalent to
client.request('foodservices/%(year)s/%(week)s/menu', {
  year: 2015,
  week: 2,
}).then(console.log);

// specify an array of parameters
client.request(Constants.FS_YEAR_WEEK_MENU, [2015, 2]).then(console.log);
```
