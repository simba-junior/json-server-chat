import jsonServer from "json-server";
import express from "express";
import { readFileSync } from "node:fs";
import { join } from "path";
import { generateIdAndDate } from "./middlewares/generateIdAndDate";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // в случае КОРС ошибок вводить сюда тот локалхост на котором развернут фронт
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});
const userRouter = jsonServer.router(join(__dirname, "db/db.json"));
const swaggerFile = JSON.parse(
  readFileSync(join(__dirname, "swagger/output.json"), "utf-8"),
);
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(jsonServer.bodyParser);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(generateIdAndDate);
app.use(userRouter);

io.on("connection", (socket) => {
  console.log("a user connedcted!");

  socket.on("join_channel", async (data) => {
    const { channelId } = data;

    try {
      socket.join(channelId);

      const allMessages = await fetch(
        `http://localhost:3000/channels/${channelId}/messages`,
      );

      if (allMessages.status === 200) {
        const response = await allMessages.json();

        socket.emit("receive_message", response);
      }
    } catch (e) {
      console.log("[error] ", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });

  socket.on("send_message", async (msg) => {
    const { channelId } = msg || {};

    try {
      io.to(channelId).emit("receive_message", msg);

      await fetch(`http://localhost:3000/messages`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(msg),
      });
    } catch (e) {
      console.log("[error] ", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });

  socket.on("leave_channel", (data) => {
    const { channelId } = data || {};

    try {
      socket.leave(channelId);
      socket.to(channelId).emit("user left", socket.id);
    } catch (e) {
      console.log("[error]", "leave room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });
});

server.listen(3000, () => {
  console.log("JSON Server is running");
});
