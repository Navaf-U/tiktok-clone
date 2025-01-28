import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { UserContext } from "@/context/UserProvider";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currUser } = useContext(UserContext) || {};
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (currUser) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        newSocket.emit("join", { userId: currUser._id });
      });

      newSocket.on("disconnect", () => setIsConnected(false));
      newSocket.on("connect_error", console.error);

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setIsConnected(false);
      };
    }
  }, [currUser]);

  useEffect(() => {
    console.log('Socket connected:', isConnected); // Add this for debugging
  }, [isConnected]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
