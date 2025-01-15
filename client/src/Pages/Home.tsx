import React, { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import demoPng from "../assets/userDemoPfp.png";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import VideoPostIcons from "@/components/shared/VideoPostIcons";
import axiosInstance from "@/utilities/axiosInstance";
import { toast } from "@/hooks/use-toast";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import { IoVolumeHigh } from "react-icons/io5";
import { HiSpeakerXMark } from "react-icons/hi2";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface Post {
  _id: string;
  username: string;
  file: string;
  likes: string[];
  comments: object[];
  favorites: string[];
  date: number;
  description: string;
}

function Home(): JSX.Element {
  const userContext = useContext(UserContext);

  const currUser = userContext?.currUser;
  const { setModalType, setShowModal } = userContext || {};
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [previousPosts, setPreviousPosts] = useState<Post[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [profilePictures, setProfilePictures] = useState<
    Record<string, string>
  >({});
  const videoRefs = useRef<React.RefObject<HTMLVideoElement>>(
    React.createRef()
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchRandomPost();
  }, []);

  const handlePreviousPost = () => {
    if (previousPosts.length > 0) {
      const lastPost = previousPosts[previousPosts.length - 1];
      setActivePost(lastPost);
      setPreviousPosts((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        fetchRandomPost();
      } else if (e.key === "ArrowUp" && previousPosts.length > 0) {
        handlePreviousPost()
      }
    };

    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [previousPosts,activePost]);
  console.log("object")

  const fetchProfilePicture = async (username: string) => {
    if (profilePictures[username]) return;

    try {
      const { data } = await axios.get(
        `http://localhost:3000/user/profile/${username}`
      );
      setProfilePictures((prev) => ({ ...prev, [username]: data.profile }));
    } catch (error) {
      console.error(`Failed to fetch profile for ${username}:`, error);
    }
  };

  const fetchRandomPost = async () => {
    try {
     const { data } = await axios.get("http://localhost:3000/user/posts/video/random");
    if (data && data.length > 0) {
      const newPost = data[0];
      if (activePost) {
        setPreviousPosts((prev) => [...prev, activePost]);
      }
      setActivePost(newPost);
      fetchProfilePicture(newPost.username);
    }
   } catch (error) {
      console.error("Error fetching random post:", error);
    }
  };
  const toggleLike = async (postId: string) => {
    if (!currUser?._id) {
      toast({
        title: "Error",
        description: "You must be logged in to like posts.",
        className: "bg-red-500 font-semibold text-white",
      });
      setModalType?.("login");
      setShowModal?.(true);
      return;
    }

    try {
      const { data } = await axiosInstance.post(`/user/posts/like/${postId}`);
      setActivePost((prevPost) =>
        prevPost && prevPost._id === postId
          ? { ...prevPost, likes: data.likes }
          : prevPost
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description:
          axiosErrorManager(error) || "Failed to toggle like status.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

 

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  console.log(activePost);

  return (
    <div className="h-screen overflow-hidden">
      <NavBar />
      <div className="flex">
        <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>
        <div className="flex-grow pt-4">
          <div className="flex flex-col justify-center items-center overflow-hidden h-screen relative">
            {activePost && (
              <div className="w-auto md:h-[500px] h-auto max-w-[800px] ml-[-200px] mt-8 absolute flex justify-center items-center transition-opacity duration-300">
                <div className="relative w-auto md:h-[500px] h-auto max-w-[500px] mt-8 flex justify-center items-center transition-opacity duration-300">
                  <video
                    ref={videoRefs.current}
                    className="w-full h-full object-cover rounded-md"
                    src={activePost.file}
                    muted={isMuted}
                    loop
                    autoPlay
                  />

                  <div className="absolute bottom-2 left-2">
                    <div className="flex pb-1 items-center text-sm">
                      <Link
                        className="me-1"
                        to={`/profile/${activePost.username}`}
                      >
                        {activePost.username}
                      </Link>
                      <b className="mb-2">.</b>
                      <p className="ms-1">
                        {activePost.date
                          ? formatDistanceToNow(new Date(activePost.date), {
                              addSuffix: true,
                            })
                          : ""}
                      </p>
                    </div>
                    <p className="pb-2">{activePost.description}</p>
                    <p className="flex justify-center items-center gap-2 me-5">
                      <BsMusicNoteBeamed size={15} /> original sound{" "}
                    </p>
                  </div>

                  <button
                    onClick={toggleMute}
                    className="absolute top-1 left-2 p-2 bg-black bg-opacity-20 rounded-full text-white"
                  >
                    {isMuted ? (
                      <HiSpeakerXMark size={24} />
                    ) : (
                      <IoVolumeHigh size={24} />
                    )}
                  </button>
                </div>

                <div
                  onClick={() => navigate(`/profile/${activePost.username}`)}
                  className="absolute top-[190px] cursor-pointer right-[-51px]"
                >
                  <img
                    src={profilePictures[activePost?.username] || demoPng}
                    alt={activePost.username}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>
                <div className="absolute md:bottom-4 md:right-[-50px] z-20 right-2">
                  <VideoPostIcons
                    _id={activePost._id}
                    small={false}
                    like={activePost.likes.length}
                    comment={activePost.comments.length}
                    favorites={activePost.favorites.length}
                    toggleLike={() => toggleLike(activePost._id)}
                    isLiked={activePost.likes.includes(currUser?._id ?? "")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed right-4 top-1/2 z-20 flex flex-col items-center space-y-2">
        <button
          className="bg-[#303030] hover:bg-[#383838] rounded-full p-2 active:bg-red-600"
          onClick={() => {
            if (previousPosts.length > 0) {
              setActivePost(previousPosts[previousPosts.length - 1]);
              setPreviousPosts((prev) => prev.slice(0, -1));
            }
          }}
        >
          <MdOutlineKeyboardArrowUp className="text-white" size={40} />
        </button>
        <button
          className="bg-[#303030] hover:bg-[#383838] rounded-full p-2 active:bg-red-600"
          onClick={fetchRandomPost}
        >
          <MdOutlineKeyboardArrowDown className="text-white" size={40} />
        </button>
      </div>
    </div>
  );
}

export default Home;
