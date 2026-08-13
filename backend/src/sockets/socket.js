import { Server } from "socket.io";
import { socketAuth } from "./socket.auth.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // JWT authentication
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(
      `🔌 Socket connected: ${socket.id}`
    );

    console.log(
      "Authenticated user:",
      socket.user
    );
    const userId = socket.user.id;
    socket.join(`user:${userId}`);

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