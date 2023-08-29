const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");

const app = new Koa();
const router = new Router();

router.post("/post", async (ctx) => {
  let { body } = ctx.request;
  console.log(body);
  ctx.body = body;
});

app.use(koaBody());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3008, () => {
  console.log("3008项目启动");
});

module.exports = app.callback();
