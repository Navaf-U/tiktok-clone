import { toast } from "@/hooks/use-toast";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import axiosInstance from "@/utilities/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { MdBookmarkRemove } from "react-icons/md";
import { TbHeartMinus } from "react-icons/tb";
import VideoCard from "./shared/VideoCard";
import { Link } from "react-router-dom";
import axios from "axios";

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

  interface User {
    _id: string;
    username: string;
    email: string;
    profile: string;
    bio: string;
    role: string;
  }


  const [posts, setPosts] = useState<Post[]>([]);
  const [user,setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [likes,setLikes] = useState<Post[]>([])
  const [stage, setStage] = useState<"videos" | "favorites" | "liked">(
    "videos"
  );

  const videoButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (videoButtonRef.current) {
      videoButtonRef.current.focus();
    }

    const getUserPost = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/posts/${username}`);
        setPosts(data);
      } catch (error) {
        toast({
          title: "Error",
          description: axiosErrorManager(error) || "An unknown error occurred.",
        });
      }
    };
    getUserPost();
  }, [username]);
  
  useEffect(()=>{
    const getUser = async()=>{
      try {
        const { data } = await axiosInstance.get(`/user/profile/${username}`);
        setUser(data)
      } catch (error) {
        toast({
          title: "Error",
          description: axiosErrorManager(error) || "An unknown error occurred.",
        });
      }
    }
    getUser()
  },[username])

useEffect(()=>{
  const getUserFavorites = async()=>{
    try {
      if(user){
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/favorites/user/${user?._id}`);
        setFavorites(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: axiosErrorManager(error) || "An unknown error occurred.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  }
  getUserFavorites()
},[user])

useEffect(()=>{
const getUserLikes = async()=>{
  console.log("HI ")
  try{
    if(user){
      const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/user/posts/like/${user?._id}`)
      setLikes(data)
      console.log(data)
    }
  }catch(err){
    toast({
      title: "Error",
      description: axiosErrorManager(err) || "An unknown error occurred.",
      className: "bg-red-500 font-semibold text-white",
    })
  }
}
getUserLikes()
},[user])
  return (
    <div>
      <div className="flex font-semibold text-[18px] gap-5">
        <button
          ref={videoButtonRef}
          onClick={() => setStage("videos")}
          className={`w-24 border-b-2 ${
            stage === "videos" ? "border-white" : "border-b-transparent"
          } hover:border-b-2 hover:border-white`}
        >
          <div
            className={`flex gap-1 justify-center items-center ${
              stage === "videos" ? "text-white" : "text-[#8a8a8a]"
            }`}
            tabIndex={0}
          >
            <HiOutlineAdjustmentsVertical /> Videos
          </div>
        </button>
        <button
          onClick={() => setStage("favorites")}
          className={`w-24 border-b-2 ${
            stage === "favorites" ? "border-white" : "border-b-transparent"
          } hover:border-b-2 hover:border-white`}
        >
          <div
            className={`flex gap-1 justify-center items-center ${
              stage === "favorites" ? "text-white" : "text-[#8a8a8a]"
            }`}
            tabIndex={0}
          >
            <MdBookmarkRemove /> Favorites
          </div>
        </button>
        <button
          onClick={() => setStage("liked")}
          className={`w-24 border-b-2 ${
            stage === "liked" ? "border-white" : "border-b-transparent"
          } hover:border-b-2 hover:border-white`}
        >
          <div
            className={`flex gap-1 justify-center items-center ${
              stage === "liked" ? "text-white" : "text-[#8a8a8a]"
            }`}
            tabIndex={0}
          >
            <TbHeartMinus /> Liked
          </div>
        </button>
      </div>
      <hr className="opacity-10 text-gray-500" />
      {stage === "videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link to={`/user/video/${post._id}`} key={post._id}>
                <VideoCard file={post.file}  />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No videos found.</p>
          )}
        </div>
      )}
      {stage === "favorites" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {favorites.length > 0 ? (
            favorites.map((post) => (
              <Link to={`/user/video/${post._id}`} key={post._id}>
                <VideoCard file={post.file}  />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No videos found.</p>
          )}
        </div>
        </div>
      )}
      {stage === "liked" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {likes.length > 0 ? (
            likes.map((post) => (
              <Link to={`/user/video/${post._id}`} key={post._id}>
                <VideoCard file={post.file}  />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No videos found.</p>
          )}
        </div>
        </div>
      )}
    </div>
  );
}

export default ProfileVideoShow;
