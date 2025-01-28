import { useNotifications } from '@/context/NotificationProvider';
import UserProfilePicture from '../components/shared/UserProfilePicture';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface Sender {
  username: string;
  profile: string;
}

interface Notification {
  _id: string;
  sender: Sender;
  type: 'follow' | 'like' | 'comment' | 'message';
  read: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationShow = ({ notifications }: NotificationDropdownProps): JSX.Element => {
  const { markNotificationAsRead } = useNotifications();

  const getNotificationMessage = (notification: Notification): string => {
    switch (notification.type) {
      case 'follow':
        return `${notification.sender.username} started following you`;
      case 'like':
        return `${notification.sender.username} liked your post`;
      case 'comment':
        return `${notification.sender.username} commented on your post`;
      case 'message':
        return `New message from ${notification.sender.username}`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="absolute right-1 top-full w-80 bg-[#1E1E1E] border border-[#303030] rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-[#303030]">
        <h2 className="text-white font-semibold">Notifications</h2>
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">
          No notifications
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-center p-4 hover:bg-[#2A2A2A] cursor-pointer ${!notification.read ? 'bg-[#2A2A2A]' : ''}`}
              onClick={() => markNotificationAsRead(notification._id)}  // Ensure this is correctly triggering the mark as read
            >
              <Link to={`/profile/${notification.sender.username}`}>
                <UserProfilePicture 
                  profile={notification.sender.profile} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
              </Link>
              <div>
                <p className="text-white text-sm">
                  {getNotificationMessage(notification)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.createdAt))} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default NotificationShow;