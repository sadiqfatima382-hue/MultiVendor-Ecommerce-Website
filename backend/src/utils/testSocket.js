import "dotenv/config";
import { io } from "socket.io-client";


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXJjMWVndGMwMDAwcTR2cmF2emFwbDFjIiwicm9sZUlkIjoiY21yYnhjcjFpMDAwNG1ndnJ3aHVhYjdzZyIsImlhdCI6MTc4Njc5MTc4OCwiZXhwIjoxNzg2NzkyNjg4fQ.BhZvUCoVCJN6-1aW7SQJdEdLmDlCQx2lDUGsVlz1uGY"

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);

  const orderId = "cms35flbd00012wvrxrxfnmax";

  socket.emit("join:order", orderId, (response) => {
    console.log("📦 Join order response:", response);
  });
});


socket.on("order:status-updated", (data) => {
  console.log("⚡ Order status updated:", data);
});


socket.on("notification", (data) => {
  console.log("🔔 Notification received:", data);
});
socket.on("order:created", (data) => {
  console.log("🛒 Customer order event:", data);
});

socket.on("order:new", (data) => {
  console.log("👑 Admin new order event:", data);
});

socket.on("vendor:order:new", (data) => {
  console.log("🏪 Vendor new order event:", data);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});