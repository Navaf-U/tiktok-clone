import jwt from "jsonwebtoken";
import Notification from "../models/notificationSchema.js";
import Message from "../models/messageSchema.js";
import User from '../models/userSchema.js'
export const users = new Map();
const setupSocket = (io) => {
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
    // this will run when user connects
    socket.on("join", () => {
      users.set(socket.user.id, socket.id);
    });

    // this will run when the user disconnects
    socket.on("disconnect", () => {
      if (socket.user.id) {
        users.delete(socket.user.id);
      }
    });

    socket.on('sendMessage', async (data) => {
      try {
        const sender = await User.findById(socket.user.id, 'username profile');
        const message = await Message.create({
          sender: socket.user.id,
          receiver: data.receiverId,
          message: data.content,
        });
         
        const notification = await Notification.create({
          receiver: data.receiverId,
          sender: socket.user.id,
          type: "message"
        });
     
        if (users.has(data.receiverId)) {
          io.to(users.get(data.receiverId)).emit("receiveMessage", message);
          io.to(users.get(data.receiverId)).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              _id: sender._id,
              username: sender.username,
              profile: sender.profile
            }
          });
        }
      } catch (error) {
        console.log("Error in sendMessage:", error);
      }
    });
    
    socket.on('follow', async (data) => {
      try {
        const sender = await User.findById(socket.user.id, 'username profile');
        const notification = await Notification.create({
          receiver: data.receiverId,
          sender: socket.user.id,
          type: "follow"
        });
    
        if (users.has(data.receiverId)) {
          io.to(users.get(data.receiverId)).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              _id: sender._id,
              username: sender.username,
              profile: sender.profile
            }
          });
        }
      } catch (error) {
        console.log("Error in follow notification:", error);
      }
    });

    socket.on("like", async (data) => {
      try {
        const sender = await User.findById(socket.user.id, "username profile");
        const notification = await Notification.create({
          receiver: data.receiverId,
          sender: socket.user.id,
          type: "like",
          media: data.postId || "null",
        });
    
        if (users.has(data.receiverId)) {
          io.to(users.get(data.receiverId)).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              id: sender.id,
              username: sender.username,
              profile: sender.profile,
            },
          });
        }
      } catch (error) {
        console.log("Error in like notification:", error);
      }
    });

    socket.on("comment", async (data) => {
      try {
        const sender = await User.findById(socket.user.id, "username profile");
        const notification = await Notification.create({
          receiver: data.receiverId,
          sender: socket.user.id,
          type: "comment",
          media: data.postId || "null",
        });
    
        if (users.has(data.receiverId)) {
          io.to(users.get(data.receiverId)).emit("newNotification", {
            ...notification.toObject(),
            sender: {
              id: sender.id,
              username: sender.username,
              profile: sender.profile,
            },
          });
        }
      } catch (error) {
        console.log("Error in comment notification:", error);
      }
    });
    
  });
};

export default setupSocket;
