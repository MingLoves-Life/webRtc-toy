// const Koa = require("koa");
// const cors = require("@koa/cors");

// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = new Koa();
// const httpServer = createServer(app.callback());

// const io = new Server(httpServer, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://www.hmayc.fun",
//       "https://web-rtc-toy-client.vercel.app",
//     ],
//     credentials: true,
//   },
//   // transports: ["websocket","polling"],
//   transports: ["polling"],
// });

// app.use(cors());

// const ids = new Map();

// io.on("connection", (socket) => {
//   console.log("server connect", socket.id);
//   ids.set(socket.id, "");

//   socket.on("getIdsList", ({ id }) => {
//     console.log("server getIdsList", id, [...ids.keys()]);
//     socket.emit("getIdsList", { ids: [...ids.keys()] });
//   });

//   socket.on("sendOffer", (socket) => {
//     const { id, remotePeerOffer } = socket;
//     console.log("server sendOffer", id);
//     ids.set(id, remotePeerOffer);
//   });

//   socket.on("getOffer", ({ connectId }) => {
//     const offer = ids.get(connectId) || "此Id不存在";
//     socket.emit("getOffer", { connectId, offer });
//   });

//   socket.on("sendAnswer", ({ id, remotePeerAnswer }) => {
//     console.log("server sendAnswer", id);
//     ids.set(id, remotePeerAnswer);
//     socket.emit("getAnswer", { id, remotePeerAnswer });
//   });
// });

// httpServer.listen(80, () => {
//   console.log("80项目启动");
// });

// module.exports = app;

const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const { v4 } = require("uuid");

const app = new Koa();
const router = new Router();
const ids = new Map();

router.post("/connection", async (ctx) => {
  const id = v4();
  console.log("server connect", id);
  ids.set(id, "");
  ctx.body = { code: 200, data: { id } };
});

router.post("/getIdsList", (ctx) => {
  let { body } = ctx.request;
  console.log("server getIdsList", body.id, [...ids.keys()]);
  ctx.body = { code: 200, data: { idsList: [...ids.keys()] } };
});

router.post("/sendOffer", (ctx) => {
  const { id, remotePeerOffer } = ctx.request.body;
  console.log("server sendOffer", id);
  ids.set(id, remotePeerOffer);
  ctx.body = { code: 200, data: {} };
});

router.post("/getOffer", ({ id }) => {
  const offer = ids.get(id) || "此Id不存在";
  // socket.emit("getOffer", { connectId, offer });
});

router.post("/sendAnswer", ({ id, remotePeerAnswer }) => {
  console.log("server sendAnswer", id);
  ids.set(id, remotePeerAnswer);
  // socket.emit("getAnswer", { id, remotePeerAnswer });
});

app.use(koaBody());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(80, () => {
  console.log("80项目启动");
});

module.exports = app.callback();
