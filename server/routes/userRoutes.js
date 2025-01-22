import express from "express";
import tryCatch from "../util/tryCatch.js";
import { getOneUser, searchUser, userAccountDelete, userProfileDelete, userUpdate } from "../controllers/user/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/MulterConfig.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";
import { getAllPosts, getAllPostsForExplore, getAllPostsOfUser, getCommentOfPost, getSinglePostOfUser, getUserFavorites, getUserLikes, postComment, postFavorite, postLike, randomSinglePost, removeComment, removeFavorite, removeLike, userDeleteVideo, userVideoDescription, userVideoPost } from "../controllers/user/postsController.js";
import { followingUserPosts, getFollowersAndFollowing, isFollowing, unfollowedUsers, userFollow, userUnfollow } from "../controllers/user/followController.js";
import { getConversations, getMessages, sendMessage } from "../controllers/user/messageController.js";
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
.get("/posts/explore",tryCatch(getAllPostsForExplore))
.get("/posts/:username",tryCatch(getAllPostsOfUser))
.get("/posts/video/random",tryCatch(randomSinglePost))
.get("/posts/video/:id",tryCatch(getSinglePostOfUser))

//user comment post
.get("/posts/comments/:id",tryCatch(getCommentOfPost))
.post("/posts/comments/:id",verifyToken,tryCatch(postComment))
.delete("/posts/comments/:id/:commentID",verifyToken,tryCatch(removeComment))

//user post like
.get("/posts/like/:id",tryCatch(getUserLikes))
.post("/posts/like/:id",verifyToken,tryCatch(postLike))
.patch("/posts/like/:id",verifyToken,tryCatch(removeLike))

//user favorites
.get("/favorites/user/:id",tryCatch(getUserFavorites))
.post("/favorites/:id",verifyToken,tryCatch(postFavorite))
.delete("/favorites/:id",verifyToken,tryCatch(removeFavorite))

//follows
.get("/follows/:userID",tryCatch(getFollowersAndFollowing))
.get("/followers/:otherUserID/:userID",tryCatch(isFollowing))
.get("/following/videos/:id",verifyToken,tryCatch(followingUserPosts))
.get("/following/non-user-profiles",verifyToken,tryCatch(unfollowedUsers))
.post("/follow",verifyToken,tryCatch(userFollow))
.post("/unfollow",verifyToken,tryCatch(userUnfollow))


//messages
.get("/messages",verifyToken,tryCatch(getConversations))
.get("/messages/:otherUserId",verifyToken,tryCatch(getMessages))
.post("/messages",verifyToken,tryCatch(sendMessage))

//user account delete
.delete("/delete/account",verifyToken,tryCatch(userAccountDelete))

export default Router;
