/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { UserContext } from "@/context/UserProvider";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userContext = useContext(UserContext);
  const currUser = userContext ? userContext.currUser : null;
  const socketRef = useRef<Socket | null>(null);
  

  useEffect(() => {
    if (!currUser) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });

    socketRef.current = socket;

     socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("join", { userId: currUser._id });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currUser]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
