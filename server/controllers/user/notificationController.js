import Notification from "../../models/notificationSchema.js";
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
    await Notification.updateMany(
      {
        receiver: req.user.id,
        type: { $ne: "message" },
        read: false,
      },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
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
