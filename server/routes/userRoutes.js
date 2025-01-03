import express from "express";
import tryCatch from "../util/tryCatch.js";
import { getOneUser, userUpdate } from "../controllers/user/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/MulterConfig.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";
const Router = express.Router();
Router.get("/profile/:username", tryCatch(getOneUser)).patch(
  "/profile/update",
  upload.single("file"),
  verifyToken,
  uploadToCloudinary,
  tryCatch(userUpdate)
);

export default Router;
