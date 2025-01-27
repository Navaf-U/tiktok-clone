import { IoHeart } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { PiShareFatFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { io } from 'socket.io-client';

interface VideoPostIconsProps {
  small?: boolean;
  like: number;
  comment: number;
  favorites: number;
  _id: string;
  isLiked?: boolean;
  isFavorite?: boolean;
  toggleLike?: () => void;
  toggleFavorites?: () => void;
  postOwner?: string; 
}

function VideoPostIcons({
  small = false,
  like,
  comment,
  favorites,
  _id,
  isLiked,
  isFavorite,
  toggleLike,
  toggleFavorites,
  postOwner
}: VideoPostIconsProps): JSX.Element {
  const handleLike = async () => {
    if (toggleLike) {
      await toggleLike();
      
      if (!isLiked && postOwner) {
        const socket = io(import.meta.env.VITE_API_URL, {
          auth: {
            token: localStorage.getItem('token')
          }
        });
        
        socket.emit('like', {
          receiverId: postOwner,
          postId: _id
        });
        
        socket.disconnect();
      }
    }
  };

  return (
    <div className="text-center flex flex-col gap-1 justify-center items-center">
      <IoHeart 
        onClick={handleLike} 
        size={40} 
        className={`bg-[#2e2e2e] p-2 rounded-full cursor-pointer ${isLiked ? 'text-red-600' : ''}`} 
      />
      <p className={`${small ? "text-[10px]" : "text-sm"}`}>{like}</p>
      <Link to={`/user/video/${_id}`}>
        <FaRegCommentDots 
          size={40} 
          className="bg-[#2e2e2e] p-2 rounded-full cursor-pointer"
        />
        <p className={`${small ? "text-[10px]" : "text-sm"}`}>{comment}</p>
      </Link>
      <FaBookmark 
        size={40} 
        onClick={toggleFavorites} 
        className={`bg-[#2e2e2e] p-2 rounded-full cursor-pointer ${isFavorite ? 'text-red-600' : ''}`}
      />
      <p className={`${small ? "text-[10px]" : "text-sm"}`}>{favorites}</p>
      <PiShareFatFill 
        size={40} 
        className="bg-[#2e2e2e] p-2 rounded-full cursor-pointer"
      />
    </div>
  );
}

export default VideoPostIcons;