# @dharmendrasha/outgoing_request

NodeJs Outgoing request logger

## Installation

Install this package with multiple package manager like pnpm | yarn | yarn take a look these commands

```bash
# npm
npm i @dharmendrasha/outgoing_request

# yarn
yarn install @dharmendrasha/outgoing_request

# pnpm
pnpm add @dharmendrasha/outgoing_request

```

# Usage

```javascript
const { config, handler } = require('@dharmendrasha/outgoing_request')
const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

app.use((req, res, next) => {
    handle(config, req, res)
    next()
    return
})

app.get('/', async (req, res) => {

  await axios.get('https://github.com/dharmendrasha' /* any third party api can call indipendently and and request will be traced to the console and '@dharmendrasha/outgoing_request' */)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

# Sample Config

```typescript
import crypto from "crypto";

export const config = {
  request_body: true, // should body be printed after response
  logger: console, // native node console
  disable_brand: false, // will log the 'x-traced-by' to the request and response header
  getId: () => crypto.randomUUID(), // generate a uuid for each request to maintain
  onRequest: (
    id: string,
    method: string,
    host: string,
    path: string,
    headers: string
  ) => {
    config.logger.log({ id, method, host, path, headers });
  },
  onResponse: (
    id: string,
    rawHeaders: string,
    statusCode: string,
    statusMessage: string,
    httpVersion: string
  ) => {
    config.logger.log({
      id,
      rawHeaders,
      statusCode,
      statusMessage,
      httpVersion,
    });
  },
};

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
