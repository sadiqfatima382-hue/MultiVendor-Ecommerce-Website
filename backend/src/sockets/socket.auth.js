import { verifyAccessToken } from "../utils/jwt.js";

export function socketAuth(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication token required.")
      );
    }

    const decoded =
      verifyAccessToken(token);

    console.log(
      "✅ Socket JWT decoded:",
      decoded
    );

    socket.user = decoded;

    next();
  } catch (error) {
    console.error(
      "❌ Socket JWT error:",
      error.name,
      error.message
    );

    next(
      new Error(
        `Socket authentication failed: ${error.message}`
      )
    );
  }
}