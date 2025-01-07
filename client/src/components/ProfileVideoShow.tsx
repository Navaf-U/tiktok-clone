import { useState } from "react";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { MdBookmarkRemove } from "react-icons/md";
import { TbHeartMinus } from "react-icons/tb";
function ProfileVideoShow() : JSX.Element {
  const [stage, setStage] = useState<"videos" | "favorites" | "liked">("videos");
  return (
    <div>
      <div className="flex font-semibold text-[18px] gap-5">
        <button onClick={()=>setStage("videos")} className="w-24 border-b-2 border-b-transparent hover:border-b-2 hover:border-white"><div className="flex gap-1 justify-center items-center focus:text-white text-[#8a8a8a]" tabIndex={0}><HiOutlineAdjustmentsVertical/> Videos</div></button>
        <button onClick={()=>setStage("favorites")} className="w-24 border-b-2 border-b-transparent hover:border-b-2 hover:border-white"><div className="flex gap-1 justify-center items-center focus:text-white text-[#8a8a8a]" tabIndex={0}><MdBookmarkRemove/> Favorites</div></button>
        <button onClick={()=>setStage("liked")} className="w-24 border-b-2 border-b-transparent hover:border-b-2 hover:border-white"><div className="flex gap-1 justify-center items-center focus:text-white text-[#8a8a8a]" tabIndex={0}><TbHeartMinus/> Liked</div></button>
    </div>
        <hr className="opacity-10 text-gray-500"/>
    {stage === "videos" && (
      <div>
        <h1>NOW ITS VIDEO COMPONENT</h1>
      </div>
    )}
    {stage === "favorites" && (
      <div>
        <h1>NOW ITS FAVORITES COMPONENT</h1>
      </div>
    )}
    {stage === "liked" && (
      <div>
        <h1>NOW ITS LIKED COMPONENT</h1>
      </div>
    )}
    </div>
  )
}

export default ProfileVideoShow
 