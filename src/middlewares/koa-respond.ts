import Koa from "koa";

/* extends the Koa.Context object declaration */
declare module "koa" {
  interface Context {
    ok: (responseBody?: Record<string, any> | string) => Context;
    created: (responseBody?: Record<string, any> | string) => Context;
    badRequest: (responseBody?: Record<string, any> | string) => Context;
    unauthorized: (responseBody?: Record<string, any> | string) => Context;
    forbidden: (responseBody?: Record<string, any> | string) => Context;
    notFound: (responseBody?: Record<string, any> | string) => Context;
    internalServerError: (responseBody?: Record<string, any> | string) => Context;
    notImplemented: () => Context;
  }
}

/* Maps method names to status codes */
const statusCodeMap = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
  notImplemented: 501
};

/* adds useful methods to the Koa context */
const extend = (app: Koa): void => {
  Object.keys(statusCodeMap).forEach(status => {
    app.context[status] = function (responseBody?: Record<string, any> | string) {
      this.status = statusCodeMap[status];
      if (typeof responseBody === "string") {
        this.body = { message: responseBody };
      } else if (responseBody) {
        this.body = responseBody;
      }
      return this;
    };
  });
};

export default extend;
