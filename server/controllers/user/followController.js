import User from "../../models/userSchema.js";
import Follows from "../../models/followsSchema.js";
import mongoose from "mongoose";
const userFollow = async (req, res) => {
  const { userIdToFollow } = req.body;
  const { id: userID } = req.user;
  if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(userIdToFollow)) {
    return res.status(400).json({ message: "Invalid user ID(s) provided." });
  }
  const existingFollow = await Follows.findOne({
    follower: userID,
    following: userIdToFollow,
  });
  if (existingFollow) {
    return res.status(400).json({ message: "Already following this user." });
  }

  const follow = new Follows({ follower: userID, following: userIdToFollow });
  await follow.save();
  res.status(200).json({ message: "Followed successfully!" });
};

const userUnfollow = async (req, res) => {
  const { userIdToUnfollow } = req.body;
  const { id: userID } = req.user;
  if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(userIdToUnfollow)) {
    return res.status(400).json({ message: "Invalid user ID(s) provided." });
  }

  const follow = await Follows.findOneAndDelete({
    follower: userID,
    following: userIdToUnfollow,
  });
  if (!follow) {
    return res.status(404).json({ message: "you are not following the user" });
  }
  res.status(200).json({ message: "Unfollowed successfully!" });
};


const getFollowersAndFollowing = async (req,res)=>{
    const { userID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ message: "Invalid user ID provided." });
      }
    const [followers, following] = await Promise.all([
        Follows.find({ following: userID }).populate("follower", "username profile"),
        Follows.find({ follower: userID }).populate("following", "username profile"),
      ]);
      res.status(200).json({
        followers: {
          count: followers.length,
          data: followers,
        },
        following: {
          count: following.length,
          data: following,
        },
      });
}

export {userFollow,userUnfollow,getFollowersAndFollowing}
