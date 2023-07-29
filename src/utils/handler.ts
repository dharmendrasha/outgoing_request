import http, {
  ClientRequest,
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
} from "http";
import https from "https";
import crypto from "crypto";

export type onRequest = (
  id: string,
  method: string,
  host: string | number | string[] | undefined,
  path: string,
  protocol: string,
  headers: OutgoingHttpHeaders
) => any;

export type onResponse = (
  id: string,
  method: string | undefined,
  url: string | undefined,
  rawHeaders: IncomingHttpHeaders,
  statusCode: number | undefined,
  statusMessage: string | undefined,
  httpVersion: string
) => any;

const generateId = (): string => crypto.randomUUID();

function outgoingRequest(
  onRequest: onRequest,
  onResponse: onResponse,
  getId = generateId
) {
  return function (this: any, func: Function, ...rest: any[]) {
    const req: ClientRequest = func.call(this, ...rest);

    const id = getId();

    req.prependOnceListener("finish", () =>
      onRequest(
        id,
        req.method,
        req.getHeader("host"),
        req.path,
        req.protocol,
        req.getHeaders()
      )
    );

    req.prependOnceListener("response", function (res: IncomingMessage) {
      const { headers, method, url, statusCode, statusMessage, httpVersion } =
        res;

      onResponse(
        id,
        method,
        url,
        headers,
        statusCode,
        statusMessage,
        httpVersion
      );
    });

    return req;
  };
}

/**
 * It will bind the new function to the http|https calls
 * @param onRequest {onRequest}
 * @param onResponse {onResponse}
 * @param request_body {Boolean}
 * @param getId {generateId}
 */
export function handle(
  onRequest: onRequest,
  onResponse: onResponse,
  getId = generateId
) {
  // http
  http.get = outgoingRequest(onRequest, onResponse, getId).bind(http, http.get);
  http.request = outgoingRequest(onRequest, onResponse, getId).bind(
    http,
    http.request
  );

  // https
  https.get = outgoingRequest(onRequest, onResponse, getId).bind(
    https,
    https.get
  );
  https.request = outgoingRequest(onRequest, onResponse, getId).bind(
    https,
    https.request
  );
}
