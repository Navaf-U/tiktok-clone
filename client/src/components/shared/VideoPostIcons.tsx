import { IoHeart } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { PiShareFatFill } from "react-icons/pi";
function VideoPostIcons({small = false}): JSX.Element {
    return (
      <div className="text-center flex flex-col gap-1 justify-center items-center"> 
        <IoHeart/>
        <p className={`${small ? "text-[10px]" : "text-sm" }`}>1000</p>
        <FaRegCommentDots/>
        <p className={`${small ? "text-[10px]" : "text-sm" }`}>1000</p>
        <FaBookmark/>
        <p className={`${small ? "text-[10px]" : "text-sm" }`}>1000</p>
        <PiShareFatFill/>
        <p className={`${small ? "text-[10px]" : "text-sm" }`}>1000</p>
      </div>
    )
  }
  export default VideoPostIcons;
  