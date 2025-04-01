import { UserContext } from "@/context/UserProvider";
import { useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      socket?.emit("join");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const useSocket = () => {
  const { currUser } = useContext(UserContext) || {};

  useEffect(() => {
    if (!currUser) return;

    const socket = getSocket();
    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [currUser]);

  return getSocket();
};
