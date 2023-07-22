import crypto from "crypto";

export const config = {
  request_body: true,
  logger: console,
  disable_brand: false,
  getId: () => crypto.randomUUID(),
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
