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
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";

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
  const { setModalType, setShowModal, setPosts } = userContext || {};
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
        handlePreviousPost();
      }
    };

    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [previousPosts, activePost]);

  const fetchProfilePicture = async (username: string) => {
    if (profilePictures[username]) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile/${username}`
      );
      setProfilePictures((prev) => ({ ...prev, [username]: data.profile }));
    } catch (error) {
      toast({
        title: "Error",
        description:
          axiosErrorManager(error) || "Failed to fetch profile picture.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

  const fetchRandomPost = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/posts/video/random`
      );
      if (data && data.length > 0) {
        const newPost = data[0];
        if (activePost) {
          setPreviousPosts((prev) => [...prev, activePost]);
        }
        setActivePost(newPost);
        fetchProfilePicture(newPost.username);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: axiosErrorManager(error) || "Failed to fetch random post.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

  const toggleLike = async () => {
    if (!activePost || !currUser?._id) {
      toast({
        title: "Like Error",
        description: "You must be logged in to like posts.",
        className: "bg-red-500 font-semibold text-white",
      });
      setModalType?.("login");
      setShowModal?.(true);
      return;
    }

    try {
      const isLiked = activePost.likes.includes(currUser._id);

      const { data } = isLiked
        ? await axiosInstance.patch(`/user/posts/like/${activePost._id}`)
        : await axiosInstance.post(`/user/posts/like/${activePost._id}`);

      setActivePost((prev) => (prev ? { ...prev, likes: data.likes } : null));

      if (setPosts) {
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id === activePost._id) {
              return { ...post, likes: data.likes };
            }
            return post;
          })
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          axiosErrorManager(error) || "Failed to toggle like status.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };
  const toggleFavorites = async () => {
    try {
      if (!activePost || !currUser?._id) {
        toast({
          title: "Favorite Error",
          description: "You must be logged in to Favorite posts.",
          className: "bg-red-500 font-semibold text-white",
        });
        return;
      }
      const isFavorite = activePost.favorites.includes(currUser._id);
      const { data } = isFavorite
        ? await axiosInstance.delete(`/user/favorites/${activePost._id}`)
        : await axiosInstance.post(`/user/favorites/${activePost._id}`);
      setActivePost((prev) =>
        prev ? { ...prev, favorites: data.favorites } : null
      );
      if (setPosts) {
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id === activePost._id) {
              return { ...post, favorites: data.favorites };
            }
            return post;
          })
        );
      }
    } catch (error) {
      toast({
        title: "Favorite Error",
        description:
          axiosErrorManager(error) || "Failed to toggle favorite status.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!touchStartY) return;

        const touchEndY = e.touches[0].clientY;
        const difference = touchStartY - touchEndY;

        if (Math.abs(difference) > 30) {
            if (difference > 0) {
                fetchRandomPost();
            } else if (difference < 0 && previousPosts.length > 0) {
                handlePreviousPost();
            }
            touchStartY = 0; 
        }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
    };
}, [previousPosts, activePost]);

  return (
    <div className="h-screen overflow-hidden">
      <NavBar />
      <div className="flex">
        <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>
        <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
          <MobileBottomBar/>
        </div>
        <div className="flex-grow pt-4">
          <div className="flex flex-col justify-center items-center overflow-hidden h-screen relative">
            {activePost && (
              <div className="w-auto md:h-[500px] h-auto max-w-[800px] ml-[-200px] mt-5 absolute flex justify-center items-center transition-opacity duration-300">
                <div className="relative ms-20 mt-[-57px] md:mt-0 md:ms-0 left-[66px] md:left-0 w-[385px] h-[555px] max-w-[500px] md:h-[530px]   flex justify-center items-center transition-opacity duration-300">
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
                    <p className="flex justify-center items-center gap-2 me-16 ms-0">
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
                    className="md:mt-0 mt-[-55px] w-10 h-10 object-cover rounded-full"
                  />
                </div>
                <div className="absolute mt-28 md:bottom-4 right-[-50px] z-10 ">
                  <VideoPostIcons
                    _id={activePost._id}
                    small={false}
                    like={activePost.likes.length}
                    comment={activePost.comments.length}
                    favorites={activePost.favorites.length}
                    toggleLike={() => toggleLike()}
                    toggleFavorites={() => toggleFavorites()}
                    isLiked={activePost.likes.includes(currUser?._id ?? "")}
                    isFavorite={activePost.favorites.includes(
                      currUser?._id ?? ""
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
      <button
          className="absolute hidden md:top-64 md:right-10 md:bg-[#30303087] md:hover:bg-[#383838] w-16 h-16 md:flex justify-center items-center rounded-full md:p-2 md:active:bg-[#000000fd]"
          onClick={() => {
          if (previousPosts.length > 0) {
            setActivePost(previousPosts[previousPosts.length - 1]);
            setPreviousPosts((prev) => prev.slice(0, -1));
          }
        }}
      >
        <MdOutlineKeyboardArrowUp
          className="text-white active:text-[red] md:active:text-white"
          size={40}
        />
      </button>
      
        <button
          onClick={fetchRandomPost}
          className="absolute hidden md:bottom-52 md:right-10  md:bg-[#30303087] md:hover:bg-[#383838] w-16 h-16 justify-center items-center md:flex rounded-full md:p-2 md:active:bg-[#000000fd]"
        >
          <MdOutlineKeyboardArrowDown
            className="text-white active:text-[green] md:active:text-white"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}
export default Home;
