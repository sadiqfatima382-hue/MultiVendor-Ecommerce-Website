import "dotenv/config";
import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXJjMWVndGMwMDAwcTR2cmF2emFwbDFjIiwicm9sZUlkIjoiY21yYnhjcjFpMDAwNG1ndnJ3aHVhYjdzZyIsImlhdCI6MTc4NjYyMjk4NywiZXhwIjoxNzg2NjIzODg3fQ.6AG8ByaIqJW5Pn_AmpqsPAHmzdAsEML_wZHMv0vwAHU";

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