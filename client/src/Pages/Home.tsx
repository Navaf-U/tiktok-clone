import React, { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import demoPng from "../assets/userDemoPfp.png"
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

  const posts: Post[] = userContext?.posts || [];
  const currUser = userContext?.currUser;
  const { setModalType, setShowModal } = userContext || {};
  const setPosts = userContext?.setPosts;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [profilePictures, setProfilePictures] = useState<Record<string, string>>({});
  const videoRefs = useRef(
    posts?.map(() => React.createRef<HTMLVideoElement>())
  );
  const navigate = useNavigate()

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length);
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
      }
    };

    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [posts.length]);

  useEffect(() => {
    posts.forEach((post) => {
      fetchProfilePicture(post.username);
    });
  }, [posts]);

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
      const activePost = posts.find((post) => post._id === postId);
      if (!activePost) return;

      const isLiked = activePost.likes.includes(currUser._id);
      const { data } = isLiked
        ? await axiosInstance.patch(`/user/posts/like/${postId}`)
        : await axiosInstance.post(`/user/posts/like/${postId}`);

      setPosts?.((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
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

  const fetchProfilePicture = async (username: string) => {
    if (profilePictures[username]) return;

    try {
      const { data } = await axios.get(`http://localhost:3000/user/profile/${username}`);
      console.log(data);
      setProfilePictures((prev) => ({ ...prev, [username]: data.profile }));
    } catch (error) {
      console.error(`Failed to fetch profile for ${username}:`, error);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="h-screen overflow-hidden">
      <NavBar />
      <div className="flex">
        <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>
        <div className="flex-grow pt-4">
          <div className="flex flex-col justify-center items-center overflow-hidden h-screen relative">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className={`w-auto md:h-[500px] h-auto max-w-[800px] mt-8 absolute flex justify-center items-center transition-opacity duration-300 lg:ms-[-290px] ${
                  index === activeIndex ? "opacity-100 z-10" : "opacity-0"
                }`}
              >
                {index === activeIndex && (
                  <div className="w-full h-full">
                    <video
                      ref={videoRefs.current[index]}
                      className="w-full h-full object-cover rounded-md"
                      src={post?.file}
                      muted={isMuted}
                      loop
                      autoPlay
                    />
                    <div className="absolute bottom-2 left-2">
                      <div className="flex pb-1 items-center text-sm">
                        <Link
                          className="me-1"
                          to={`/profile/${post?.username}`}
                        >
                          {post?.username}
                        </Link>
                        <b className="mb-2">.</b>
                        <p className="ms-1">
                          {post?.date
                            ? formatDistanceToNow(new Date(post.date), {
                                addSuffix: true,
                              })
                            : ""}
                        </p>
                      </div>
                      <p className="pb-2">{post?.description}</p>
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
                )}
                <div onClick={()=>navigate(`/profile/${post.username}`)} className="absolute top-[190px] cursor-pointer right-[-51px]">
                  <img
                    src={profilePictures[post?.username] || demoPng }
                    alt={post.username}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>
                <div className="absolute md:bottom-4 md:right-[-50px] z-20 right-2">
                  <VideoPostIcons
                    _id={post._id}
                    small={false}
                    like={post.likes.length}
                    comment={post.comments.length}
                    favorites={post.favorites.length}
                    toggleLike={() => toggleLike(post._id)}
                    isLiked={post.likes.includes(currUser?._id ?? "")}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-4 flex flex-col items-center space-y-2 md:hidden">
        <button
          className="absolute top-16 z-10 bg-[#303030] hover:bg-[#383838] rounded-full p-2 active:bg-red-600"
          onClick={() =>
            setActiveIndex(
              (prevIndex) => (prevIndex - 1 + posts.length) % posts.length
            )
          }
        >
          <MdOutlineKeyboardArrowUp className="text-white" size={40} />
        </button>
        <button
          className="absolute bottom-5 z-10 bg-[#303030] hover:bg-[#383838] rounded-full p-2 active:bg-red-600"
          onClick={() =>
            setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length)
          }
        >
          <MdOutlineKeyboardArrowDown className="text-white" size={40} />
        </button>
      </div>

      <button
        className="fixed bottom-72 right-4 bg-[#303030] hover:bg-[#383838] rounded-full p-1 active:bg-red-600 hidden md:block"
        onClick={() =>
          setActiveIndex(
            (prevIndex) => (prevIndex - 1 + posts.length) % posts.length
          )
        }
      >
        <MdOutlineKeyboardArrowUp className="text-white" size={40} />
      </button>
      <button
        className="fixed bottom-56 right-4 bg-[#303030] hover:bg-[#383838] rounded-full p-1 active:bg-red-600 hidden md:block"
        onClick={() =>
          setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length)
        }
      >
        <MdOutlineKeyboardArrowDown className="text-white" size={40} />
      </button>
    </div>
  );
}

export default Home;
