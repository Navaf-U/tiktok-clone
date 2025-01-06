import Posts from "../../models/postsSchema.js";
import User from "../../models/userSchema.js";
const userVideoPost = async (req, res) => {
  const { description } = req.body;
  const uploadedFile = req.uploadedFile;
  const userID = req.user.id;
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.uploadedFile);

  if (!description || !uploadedFile) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (uploadedFile.format !== "mp4" || uploadedFile.resource_type !== "video") {
    return res.status(400).json({ message: "Invalid file type" });
  }
  const user = await User.findById(userID);
  if (!user || !user.username) {
    return res.status(400).json({ message: "User information is missing" });
  }
  const file = req.uploadedFile.secure_url;
  const post = await Posts.create({
    username: user.username,
    description,
    file,
  });
  res.json(post);
};

export {userVideoPost};
