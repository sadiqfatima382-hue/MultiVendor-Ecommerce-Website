import jwt from "jsonwebtoken";

export function socketAuth(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication token required.")
      );
    }

    console.log(
      "JWT_SECRET exists:",
      !!process.env.JWT_SECRET
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

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