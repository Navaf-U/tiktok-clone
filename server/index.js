import express from "express";
import ConnectDataBase from "./config/ConnectDataBase.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import manageError from "./middlewares/manageError.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import {Server} from "socket.io";
import setupSocket from "./services/socketHandler.js";
const app = express();
dotenv.config();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  }
});



setupSocket(io); 
app.use(cookieParser());  

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
ConnectDataBase();

app.get("/", (req, res) => {
  res.send("YOO RUNNING WORLD");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.all("*", (req, res) => {
  res.status(400).json({ message: "cannot access the endpoint" });
});

app.use(manageError);

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
