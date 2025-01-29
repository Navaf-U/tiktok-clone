import Message from "../../models/messageSchema.js";
import { users } from "../../services/socketHandler.js";
import { io } from "../../index.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
const getConversations = async (req, res) => {
    const userID =  new ObjectId(req.user.id);
    try {
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [{ senderId: userID }, { receiverId: userID }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$senderId", userID] },
                then: "$receiverId",
                else: "$senderId",
              },
            },
            lastMessage: { $first: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $project: {
            _id: 1, 
            lastMessage: 1,
            username: "$userDetails.username",
            profile: "$userDetails.profile",
          },
        },
      ]);
  
      res.json(conversations);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  };

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user.id;

  if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  })
    .sort("createdAt")
    .populate("senderId", "username profile")
    .populate("receiverId", "username profile");

  await Message.updateMany(
    { senderId: otherUserId, receiverId: userId, read: false },
    { read: true }
  );

  res.json(messages);
};

const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });
  const populatedMessage = await newMessage.populate([
    "senderId",
    "receiverId",
  ]);

  // using socket.io
  const receiverSocketId = users.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", populatedMessage);
  }

  res.json(populatedMessage);
};



export { getConversations, getMessages, sendMessage };
