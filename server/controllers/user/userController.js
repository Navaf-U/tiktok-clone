import User from "../../models/userSchema.js";
import cloudinary from "../../config/CloudinaryConfig.js";
import CustomError from "../../util/CustomError.js";
const getOneUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username }, { password: 0 });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

const userUpdate = async (req, res, next) => {
  const { bio } = req.body;
  const user = await User.findOne({ _id: req.user.id }, { password: 0 });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (req.file) {
    if (user.profile) {
      await cloudinary.uploader.destroy(user.profile);
    }
    user.profile = req.uploadedFile.secure_url;
  }
  if (bio !== undefined) {
    user.bio = bio;
  }
  await user.save();
  res.json(user);
};
export { getOneUser, userUpdate };
