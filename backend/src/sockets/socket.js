import prisma from "../config/prisma.js";
import { Server } from "socket.io";
import { socketAuth } from "./socket.auth.js";
import { findVendorByUserId } from "../repositories/vendor.repository.js";
import { findUserWithRole } from "../repositories/auth.repository.js";
import { notifyUser } from "../utils/socketNotification.js";
import { initializeSocketRedis } from "../config/socket.redis.js";

let io;

export async function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(socketAuth);

  // Redis adapter
  await initializeSocketRedis(io);

  io.on("connection", async (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    console.log("Authenticated user:", socket.user);

    // =========================
    // USER ROOM
    // =========================

    const userId = socket.user.userId;

    socket.join(`user:${userId}`);

    console.log(
      `👤 User ${userId} joined room user:${userId}`
    );

    // =========================
    // VENDOR ROOM
    // =========================

    const vendor = await findVendorByUserId(userId);

    if (vendor) {
      socket.join(`vendor:${vendor.id}`);

      console.log(
        `🏪 Vendor ${vendor.id} joined room vendor:${vendor.id}`
      );
    }

    // =========================
    // ADMIN ROOM
    // =========================

    const user = await findUserWithRole(userId);

    if (user?.role?.name === "SUPER_ADMIN") {
      socket.join("admin");

      console.log(
        `👑 Admin ${userId} joined room admin`
      );
    }

    // =========================
    // JOIN ORDER ROOM
    // =========================

    socket.on("join:order", async (orderId, callback) => {
      try {
        if (!orderId) {
          return callback?.({
            success: false,
            message: "Order ID is required.",
          });
        }

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

        // Customer
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

        // Admin
        if (user?.role?.name === "SUPER_ADMIN") {
          socket.join(`order:${orderId}`);

          console.log(
            `👑 Admin ${userId} joined order:${orderId}`
          );

          return callback?.({
            success: true,
            message: "Joined order room.",
          });
        }

        // Vendor
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

    // =========================
    // TEST NOTIFICATION
    // =========================

    setTimeout(() => {
      notifyUser(userId, {
        type: "TEST",
        title: "Test Notification",
        message: "Socket notification is working!",
      });
    }, 2000);

    // =========================
    // DISCONNECT
    // =========================

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