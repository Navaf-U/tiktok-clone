import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "@/context/SocketProvider";
import axiosInstance from "@/utilities/axiosInstance";

interface Notification {
  _id: string;
  sender: { username: string; profile: string };
  type: "follow" | "like" | "comment";
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await axiosInstance.get("/user/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    };

    fetchNotifications();

    if (socket) {
      socket.on("newNotification", (newNotification: Notification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [socket]);

  const markAllAsRead = async () => {
    await axiosInstance.patch("/user/notifications/mark-read");
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
