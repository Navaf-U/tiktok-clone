import Notification from "../../models/notificationSchema.js";
import User from "../../models/userSchema.js";
const getNotifications = async (req, res) => {
    const notifications = await Notification.find({
      receiver: req.user.id,
      type: { $ne: "message" },
    })
      .populate("sender", "username profile")
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      receiver: req.user.id,
      read: false,
      type: { $ne: "message" },
    });

    res.status(200).json({
      notifications,
      unreadCount,
    });
  }

  const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
        if (notification.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: "You cannot mark this notification as read" });
      }

      notification.read = true;
      await notification.save();
  
      const user = await User.findById(req.user.id);
      if (user) {
        user.unreadNotificationsCount = Math.max(user.unreadNotificationsCount - 1, 0);
        await user.save();
      }
  
      res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

const getUnreadCount = async (req, res) => {
    const count = await Notification.countDocuments({
      receiver: req.user.id,
      read: false,
      type: { $ne: "message" },
    });
    res.status(200).json({ count });
};

export { getNotifications, markAsRead, getUnreadCount };
