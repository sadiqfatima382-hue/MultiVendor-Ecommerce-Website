import "dotenv/config";
import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXJjMWVndGMwMDAwcTR2cmF2emFwbDFjIiwicm9sZUlkIjoiY21yYnhjcjFpMDAwNG1ndnJ3aHVhYjdzZyIsImlhdCI6MTc4NjYyMTE3OCwiZXhwIjoxNzg2NjIyMDc4fQ.VoutzVxq6a4ZNzRTKnqiLwNIPIO_mKQFhdqWjjVg5K4";

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