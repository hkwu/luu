# luu
A Node.js client library for the University of Waterloo's Open Data API.

## Installation
Run

```bash
npm install --save luu
```

## Usage
Import the `Client` from luu.

```js
import { Client } from 'luu';

const client = new Client('YOUR_API_KEY');
```

Or, with `require()`,

```js
const luu = require('luu');

const client = new luu.Client('YOUR_API_KEY');
```

Make a request.

```js
// request() returns a promise which resolves to the JSON response from the API
client.request('foodservices/menu').then(console.log).catch(console.error);
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
```
