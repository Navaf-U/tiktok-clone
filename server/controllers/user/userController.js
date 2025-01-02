import User from "../../models/userSchema.js";
const getOneUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({username: username}, {password: 0});
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

const userUpdate = async (req, res) => {
  const { bio } = req.body;
  const user = await User.findOne({ _id: req.user.id}, {password: 0});
  console.log(user)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.bio = bio;
  await user.save();
  res.json(user);
};

export {getOneUser,userUpdate} 