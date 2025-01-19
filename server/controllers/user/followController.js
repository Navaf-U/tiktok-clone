import User from "../../models/userSchema.js";
import Follows from "../../models/followsSchema.js";
import mongoose from "mongoose";
import Posts from "../../models/postsSchema.js";
const userFollow = async (req, res, next) => {
  const { userIdToFollow } = req.body;
  const { id: userID } = req.user;
  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(userIdToFollow)
  ) {
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

const userUnfollow = async (req, res, next) => {
  const { userIdToUnfollow } = req.body;
  const { id: userID } = req.user;
  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(userIdToUnfollow)
  ) {
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

const isFollowing = async (req, res, next) => {
  const { userID, otherUserID } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(otherUserID)
  ) {
    return res.status(400).json({ message: "Invalid user ID(s) provided." });
  }

  const follow = await Follows.findOne({
    follower: userID,
    following: otherUserID,
  });

  if (follow) {
    return res.status(200).json({ isFollowing: true });
  } else {
    return res.status(200).json({ isFollowing: false });
  }
};

const getFollowersAndFollowing = async (req, res, next) => {
  const { userID } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid user ID provided." });
  }
  const [followers, following] = await Promise.all([
    Follows.find({ following: userID }).populate(
      "follower",
      "username profile"
    ),
    Follows.find({ follower: userID }).populate(
      "following",
      "username profile"
    ),
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
};

const followingUserPosts = async (req, res, next) => {
  const userID = req.params.id;
  const { page = 1, limit = 8 } = req.query;
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid user ID provided." });
  }

  const user = await User.findById(userID);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  const followingDocs = await Follows.find({ follower: userID }).populate(
    "following",
    "username profile"
  );
  const followingUsernames = followingDocs.map((doc) => doc.following.username);

  const posts = await Posts.find({ username: { $in: followingUsernames } })
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const postsWithUserProfile = await Promise.all(
    posts.map(async (post) => {
      const user = await User.findOne(
        { username: post.username },
        "username profile"
      );
      return {
        ...post.toObject(),
        user,
      };
    })
  );

  res.status(200).json(postsWithUserProfile);
};

const unfollowedUsers = async (req, res, next) => {
    const userID = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const followedUserIds = await Follows.find({ follower: userID }).distinct("following");
    const users = await User.aggregate([
      {$match: {_id: { $ne: userID, $nin: followedUserIds }},},
      {$addFields: { randomSortKey: { $rand: {}}}},{$sort: { randomSortKey: 1 }},
      {$skip: (page - 1) * Number(limit)},{$limit: Number(limit),},{$project: { username: 1, profile: 1 },},
    ]);
    res.status(200).json(users);
};


export {
  userFollow,
  userUnfollow,
  getFollowersAndFollowing,
  isFollowing,
  followingUserPosts,
  unfollowedUsers
};
