// import dotenv from "dotenv";
// import app from "./app.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });

import http from "http";
import app from "./app.js";
import {initializeSocket,} from "./sockets/socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});