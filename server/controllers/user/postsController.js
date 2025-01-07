import cloudinary from "../../config/CloudinaryConfig.js";
import Posts from "../../models/postsSchema.js";
import User from "../../models/userSchema.js";
const userVideoPost = async (req, res) => {
  const uploadedFile = req.uploadedFile;
  const userID = req.user.id;
  if (uploadedFile) {
    if (uploadedFile.format !== "mp4" || uploadedFile.resource_type !== "video") {
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
  res.json({_id : post._id,file,fileSize,fileDuration,message:"video uploaded successfully"});
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

const getAllPostsOfUser = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const posts = await Posts.find({ username });
  res.json(posts);
};

// const userGetPost = async (req, res) => {
//   const postID = req.params.id;
//   const post = await Posts.findById(postID);
//   if (!post) {
//     return res.status(404).json({ message: "Post not found" });
//   }
//   res.json(post);
// };

export {userVideoPost,userVideoDescription,userDeleteVideo,getAllPostsOfUser};
