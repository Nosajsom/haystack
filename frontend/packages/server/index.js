const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const router = require("./router");
const {
  handleJoin,
  handleDisconnect,
  handleRead,
  handleMessage,
  handleAction,
  handleAnswer,
} = require("./controller");
const debug = require("debug")("app:index");

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  debug("new connection");
  socket.on("join", handleJoin({ io, socket }));
  socket.on("sendMessage", handleMessage({ io, socket }));
  socket.on("sendAnswer", handleAnswer({ io, socket }));
  socket.on("action", handleAction({ io, socket }));
  socket.on("disconnect", handleDisconnect({ io, socket }));
});

app.use(cors());
app.use(router);
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => debug(`server initialized on port ${port}`));
