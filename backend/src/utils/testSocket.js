import "dotenv/config";
import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXJieGNyZXQwMDJqbWd2cmo4NmxpMTR5Iiwicm9sZUlkIjoiY21yYnhjcjByMDAwMG1ndnJ6ajRnYW5vZyIsImlhdCI6MTc4Njc3ODc5OCwiZXhwIjoxNzg2Nzc5Njk4fQ.2MjBYOo1z5iy9DeD7eHJMFU6M73gz6uj4yJWhe6dtkQ";

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error(
    "❌ Socket connection failed:",
    error.message
  );
});

socket.on("disconnect", (reason) => {
  console.log(
    "🔌 Socket disconnected:",
    reason
  );
});