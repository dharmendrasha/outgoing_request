import { config } from "./../conf/index";
import http from "http";
import https from "https";
import { getPackageName } from "./readPackage";

declare global {
  namespace Http {
    namespace IncomingMessage {
      export interface headers {
        ["x-traced-by"]?: string;
      }
    }
  }
}

function outgoingRequest(conf: typeof config) {
  return function closure(this: any, func: Function, ...rest: any[]) {
    const req = func.call(this, ...rest);

    const id = conf.getId();

    if (conf.request_body) {
      emitWithRequestBody(req, id, conf);
    } else {
      req.prependOnceListener("finish", () =>
        conf.onRequest(
          id,
          req.method,
          req.getHeader("host"),
          req.path,
          req.getHeaders()
        )
      );
    }

    req.prependOnceListener(
      "response",
      function (
        /** @type {http.IncomingMessage} */ res: {
          rawHeaders: any;
          statusCode: any;
          statusMessage: any;
          httpVersion: any;
        }
      ) {
        const { rawHeaders, statusCode, statusMessage, httpVersion } = res;

        conf.onResponse(id, rawHeaders, statusCode, statusMessage, httpVersion);
      }
    );

    return req;
  };
}

function emitWithRequestBody(req: any, id: string, conf: typeof config) {
  const requestBody: any[] = [];

  const { Buffer } = require("buffer");
  const reqWrite = req.write;
  req.write = function (...args: any) {
    const chunk = args[0];

    if (Buffer.isBuffer(chunk)) {
      requestBody.push(chunk.toString());
    } else {
      requestBody.push(chunk);
    }

    return reqWrite.apply(this, ...args);
  };

  const reqEnd = req.end;
  req.end = function (...args: any[]) {
    const maybeChunk = args[0];

    if (Buffer.isBuffer(maybeChunk)) {
      requestBody.push(maybeChunk.toString());
    } else if (maybeChunk && typeof maybeChunk !== "function") {
      requestBody.push(maybeChunk);
    }

    return reqEnd.apply(this, arguments);
  };

  req.prependOnceListener("finish", () =>
    conf.onRequest(
      id,
      req.method,
      req.getHeader("host"),
      req.path,
      req.getHeaders()
    )
  );
}

export function handle(
  conf = config,
  req?: http.IncomingMessage,
  res?: http.OutgoingMessage
) {
  const packageName = getPackageName();
  if (conf.disable_brand === false) {
    if (req) req.headers["x-traced-by"] = packageName;
    if (res) res.setHeader("x-traced-by", packageName);
  }
  // http
  http.request = outgoingRequest(conf).bind(http, http.request);
  http.get = outgoingRequest(conf).bind(http, http.get);

  // https
  https.get = outgoingRequest(conf).bind(https, https.get);
  https.request = outgoingRequest(conf).bind(https, https.request);
}
