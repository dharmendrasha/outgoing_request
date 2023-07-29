# @dharmendrasha/outgoing_request

NodeJs Outgoing request logger

1. [GITHUB link](https://github.com/dharmendrasha/outgoing_request)

2. [NPM link](https://www.npmjs.com/package/@dharmendrasha/outgoing_request)

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

## CommonJS

eg.

```javascript
const { config, handler } = require('@dharmendrasha/outgoing_request')
const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

handle(
  function onRequest(id, method, host, path, protocol, headers){/* callback for onRequest */}, 
  function onResponse(id, method, rawHeaders, statusCode, statusMessage:, httpVersion){/* callback for nResponse */}
  )

app.get('/', async (req, res) => {

  await axios.get('https://github.com/dharmendrasha' /* any third party api can call indipendently and and request will be traced to the console and '@dharmendrasha/outgoing_request' */)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Typescript

eg.

```typescript
//OutGoingRequestHandler.ts
import { Request, Response, NextFunction } from 'express';
import { config, handle } from '@dharmendrasha/outgoing_request';
import { logger } from './log.util';



//main.ts
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

async function bootstrap(){
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: logger,
      abortOnError: isDevelopment(),
      bufferLogs: isDevelopment(),
  });

  app.disable('x-powered-by');

  handle(
    (id: string, method: string, host: string | number | string[] | undefined, path: string, protocol: string, headers: OutgoingHttpHeaders) => { /** call back for on request */},
    (id: string, method: string | undefined, url: string | undefined, rawHeaders: IncomingHttpHeaders, statusCode: number | undefined, statusMessage: string | undefined, httpVersion: string) => { /** call back for on response **/}
    );

  app.listen(port);
}

bootstrap();

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
