import User from "../../models/userSchema.js";
import cloudinary from "../../config/CloudinaryConfig.js";
import CustomError from "../../util/CustomError.js";

const getOneUser = async (req, res,next) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username }, { password: 0 });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  res.json(user);
};

const userUpdate = async (req, res, next) => {
    const { bio } = req.body;
    const user = await User.findOne({ _id: req.user.id }, { password: 0 });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    if (req.file) {
      if (user.profile) {
        await cloudinary.uploader.destroy(user.profile).catch(console.error);
      }
      user.profile = req.uploadedFile.secure_url;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();
    res.json(user);
};

const userProfileDelete = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id }, { password: 0 });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  if (user.profile) {
    await cloudinary.uploader.destroy(user.profile).catch(console.error);
  }
  user.profile = undefined;
  await user.save();
  res.json(user);
};

const searchUser = async (req,res,next) =>{
  const { query } = req.query;
  if (!query) {
    return next(new CustomError("Query parameter is required", 404));
  }
  const users = await User.find({username:{$regex:query,$options:'i'}}).limit(10)
  return res.json(users);
}

export { getOneUser, userUpdate , searchUser , userProfileDelete };
