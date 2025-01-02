import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    profile: {
      type: String,
      required: false,
    },
    dob: { type: Object, required: true },
    bio : { type: String, required: false },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
