import Router from "koa-tree-router";
import { createReadStream } from "fs";

const router = new Router();
router.get("/alive", ctx => ctx.ok("alive"));

router.get("/", ctx => {
  ctx.type = "html";
  ctx.body = createReadStream("./public/demo.html");
});

export default router;
