import User from "../../models/userSchema.js";
import CustomError from "../../util/CustomError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const createToken = (id, role, expiresIn) => {
  return jwt.sign({ id ,role }, process.env.JWT_TOKEN, { expiresIn });
};
const registerUser = async (req, res, next) => {
  const {  username,email, password , dob } = req.body;
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new CustomError("Email already exists", 400));
    }
    if (existingUser.username === username) {
      return next(new CustomError("Username already exists", 400));
    }
  }
  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({ username , email, password: hashPassword , dob });
  res.json({ message: "User Created successfully" });
};

const loginUser = async (req, res,next) => {
  const { emailOrUsername, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!user) {
    return next(new CustomError("User does not exist", 400));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new CustomError("Invalid credentials", 400));
  }
  const token = createToken(user._id, user.role, "1h");
  const currUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
    bio: user.bio,
  };
  res.json({ message: "Login successful", token , user: currUser });
};

export { registerUser, loginUser };
