import express from "express";
import ConnectDataBase from "./config/ConnectDataBase.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import manageError from "./middlewares/manageError.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());  
const PORT = process.env.PORT || 3000;
dotenv.config();
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

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
