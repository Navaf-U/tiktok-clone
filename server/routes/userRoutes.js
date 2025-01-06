import express from "express";
import tryCatch from "../util/tryCatch.js";
import { getOneUser, userUpdate } from "../controllers/user/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/MulterConfig.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";
import { userVideoPost } from "../controllers/user/postsController.js";
const Router = express.Router();
Router
.get("/profile/:username", tryCatch(getOneUser))
.patch("/profile/update",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userUpdate))
.post("/posts/video",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userVideoPost))

export default Router;
