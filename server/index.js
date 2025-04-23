import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import setupSocket from "./services/socketHandler.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
