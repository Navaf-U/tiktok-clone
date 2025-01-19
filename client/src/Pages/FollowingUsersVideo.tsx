/* eslint-disable react-hooks/exhaustive-deps */
import NavBar from "@/components/NavBar";
import VideoCard from "@/components/shared/VideoCard";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
import axiosInstance from "@/utilities/axiosInstance";
import { UserContext } from "@/context/UserProvider";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Post {
  username: string;
  _id: string;
  file: string;
  user: {
    username: string;
    profile: string;
  };
}

function FollowingUsersVideo(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const userContext = useContext(UserContext);
  const { currUser } = userContext || {};

  const fetchPosts = async (page: number) => {
    if (!currUser?._id) return;
    
    try {
      const { data } = await axiosInstance.get(`/user/following/videos/${currUser._id}`, {
        params: { page, limit: 8 },
      });

      if (data.length > 0) {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...data.filter((post: Post) => !prevPosts.some((prevPost) => prevPost._id === post._id)),
        ]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [currUser, page]);

  if (!currUser?._id) {
    return (
      <div>
        <NavBar />
        <div className="flex justify-center">
          <div className="w-1/5 hidden md:block">
            <HomeSidebar />
          </div>
          <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
            <MobileBottomBar />
          </div>
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-gray-700">
              Please log in to view videos from users you follow.
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="flex">
        <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>
        <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
          <MobileBottomBar />
        </div>
        <div className="mt-12 pt-4 mb-20">
          <div className="flex flex-wrap justify-center gap-5 mt-2">
            {posts.map((post) => (
              <div key={post._id}>
                <Link to={`/user/video/${post._id}`}>
                  <VideoCard file={post.file} />
                </Link>
                <div className="flex justify-center bg-[#00000063] items-center absolute mt-[-103px] md:w-64 w-[300px] h-20 text-sm text-gray-600 wave-bg">
                  <Link to={`/profile/${post.username}`}>
                    {post.user?.profile && (
                      <motion.img
                        src={post.user?.profile}
                        alt={`${post.username}'s profile`}
                        className="w-12 h-12 rounded-full mt-[-5px] object-cover"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        transition={{
                          duration: 0.5,
                          type: "spring",
                          stiffness: 300,
                        }}
                        whileHover={{
                          scale: 1.8,
                          rotate: 15,
                          transition: { duration: 0.3 },
                        }}
                      />
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              className="bg-[#121212] text-center w-full text-white rounded-md mt-4 px-4 py-2"
            >
              Load More...
            </button>
          )}
          {!hasMore && (
            <p className="text-center text-gray-500 mt-4">No more posts to load.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowingUsersVideo;
