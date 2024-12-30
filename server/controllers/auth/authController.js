import User from "../../models/userSchema.js";
import CustomError from "../../util/CustomError.js";

const createToken = (id, role, expiresIn) => {
  return jwt.sign({ id }, { role }, process.env.JWT_SECRET, { expiresIn });
};
const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError("User already exists", 400));
  }
  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashPassword });
  res.json({ message: "User Created successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("User does not exist", 400));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new CustomError("Invalid credentials", 400));
  }
  const token = createToken(user._id, user.role, "1h");
  res.json({ message: "Login successful" ,token});
};

export { registerUser ,loginUser};
