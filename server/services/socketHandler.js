import jwt from "jsonwebtoken";
import Notification from "../models/notificationSchema.js";
import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";

export const users = new Map();

const socketHandler = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
          return next(new Error("Authentication error"));
        }
        socket.user = user;
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", () => {
      users.set(socket.user.id, socket.id);
    });

    socket.on("disconnect", () => {
      if (socket.user?.id) {
        users.delete(socket.user.id);
      }
    });

    const createAndEmitNotification = async (receiverId, type, data = {}) => {
      try {
        const sender = await User.findById(socket.user.id, "username profile");
        const existingNotification = await Notification.findOne({
          receiver: receiverId,
          sender: socket.user.id,
          type,
          createdAt: {
            $gte: new Date(Date.now() - 1000),
          },
        });

        if (existingNotification) {
          return;
        }

        const notification = await Notification.create({
          receiver: receiverId,
          sender: socket.user.id,
          type,
          ...data,
        });

        if (users.has(receiverId)) {
          io.to(users.get(receiverId)).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              _id: sender._id,
              username: sender.username,
              profile: sender.profile,
            },
          });
        }
      } catch (error) {
        console.log(`Error in ${type} notification:`, error);
      }
    };

    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, content } = data;
        let conversation = await Message.findOne({
          $or: [{ users: { $all: [socket.user.id, receiverId] } }],
        });
        if (!conversation) {
          conversation = await Message.create({
            users: [socket.user.id, receiverId],
            messages: [],
          });
        }
        const message = await Message.create({
          sender: socket.user.id,
          receiver: receiverId,
          message: content,
        });
        conversation.messages.push(message._id);
        await conversation.save();

        await createAndEmitNotification(receiverId, "message");

        if (users.has(receiverId)) {
          io.to(users.get(receiverId)).emit("receiveMessage", message);
        }
      } catch (error) {
        console.log("Error in sendMessage:", error);
      }
    });

    socket.on("follow", async (data) => {
      await createAndEmitNotification(data.receiverId, "follow");
    });

    socket.on("like", async (data) => {
      await createAndEmitNotification(data.receiverId, "like", {
        media: data.postId || "null",
      });
    });

    socket.on("comment", async (data) => {
      await createAndEmitNotification(data.receiverId, "comment", {
        media: data.postId || "null",
      });
    });
  });

};

export default socketHandler;
