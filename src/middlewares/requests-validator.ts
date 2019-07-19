import { Context } from "koa";
import debug from "debug";
import bouncer from "koa-bouncer";

const logger = debug("koa:requestsValidator");

const requestsValidator = (opts: Record<string, any> = {}) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      return await bouncer.middleware(opts)(ctx, next);
    } catch (error) {  // catches only bouncer validation errors
      if (error instanceof bouncer.ValidationError) {
        logger(ctx.request.url, "->", error.message);
        return await ctx.badRequest();
      }
      throw error;
    }
  };
};

export default requestsValidator;
