import express from "express";
import tryCatch from "../util/tryCatch.js";
import { getOneUser, searchUser, userProfileDelete, userUpdate } from "../controllers/user/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/MulterConfig.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";
import { getAllPosts, getAllPostsOfUser, getCommentOfPost, getFavorites, getSinglePostOfUser, getUserFavorites, postComment, postFavorite, postLike, randomSinglePost, removeComment, removeFavorite, removeLike, userDeleteVideo, userVideoDescription, userVideoPost } from "../controllers/user/postsController.js";
import { getFollowersAndFollowing, isFollowing, userFollow, userUnfollow } from "../controllers/user/followController.js";
const Router = express.Router();
Router

//user profile get and update and user search
.get("/profile/:username", tryCatch(getOneUser))
.patch("/profile/update",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userUpdate))
.delete("/profile/delete",verifyToken,tryCatch(userProfileDelete))
.get("/search",searchUser)
//user posting
.post("/posts/video",upload.single("file"),verifyToken,uploadToCloudinary,tryCatch(userVideoPost))
.post("/posts/description/:id",verifyToken,tryCatch(userVideoDescription))
.delete("/posts/delete/:id",verifyToken,tryCatch(userDeleteVideo))

//user post get
.get("/posts",tryCatch(getAllPosts))
.get("/posts/:username",tryCatch(getAllPostsOfUser))
.get("/posts/video/random",tryCatch(randomSinglePost))
.get("/posts/video/:id",tryCatch(getSinglePostOfUser))

//user comment post
.get("/posts/comments/:id",tryCatch(getCommentOfPost))
.post("/posts/comments/:id",verifyToken,tryCatch(postComment))
.delete("/posts/comments/:id/:commentID",verifyToken,tryCatch(removeComment))

//user post like
.post("/posts/like/:id",verifyToken,tryCatch(postLike))
.patch("/posts/like/:id",verifyToken,tryCatch(removeLike))

//user favorites
.get("/favorites/:postID",tryCatch(getFavorites))
.get("/favorites/user/:id",tryCatch(getUserFavorites))
.post("/favorites/:id",verifyToken,tryCatch(postFavorite))
.delete("/favorites/:id",verifyToken,tryCatch(removeFavorite))

//follows
.get("/follows/:userID",tryCatch(getFollowersAndFollowing))
.get("/followers/:otherUserID/:userID",tryCatch(isFollowing))
.post("/follow",verifyToken,tryCatch(userFollow))
.post("/unfollow",verifyToken,tryCatch(userUnfollow))


export default Router;
