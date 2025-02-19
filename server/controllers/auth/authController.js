import User from "../../models/userSchema.js";
import CustomError from "../../util/CustomError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateOTP from "../../util/otpGenerator.js";
import Otp from "../../models/otpSchema.js";
const createToken = (id, role, expiresIn) => {
  return jwt.sign({ id, role }, process.env.JWT_TOKEN, { expiresIn });
};
const createRefreshToken = (id, role, expiresIn) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_TOKEN, { expiresIn });
};

const sendOtp = async (req, res, next) => {
  const { email, username } = req.body;
  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });
  if (existingEmail || existingUsername) {
    return next(new CustomError("User already exist", 400));
  }
  const otp = generateOTP();
  const otpEntry = new Otp({
    email,
    otp,
  });
  await otpEntry.save();
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };
  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "OTP sent successfully to the email" });
};

const registerUser = async (req, res, next) => {
  const { username, email, password, dob,otp } = req.body;
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
  const otpEntry = await Otp.findOne({ email, otp });
  if (!otpEntry) {
    Otp.deleteMany({ email });
    return next(new CustomError("Invalid OTP", 400));
  }
  Otp.deleteMany({ email });

  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashPassword, dob });
  res.json({ message: "User Created successfully" });
};

const loginUser = async (req, res, next) => {
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
  const refreshToken = createRefreshToken(user._id, user.role, "3d");
  const currUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
    bio: user.bio,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, 
    secure: true, 
    sameSite: "none"
  })
  res.json({ message: "Login successful", token, user: currUser });
};


const userLogout = async (req, res, next) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful" });
};


const refreshingToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new CustomError("No refresh token provided", 401));
  }  
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const accessToken = createToken(decoded.id, decoded.role, "1h");
    res.status(200).json({
      message: "Token refreshed",
      token: accessToken,
    });
};

export { registerUser, loginUser, refreshingToken,userLogout,sendOtp };
