import User from "../../models/userSchema.js";
const getOneUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({username: username}, {password: 0});
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};


export {getOneUser} 