import swagger from "koa2-swagger-ui";
import swaggerJson from "../../swagger.json";

export default swagger({
  routePrefix: "/api/v1",
  swaggerOptions: {
    spec: swaggerJson
  },
  hideTopbar: true
});
