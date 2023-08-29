const Koa = require("koa");
const cors = require("@koa/cors");

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = new Koa();
const httpServer = createServer(app.callback());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cors());

const ids = new Map();

io.on("connection", (socket) => {
  console.log("server connect", socket.id);
  ids.set(socket.id, "");

  socket.on("sendOffer", (socket) => {
    const { id, remotePeerOffer } = socket;
    console.log("server sendOffer", id);
    ids.set(id, remotePeerOffer);
  });

  socket.on("getIdsList", ({ id }) => {
    console.log("server getIdsList", id, [...ids.keys()]);
    socket.emit("getIdsList", { ids: [...ids.keys()] });
  });

  socket.on("sendAnswer", (socket) => {
    const { id, remotePeerAnswer } = socket;
    console.log("server sendAnswer", id);
    ids.set(id, remotePeerAnswer);
    socket.emit("getIdsList", { ids: [...ids.keys()] });
  });
});

httpServer.listen(3008, () => {
  console.log("3008项目启动");
});

// module.exports = app.callback();
