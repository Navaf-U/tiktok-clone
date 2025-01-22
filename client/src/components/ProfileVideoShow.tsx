import axiosErrorManager from "@/utilities/axiosErrorManager";
import axiosInstance from "@/utilities/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { MdBookmarkRemove } from "react-icons/md";
import { TbHeartMinus } from "react-icons/tb";
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
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Post[]>([]);
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
        console.error(axiosErrorManager(error));
      }
    };
    getUserPost();
  }, [username]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/profile/${username}`);
        setUser(data);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    getUser();
  }, [username]);

  useEffect(() => {
    const getUserFavorites = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/favorites/user/${user?._id}`
          );
          setFavorites(data);
        }
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    getUserFavorites();
  }, [user]);

  useEffect(() => {
    const getUserLikes = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/posts/like/${user?._id}`
          );
          setLikes(data);
        }
      } catch (err) {
        console.error(axiosErrorManager(err));
      }
    };
    getUserLikes();
  }, [user]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    video.play();
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

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
          ref={videoButtonRef}
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
          ref={videoButtonRef}
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
        <div className="min-h-[200px] grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 me-3 pb-20 mt-3">
          {posts.length > 0 ? (
            posts
              .slice()
              .reverse()
              .map((post) => (
                <Link to={`/user/video/${post._id}`} key={post._id}>
                  <video
                    className="w-full border border-gray-900 h-full object-cover"
                    src={post.file}
                    muted
                    loop
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  ></video>
                </Link>
              ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No videos found.
            </p>
          )}
        </div>
      )}
     {stage === "favorites" && (
  <div className="min-h-[200px] grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 me-3 pb-20 mt-3">
    {favorites.length > 0 ? (
      favorites
        .slice()
        .reverse()
        .map((post) => (
          <Link to={`/user/video/${post._id}`} key={post._id}>
            <video
              className="w-full h-[180px] md:h-[450px] border border-gray-900 object-cover"
              src={post.file}
              muted
              loop
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            ></video>
          </Link>
        ))
    ) : (
      <p className="text-center text-gray-500 col-span-full">
        No videos found.
      </p>
    )}
  </div>
)}

      {stage === "liked" && (
        <div className=" min-h-[200px] grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 me-3 pb-20 mt-3">
          {likes.length > 0 ? (
            likes
              .slice()
              .reverse()
              .map((post) => (
                <Link to={`/user/video/${post._id}`} key={post._id}>
                  <video
                    className="w-full h-full object-cover"
                    src={post.file}
                    muted
                    loop
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  ></video>
                </Link>
              ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No videos found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileVideoShow;
