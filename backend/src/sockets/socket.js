import { Server } from "socket.io";
import { socketAuth } from "./socket.auth.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(
      `🔌 Socket connected: ${socket.id}`
    );

    console.log(
      "Authenticated user:",
      socket.user
    );

    const userId = socket.user.userId;

socket.join(`user:${userId}`);

console.log(
  `👤 User ${userId} joined room user:${userId}`
);

    socket.on("disconnect", () => {
      console.log(
        `🔌 Socket disconnected: ${socket.id}`
      );
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }

  return io;
}