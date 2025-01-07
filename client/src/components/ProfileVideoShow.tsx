import { toast } from "@/hooks/use-toast";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import axiosInstance from "@/utilities/axiosInstance";
import { useEffect, useState } from "react";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { MdBookmarkRemove } from "react-icons/md";
import { TbHeartMinus } from "react-icons/tb";
import VideoCard from "./shared/VideoCard";
function ProfileVideoShow({ username }: { username: string }): JSX.Element {
  interface Post {
    _id: string;
    username: string;
    file: string;
    likes: string[];
    comments: string[];
    favorites: string[];
    date: string;
    description: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [stage, setStage] = useState<"videos" | "favorites" | "liked">(
    "videos"
  );

  useEffect(() => {
    const getUserPost = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/posts/${username}`);
        console.log(data);
        setPosts(data);
      } catch (error) {
        toast({
          title: "Login Failed",
          description: axiosErrorManager(error) || "An unknown error occurred.",
        });
      }
    };
    getUserPost();
  }, [username]);

  return (
    <div>
      <div className="flex font-semibold text-[18px] gap-5">
        <button
          onClick={() => setStage("videos")}
          className="w-24 border-b-2 border-b-transparent hover:border-b-2 hover:border-white"
        >
          <div
            className="flex gap-1 justify-center items-center focus:text-white text-[#8a8a8a]"
            tabIndex={0}
          >
            <HiOutlineAdjustmentsVertical /> Videos
          </div>
        </button>
        <button
          onClick={() => setStage("favorites")}
          className="w-24 border-b-2 border-b-transparent hover:border-b-2 hover:border-white"
        >
          <div
            className="flex gap-1 justify-center items-center focus:text-white text-[#8a8a8a]"
            tabIndex={0}
          >
            <MdBookmarkRemove /> Favorites
          </div>
        </button>
        <button
          onClick={() => setStage("liked")}
          className="w-24 border-b-2 border-b-transparent hover:border-b-2 hover:border-white"
        >
          <div
            className="flex gap-1 justify-center items-center focus:text-white text-[#8a8a8a]"
            tabIndex={0}
          >
            <TbHeartMinus /> Liked
          </div>
        </button>
      </div>
      <hr className="opacity-10 text-gray-500" />
      {stage === "videos" && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 pt-4">
         {posts.length > 0 ? (
           posts.map((post) => (
             <VideoCard key={post._id} file={post.file} />
           ))
         ) : (
           <p className="text-center text-gray-500">No videos found.</p>
         )}
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
  );
}

export default ProfileVideoShow;
