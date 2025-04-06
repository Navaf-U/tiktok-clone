/* eslint-disable react-hooks/exhaustive-deps */
import NavBar from "@/components/NavBar";
import VideoCard from "@/components/shared/VideoCard";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosErrorManager from "@/utilities/axiosErrorManager.ts";

interface Post {
  _id: string;
  username: string;
  file: string;
  likes: string[];
  comments: Comment[];
  favorites: string[];
  date: number;
  description: string;
}

function ExplorePage(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPosts = async (pageNum: number) => {
    if (isFetching) return;

    setIsFetching(true);

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/posts/explore`,{params: {page: pageNum,limit:10}});
      if (data.length > 0) {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...data.filter(
            (post: Post) =>
              !prevPosts.some((prevPost) => prevPost._id === post._id)
          ),
        ]);
        setHasMore(data.length !== 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
    setIsFetching(false);
  };

  const handleScroll = () => {
    if (isFetching || !hasMore) return;
    const buffer = window.innerWidth <= 768 ? 100 : 50;
    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - buffer;

    if (scrolledToBottom) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setPage((prev) => prev + 1);
        timeoutRef.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasMore, isFetching]);

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
        <div className="flex justify-center md:ms-0 mt-20 md:mb-6 mb-20 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <Link to={`/user/video/${post._id}`} key={post._id}>
                <VideoCard file={post.file} />
              </Link>
            ))}
          </div>
          {!hasMore && posts.length > 0 && (
            <p className="text-center font-semibold text-gray-500 mt-4">
              No more posts to load.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
