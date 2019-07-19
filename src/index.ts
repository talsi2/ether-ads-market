/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * builds the main server app and exports the serve function *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import Koa from "koa";
import debug from "debug";
import cors from "@koa/cors";
import config from "./config";
import staticLoader from "koa-static";
import helmet from "koa-helmet";
import apiRouter from "./routes/api";
import publicRouter from "./routes/public";
import bodyParser from "koa-bodyparser";
import swagger from "./services/swagger";
import koaRequestsLogger from "koa-logger";
import koaRespond from "./middlewares/koa-respond";
import errorsHandler from "./middlewares/errors-handler";
import * as blockchainService from "./services/blockchain";
import requestsValidator from "./middlewares/requests-validator";


const logger = debug("server");
const requestsLogger = logger.extend("requests");

const _buildServerApp = () => {
  const app = new Koa();

  // - - Middlewares - -
  app.use(errorsHandler({ onError: (e: Error) => logger(e) })); // catches app errors if any thrown
  if (requestsLogger.enabled)
    // do not add this middleware if the logger is disabled (performance purposes)
    app.use(koaRequestsLogger(r => requestsLogger(r))); // print the requests to the console
  app.use(helmet()); // add security headers
  app.use(cors({ credentials: true })); // sets the CORS headers
  app.use(bodyParser()); // parse requests body (application/json)
  app.use(requestsValidator()); // add requests validation methods

  // - - Context - -
  koaRespond(app); // extends the Koa context with response methods

  // - - Routes - -
  app.use(apiRouter.routes());
  app.use(publicRouter.routes());

  /** API Documentation using swagger.
   * generally should not be part of the server,
   * but I did it for just for the simplicity of the project. 
   */
  app.use(swagger);

  // again.. should not be part of the server, but for the simplicity of the project.
  app.use(staticLoader(__dirname + "/services/video-loader"));
  return app;
};

/* starts the server */
export const serve = async () => {
  try {
    const app = _buildServerApp();
    await blockchainService.initNetwork();
    const { protocol, host, port } = config.server;
    let msg = `Server started on ${protocol}://${host}:${port}`;
    return app.listen(port, () => logger(msg));
  } catch (e) {
    logger("server initialization error!");
    throw e;
  }
};

if (require.main === module) {
  serve();
}
