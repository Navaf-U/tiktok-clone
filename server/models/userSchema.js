import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    profile: {
      type: String,
      required: false, default:""
    },
    dob: { type: Object, required: true },
    bio : { type: String, required: false , default:"" },
    role: { type: String, default: "user" },
    otp:{type:String,required:false}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
