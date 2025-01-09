import React, { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import VideoPostIcons from "@/components/shared/VideoPostIcons";
import axiosInstance from "@/utilities/axiosInstance";
import { toast } from "@/hooks/use-toast";
import axiosErrorManager from "@/utilities/axiosErrorManager";

interface Post {
  _id: string;
  file: string;
  likes: string[];
  comments: object[];
  favorites: string[];
}

function Home(): JSX.Element {
  const userContext = useContext(UserContext);

  const posts: Post[] = userContext?.posts || [];
  const currUser = userContext?.currUser;
  const setPosts = userContext?.setPosts;
  const [activeIndex, setActiveIndex] = useState(0); 
  const videoRefs = useRef(posts?.map(() => React.createRef<HTMLVideoElement>()));

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        const randomIndex = Math.floor(Math.random() * posts.length);
        setActiveIndex(randomIndex);
      }
    };

    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [posts.length]);

  const toggleLike = async (postId: string) => {
    if (!currUser?._id) {
      console.warn("Missing current user ID.", { currUser });
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
        description: axiosErrorManager(error) || "Failed to toggle like status.",
      });
    }
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
                className={`w-auto h-[500px] max-w-[800px] mt-8 absolute flex justify-center items-center transition-opacity duration-300 lg:ms-[-290px] ${
                  index === activeIndex ? "opacity-100 z-10" : "opacity-0"
                }`}
              >
                {index === activeIndex && (
                  <div className="w-full h-full">
                    <video
                      ref={videoRefs.current[index]}
                      className="w-full h-full object-cover rounded-md"
                      src={post?.file}
                      loop
                      autoPlay
                    />
                  </div>
                )}
                <div className="absolute bottom-4 right-[-50px]">
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
      <button
        className="fixed bottom-72 right-4 bg-[#303030] hover:bg-[#383838] rounded-full p-1 active:bg-red-600"
        onClick={() => setActiveIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length)}
      >
        <MdOutlineKeyboardArrowUp className="text-white" size={40} />
      </button>
      <button
        className="fixed bottom-56 right-4 bg-[#303030] hover:bg-[#383838] rounded-full p-1 active:bg-red-600"
        onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length)}
      >
        <MdOutlineKeyboardArrowDown className="text-white" size={40} />
      </button>
    </div>
  );
}

export default Home;
