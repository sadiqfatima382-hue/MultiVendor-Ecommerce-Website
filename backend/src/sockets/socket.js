import prisma from "../config/prisma.js";
import { Server } from "socket.io";
import { socketAuth } from "./socket.auth.js";
import { findVendorByUserId, } from "../repositories/vendor.repository.js";
import { findUserWithRole, } from "../repositories/auth.repository.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  

  io.use(socketAuth);

  io.on("connection", async (socket) => {
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

    socket.on("join:order", async (orderId, callback) => {
      try {
        if (!orderId) {
          return callback?.({
            success: false,
            message: "Order ID is required.",
          });
        }

        const userId = socket.user.userId;

        // Find the order
        const order = await prisma.order.findUnique({
          where: {
            id: orderId,
          },
          include: {
            vendorOrders: true,
          },
        });

        if (!order) {
          return callback?.({
            success: false,
            message: "Order not found.",
          });
        }

        // Check customer ownership
        if (order.userId === userId) {
          socket.join(`order:${orderId}`);

          console.log(
            `📦 User ${userId} joined order:${orderId}`
          );

          return callback?.({
            success: true,
            message: "Joined order room.",
          });
        }

        // Check admin access
        const user = await findUserWithRole(userId);

        if (user?.role?.name === "ADMIN") {
          socket.join(`order:${orderId}`);

          console.log(
            `👑 Admin ${userId} joined order:${orderId}`
          );

          return callback?.({
            success: true,
            message: "Joined order room.",
          });
        }

        // Check vendor access
        const vendor = await findVendorByUserId(userId);

        if (vendor) {
          const ownsOrder = order.vendorOrders.some(
            (vendorOrder) =>
              vendorOrder.vendorId === vendor.id
          );

          if (ownsOrder) {
            socket.join(`order:${orderId}`);

            console.log(
              `🏪 Vendor ${vendor.id} joined order:${orderId}`
            );

            return callback?.({
              success: true,
              message: "Joined order room.",
            });
          }
        }

        return callback?.({
          success: false,
          message:
            "You are not authorized to join this order room.",
        });
      } catch (error) {
        console.error(
          "❌ Join order room error:",
          error
        );

        return callback?.({
          success: false,
          message: "Failed to join order room.",
        });
      }
    });


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