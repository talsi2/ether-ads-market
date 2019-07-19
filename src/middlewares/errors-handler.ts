import { Context } from "koa";


const errorsHandler = (options: { onNotFound?: Function; onError?: Function }) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
      if (ctx.status === 404 && options.onNotFound) {
        options.onNotFound();  // custom 404 handler
      }
    } catch (error) {
      options.onError && options.onError(error);
      ctx.internalServerError();
    }
  };
};

export default errorsHandler;
