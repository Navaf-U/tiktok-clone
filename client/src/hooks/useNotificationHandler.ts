import { useEffect, useContext } from 'react';
import { useSocketContext } from '@/context/SocketProvider';
import { UserContext } from '@/context/UserProvider';

interface NotificationHandlerProps {
  onNewNotification?: (notification: { id: string; message: string; }) => void;
}

export const useNotificationHandler = ({ onNewNotification }: NotificationHandlerProps = {}) => {
  const { socket, isConnected } = useSocketContext();
  const userContext = useContext(UserContext);
  const currUser = userContext?.currUser;

  interface NotificationData {
    receiverId: string;
    [key: string]: string | number | boolean | object;
  }

  const emitNotification = (type: string, data: NotificationData) => {
    if (!socket || !isConnected || !currUser) {
      return false;
    }

    const timestamp = Date.now();
    const key = `${type}-${data.receiverId}-${timestamp}`;
    const lastEmission = localStorage.getItem(key);

    if (lastEmission && Number(lastEmission) > Date.now() - 1000) {
      return false;
    }

    localStorage.setItem(key, timestamp.toString());
    socket.emit(type, data);
    return true;
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: { id: string; message: string; }) => {
      if (onNewNotification) {
        onNewNotification(notification);
      }
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket, onNewNotification]);

  return { emitNotification };
};