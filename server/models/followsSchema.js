import mongoose from "mongoose";

const followsSchema = mongoose.Schema({
  follower: { type: mongoose.Schema.ObjectId, ref: "User" },
  following: { type: mongoose.Schema.ObjectId, ref: "User" },
});

const Follows = mongoose.model("Follows", followsSchema);
export default Follows;
