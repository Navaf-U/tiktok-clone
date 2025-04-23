import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import ConnectDataBase from "./config/ConnectDataBase.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import manageError from "./middlewares/manageError.js";

dotenv.config();
ConnectDataBase();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("YOO RUNNING WORLD");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.all("*", (req, res) => {
  res.status(400).json({ message: "cannot access the endpoint" });
});
app.use(manageError);

export default app;
