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

app.use((req, res, next) => {
    handle(
      config /* create your own like https://github.com/dharmendrasha/outgoing_request#sample-config*/, 
      req, 
      res)
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

## Typescript

eg.

```typescript
//OutGoingRequestHandler.ts
import { Request, Response, NextFunction } from 'express';
import { config, handle } from '@dharmendrasha/outgoing_request';
import { logger } from './log.util';

export function OutGoingRequestLogger() {
    return (_req: Request, _res: Response, next: NextFunction) => {
        config.onRequest = (..._args: string[]) => null;
        config.onResponse = (id, rawHeaders, statusCode, message, httpVersion) => {
            const is4xx = Number(statusCode) > 399;
            if (!is4xx) {
                return;
            }

            logger.error(
                `request failed headers=${String(
                    rawHeaders,
                )} statusCode=${statusCode} message=${String(
                    message,
                )} version=${httpVersion} id=${id}`,
            );
        };
        handle(config, _req, _res);
        return next();
    };
}

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

  app.use(OutGoingRequestLogger());

  app.listen(port);
}

bootstrap();

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
