import { getIO } from "../sockets/socket.js";

export function sendUserNotification(
  userId,
  event,
  data
) {
  const io = getIO();

  io.to(`user:${userId}`).emit(
    event,
    data
  );
}

export function sendVendorNotification(
  vendorId,
  event,
  data
) {
  const io = getIO();

  io.to(`vendor:${vendorId}`).emit(
    event,
    data
  );
}

export function sendAdminNotification(
  event,
  data
) {
  const io = getIO();

  io.to("admin").emit(
    event,
    data
  );
}

export function sendOrderNotification(
  orderId,
  event,
  data
) {
  const io = getIO();

  io.to(`order:${orderId}`).emit(
    event,
    data
  );
}

export function notifyUser(
  userId,
  notification
) {
  sendUserNotification(
    userId,
    "notification",
    notification
  );
}

export function notifyVendor(
  vendorId,
  notification
) {
  sendVendorNotification(
    vendorId,
    "notification",
    notification
  );
}

export function notifyAdmin(
  notification
) {
  sendAdminNotification(
    "notification",
    notification
  );
}