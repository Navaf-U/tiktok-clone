import express from "express";
import tryCatch from "../util/tryCatch.js";
import { getOneUser, userUpdate } from "../controllers/user/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/MulterConfig.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";
import { getAllPostsOfUser, getCommentOfPost, getSinglePostOfUser, postComment, userDeleteVideo, userVideoDescription, userVideoPost } from "../controllers/user/postsController.js";
const Router = express.Router();
Router
.get("/profile/:username", tryCatch(getOneUser))
.patch("/profile/update",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userUpdate))

//user posting
.post("/posts/video",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userVideoPost))
.post("/posts/description/:id",verifyToken,tryCatch(userVideoDescription))
.delete("/posts/delete/:id",verifyToken,tryCatch(userDeleteVideo))

//user post get
.get("/posts/:username",verifyToken,tryCatch(getAllPostsOfUser))
.get("/posts/video/:id",verifyToken,tryCatch(getSinglePostOfUser))

//user comment post
.get("/posts/comments/:id",verifyToken,tryCatch(getCommentOfPost))
.post("/posts/comments/:id",verifyToken,tryCatch(postComment))

export default Router;
