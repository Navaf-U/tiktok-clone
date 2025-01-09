import mongoose from "mongoose";
import cloudinary from "../../config/CloudinaryConfig.js";
import Posts from "../../models/postsSchema.js";
import User from "../../models/userSchema.js";
const userVideoPost = async (req, res) => {
  const uploadedFile = req.uploadedFile;
  const userID = req.user.id;
  if (uploadedFile) {
    if (
      uploadedFile.format !== "mp4" ||
      uploadedFile.resource_type !== "video"
    ) {
      return res.status(400).json({ message: "Invalid file type" });
    }
  }
  const user = await User.findById(userID);
  if (!user || !user.username) {
    return res.status(400).json({ message: "User information is missing" });
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

const userVideoDescription = async (req, res) => {
  const { description } = req.body;
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.description = description;
  await post.save();
  return res.status(200).json({ message: "Post updated successfully", post });
};

const userDeleteVideo = async (req, res) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  await cloudinary.uploader.destroy(post.file);
  await Posts.deleteOne({ _id: postID });
  res.json({ message: "Post deleted successfully" });
};

const getAllPosts = async (req, res) => {
  const posts = await Posts.find();
  if (!posts) return res.status(400).json({ message: "No Posts" });
  res.json(posts);
};

const getAllPostsOfUser = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const posts = await Posts.find({ username });
  res.json(posts);
};

const getSinglePostOfUser = async (req, res) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
};

const postComment = async (req, res) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const { text, user } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment text cannot be empty" });
  }
  if (!user) {
    return res.status(400).json({ message: "User ID is required" });
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

const getCommentOfPost = async (req, res) => {
  const postID = req.params.id;
  const post = await Posts.findById(postID).populate(
    "comments.user",
    "username profile"
  );
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post.comments);
};

const postLike = async (req, res) => {
  const postID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = await Posts.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
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

const removeLike = async (req, res) => {
  const postID = req.params.id;
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = await Posts.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (!post.likes.includes(req.user.id)) {
    return res.status(400).json({ message: "You have not liked this post" });
  }
  post.likes = post.likes.filter((id) => id !== req.user.id);
  await post.save();
  res.json(post);
};

export {
  userVideoPost,
  userVideoDescription,
  userDeleteVideo,
  getAllPosts,
  getAllPostsOfUser,
  getSinglePostOfUser,
  postComment,
  getCommentOfPost,
  postLike,
  removeLike
};
