import NavBar from "@/components/NavBar";
import VideoCard from "@/components/shared/VideoCard";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import { UserContext } from "@/context/UserProvider";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import axiosInstance from "@/utilities/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        const { data } = await axiosInstance.get(`/user/following/videos/${currUser?._id}`,{
            params: { page, limit: 10 }
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
        <div className="mt-20 ms-8 pt-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {posts.map((post) => (
              <div key={post._id}>
                <Link to={`/user/video/${post._id}`}>
                  <VideoCard file={post.file} />
                </Link>
                <div className="flex justify-center absolute mt-[-95px]   w-64  text-sm text-gray-600">
                  <Link to={`/profile/${post.username}`}>
                  {post.user?.profile && (
                      <img
                      src={post.user?.profile}
                      alt={`${post.username}'s profile`}
                      className="w-14 h-14 rounded-full object-cover "
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
