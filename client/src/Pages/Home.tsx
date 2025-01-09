import React, { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "@/components/NavBar";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import VideoPostIcons from "@/components/shared/VideoPostIcons";

interface Post {
  _id: string;
  file: string;
  likes: string[];
  comments: object[];
  favorites: string[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

function Home(): JSX.Element {
  const userContext = useContext(UserContext);
  
  const posts: Post[] = userContext?.posts || [];
  const shuffledPosts = shuffleArray(posts);

  const [activeIndex, setActiveIndex] = useState(0);

  const videoRefs = useRef(
    shuffledPosts.map(() => React.createRef<HTMLVideoElement>())
  );

  const handleArrowKeys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((prevIndex) => (prevIndex + 1) % shuffledPosts.length);
      }
      if (e.key === "ArrowUp") {
        setActiveIndex(
          (prevIndex) =>
            (prevIndex - 1 + shuffledPosts.length) % shuffledPosts.length
        );
      }
    },
    [shuffledPosts.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleArrowKeys);

    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [handleArrowKeys]);

  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex]?.current;
    if (activeVideo) {
      activeVideo.play();
    }
  }, [activeIndex]);
console.log(shuffledPosts)
  return (
    <div className="h-screen overflow-hidden">
      <NavBar />
      <div className="flex">
        <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>
        <div className="flex-grow pt-4">
          <div className="flex flex-col justify-center  items-center overflow-hidden h-screen relative">
            {shuffledPosts.map(
              (post: Post, index: number) => (
                <div
                  key={post._id}
                  className={`w-auto h-[500px] max-w-[800px] mt-8 absolute flex justify-center items-center ms-[-270px] transition-opacity duration-300  ${
                    index === activeIndex ? "opacity-100 z-10" : "opacity-0"
                  }`}
                >
                  {index === activeIndex && (
                    <div className="w-full h-full">
                      <video
                        ref={videoRefs.current[index]}
                        className="w-full h-full object-cover rounded-md"
                        src={post.file}
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
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-72 right-4 bg-[#303030] hover:bg-[#383838] rounded-full p-1 active:bg-red-600"
        onClick={() =>
          setActiveIndex(
            (prevIndex) =>
              (prevIndex - 1 + shuffledPosts.length) % shuffledPosts.length
          )
        }
      >
        <MdOutlineKeyboardArrowUp className="text-white" size={40} />
      </button>
      <button
        className="fixed bottom-56 right-4 bg-[#303030] hover:bg-[#383838] rounded-full p-1 active:bg-red-600"
        onClick={() =>
          setActiveIndex((prevIndex) => (prevIndex + 1) % shuffledPosts.length)
        }
      >
        <MdOutlineKeyboardArrowDown className="text-white" size={40} />
      </button>
    </div>
  );
}


export default Home;
