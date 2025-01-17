import NavBar from "@/components/NavBar";
import VideoCard from "@/components/shared/VideoCard";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import { UserContext } from "@/context/UserProvider";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import axiosInstance from "@/utilities/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";

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
  const userContex = useContext(UserContext);
  const currUser = userContex?.currUser;
  useEffect(() => {
    if (!currUser?._id) {
      console.error("User ID is missing or invalid.");
      return;
    }
    const getFollowingUsersVid = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user/following/videos/${currUser?._id}`,
          {
            params: { page, limit: 10 },
          }
        );
        setPosts((prev) => {
          const ids = new Set(prev.map((post) => post._id));
          return [...prev, ...data.filter((post: Post) => !ids.has(post._id))];
        });
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    getFollowingUsersVid();
  }, [currUser, page]);

  const loadMore = () => setPage((prev) => prev + 1);
  return (
    <div>
      <NavBar />
      <div className="flex">
        <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>
        <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
          <MobileBottomBar/>
        </div>
        <div className="mt-20 ms-8 pt-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 pt-4">
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
        </div>
      </div>
      <button onClick={loadMore} className="text-center w-full font-bold mb-2">
        load more...
      </button>
    </div>
  );
}

export default FollowingUsersVideo;
