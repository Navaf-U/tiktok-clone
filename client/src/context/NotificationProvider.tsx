/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "@/context/SocketProvider";
import axiosInstance from "@/utilities/axiosInstance";
import { UserContext } from "./UserProvider";

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
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocketContext();
  const { currUser } = useContext(UserContext) || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await axiosInstance.get("/user/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    };

    if (currUser) {
      fetchNotifications();
    }

    if (socket) {
      socket.on("newNotification", (newNotification: Notification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [socket, currUser]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axiosInstance.patch(
        `/user/notifications/mark-read/${notificationId}`
      );

      setNotifications((prev) => {
        const updatedNotifications = prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        );
        return updatedNotifications;
      });

      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    await axiosInstance.patch("/user/notifications/mark-read");
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
