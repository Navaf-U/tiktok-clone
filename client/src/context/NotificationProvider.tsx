/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "./UserProvider";
import axiosInstance from "@/utilities/axiosInstance";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import { getSocket } from "@/components/shared/socket";

interface Notification {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profile: string;
  };
  type: "follow" | "like" | "comment" | "message";
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (!userContext?.currUser) return;
  
    const socket = getSocket();
    
    socket.emit("join", { userId: userContext.currUser?._id });
  
    socket.on("newNotification", (newNotification: Notification) => {
      console.log("New notification received:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
  
    return () => {
      socket.off("newNotification");
    };
  }, [userContext?.currUser]);
  
useEffect(() => {
  if (!userContext?.currUser) return;

  const socket = getSocket();

  socket.on("newNotification", (newNotification) => {
    console.log("New notification:", newNotification);
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  return () => {
    socket.off("newNotification");
  };
}, [userContext?.currUser]);


  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get("/user/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
  };

  const markNotificationAsRead = async () => {
    try {
      await axiosInstance.patch("/user/notifications/mark-read");
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
  };

  useEffect(() => {
    if (userContext?.currUser) {
      fetchNotifications();
    }
  }, [userContext?.currUser]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markNotificationAsRead,
        fetchNotifications,
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
