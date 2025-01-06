import { IoHeart } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { PiShareFatFill } from "react-icons/pi";
function VideoPostIcons(): JSX.Element {
    return (
      <div className="flex flex-col"> 
        <div>
        <IoHeart/>
        <p>1000</p>
        </div>
        <div>
        <FaRegCommentDots/>
        <p>1000</p>
        </div>
        <div>
        <FaBookmark/>
        <p>1000</p>
        </div>
        <div>
        <PiShareFatFill/>
        <p>1000</p>
        </div>
      </div>
    )
  }
  export default VideoPostIcons;
  