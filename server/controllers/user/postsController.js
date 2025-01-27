import mongoose from "mongoose";
import cloudinary from "../../config/CloudinaryConfig.js";
import Posts from "../../models/postsSchema.js";
import User from "../../models/userSchema.js";
import CustomError from "../../util/CustomError.js";
const userVideoPost = async (req, res, next) => {
  const uploadedFile = req.uploadedFile;
  const userID = req.user.id;
  if (uploadedFile) {
    if (
      uploadedFile.format !== "mp4" ||
      uploadedFile.resource_type !== "video"
    ) {
      return next(new CustomError("Invalid file type", 400));
    }
  }
  const user = await User.findById(userID);
  if (!user || !user.username) {
    return next(new CustomError("User information is missing", 400));
  }
  const file = req.uploadedFile?.secure_url;
  const fileSize = req.uploadedFile?.bytes / (1024 * 1024);
  const fileDuration = req.uploadedFile?.duration;
  const post = await Posts.create({
    username: user.username,
    file,
  });
  res.json({
    _id: post._id,
    file,
    fileSize,
    fileDuration,
    message: "video uploaded successfully",
  });
};

const userVideoDescription = async (req, res, next) => {
  const { description } = req.body;
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  post.description = description;
  await post.save();
  return res.status(200).json({ message: "Post updated successfully", post });
};

const userDeleteVideo = async (req, res, next) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  await cloudinary.uploader.destroy(post.file);
  await Posts.deleteOne({ _id: postID });
  res.json({ message: "Post deleted successfully" });
};

const getAllPosts = async (req, res, next) => {
  const posts = await Posts.find();
  if (!posts) return next(new CustomError("Post not found", 404));
  res.json(posts);
};

const getAllPostsForExplore = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const posts = await Posts.find()
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
    res.json(posts)
};

const getAllPostsOfUser = async (req, res, next) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  const posts = await Posts.find({ username });
  res.json(posts);
};

const getSinglePostOfUser = async (req, res, next) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  res.json(post);
};

const randomSinglePost = async (req, res, next) => {
  const post = await Posts.aggregate([{ $sample: { size: 1 } }]);
  if (!post || post.length === 0) {
    return next(new CustomError("Post not found", 404));
  }
  res.json(post);
};

const postComment = async (req, res, next) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  const { text, user } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment text cannot be empty" });
  }
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  const newComment = {
    user,
    text,
  };
  post.comments.push(newComment);
  await post.save();
  
  const updatedPost = await Posts.findById(postID).populate(
    "comments.user",
    "username profile"
  );

  res.json(updatedPost.comments);
};

const removeComment = async (req, res, next) => {
  const postID = req.params.id;
  const commentID = req.params.commentID;
  const userID = req.user.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentID
  );
  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const comment = post.comments[commentIndex];
  if (
    comment.user.toString() !== userID &&
    post.uploader.toString() !== userID
  ) {
    return next(new CustomError("You are not authorized", 404));
  }
  post.comments.splice(commentIndex, 1);
  await post.save();
  res.json(post.comments);
};

const getCommentOfPost = async (req, res, next) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID).populate(
    "comments.user",
    "username profile"
  );
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  res.json(post.comments);
};

const postLike = async (req, res, next) => {
  const postID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  if (post.likes.includes(req.user.id)) {
    return res
      .status(400)
      .json({ message: "You have already liked this post" });
  }
  post.likes.push(req.user.id);
  await post.save();
  res.json(post);
};

const removeLike = async (req, res, next) => {
  const postID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  if (!post.likes.includes(req.user.id)) {
    return res.status(400).json({ message: "You have not liked this post" });
  }
  post.likes = post.likes.filter((id) => id !== req.user.id);
  await post.save();
  res.json(post);
};

const getUserLikes = async (req, res, next) => {
  const userID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  const user = await User.findById(userID);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  const posts = await Posts.find({ likes: userID });
  res.json(posts);
};

const postFavorite = async (req, res, next) => {
  const postID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  if (post.favorites.includes(req.user.id)) {
    return res
      .status(400)
      .json({ message: "You have already favorited this post" });
  }

  post.favorites.push(req.user.id);
  await post.save();
  res.json(post);
};

const removeFavorite = async (req, res, next) => {
  const postID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = await Posts.findById(postID);
  if (!post) {
    return next(new CustomError("Post not found", 404));
  }
  if (!post.favorites.includes(req.user.id)) {
    return res
      .status(400)
      .json({ message: "You have not favorited this post" });
  }
  post.favorites = post.favorites.filter((id) => id !== req.user.id);
  await post.save();
  res.json({
    message: "Favorite removed successfully",
    favorites: post.favorites,
  });
};

const getUserFavorites = async (req, res, next) => {
  const userID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  const user = await User.findById(userID);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  const posts = await Posts.find({ favorites: userID });
  res.json(posts);
};

export {
  userVideoPost,
  userVideoDescription,
  userDeleteVideo,
  getAllPosts,
  getAllPostsForExplore,
  getAllPostsOfUser,
  getSinglePostOfUser,
  randomSinglePost,
  postComment,
  removeComment,
  getCommentOfPost,
  postLike,
  removeLike,
  getUserLikes,
  postFavorite,
  getUserFavorites,
  removeFavorite,
};
