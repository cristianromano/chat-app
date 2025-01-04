import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Allowed HTTP methods
  },
});

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected:" + socket.id);

  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;
  io.emit("user-connected", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected:" + socket.id);
    delete userSocketMap[userId];
    io.emit("user-disconnected", Object.keys(userSocketMap));
  });
});

export { io, server, app };
