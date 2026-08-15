import { Server } from "socket.io";
import { socketAuth } from "./socket.auth.js";
import { findVendorByUserId, } from "../repositories/vendor.repository.js";
import { findUserWithRole,} from "../repositories/auth.repository.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth);

  io.on("connection", async(socket) => {
    console.log(
      `🔌 Socket connected: ${socket.id}`
    );

    console.log(
      "Authenticated user:",
      socket.user
    );
    //user room
    const userId = socket.user.userId;
    socket.join(`user:${userId}`);
    console.log(
      `👤 User ${userId} joined room user:${userId}`
    );

    //vendor room
    const vendor = await findVendorByUserId(userId);
    if (vendor) {
      socket.join(`vendor:${vendor.id}`);
      console.log(
        `🏪 Vendor ${vendor.id} joined room vendor:${vendor.id}`
      );
    }
    //Admin room
     const user = await findUserWithRole(userId);

  if (user?.role?.name === "SUPER_ADMIN") {
    socket.join("admin");

    console.log(
      `👑 Admin ${userId} joined room admin`
    );
  }
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