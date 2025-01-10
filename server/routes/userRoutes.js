import express from "express";
import tryCatch from "../util/tryCatch.js";
import { getOneUser, searchUser, userUpdate } from "../controllers/user/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/MulterConfig.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";
import { getAllPosts, getAllPostsOfUser, getCommentOfPost, getSinglePostOfUser, postComment, postLike, removeComment, removeLike, userDeleteVideo, userVideoDescription, userVideoPost } from "../controllers/user/postsController.js";
import { getFollowersAndFollowing, userFollow, userUnfollow } from "../controllers/user/followController.js";
const Router = express.Router();
Router

//user profile get and update and user search
.get("/profile/:username", tryCatch(getOneUser))
.patch("/profile/update",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userUpdate))
.get("/search",searchUser)
//user posting
.post("/posts/video",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userVideoPost))
.post("/posts/description/:id",verifyToken,tryCatch(userVideoDescription))
.delete("/posts/delete/:id",verifyToken,tryCatch(userDeleteVideo))

//user post get
.get("/posts",tryCatch(getAllPosts))
.get("/posts/:username",tryCatch(getAllPostsOfUser))
.get("/posts/video/:id",tryCatch(getSinglePostOfUser))

//user comment post
.get("/posts/comments/:id",tryCatch(getCommentOfPost))
.post("/posts/comments/:id",verifyToken,tryCatch(postComment))
.delete("/posts/comments/:id/:commentID",verifyToken,tryCatch(removeComment))

//user post like
.post("/posts/like/:id",verifyToken,tryCatch(postLike))
.patch("/posts/like/:id",verifyToken,tryCatch(removeLike))



//follows
.get("/follows/:userID",tryCatch(getFollowersAndFollowing))
.post("/follow",verifyToken,tryCatch(userFollow))
.post("/unfollow",verifyToken,tryCatch(userUnfollow))


export default Router;
