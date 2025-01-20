import NavBar from "@/components/NavBar";
import UserProfilePicture from "@/components/shared/UserProfilePicture";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserProvider";
import axiosInstance from "@/utilities/axiosInstance";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";
import axiosErrorManager from "@/utilities/axiosErrorManager";

interface User {
  _id: string;
  email: string;
  username: string;
  profile: string;
  bio: string;
  role: string;
}

function FriendsPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userContext = useContext(UserContext);
  const { currUser } = userContext || {};
  const navigate = useNavigate();

  const getNonFollowedUsers = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const { data } = await axiosInstance.get("/user/following/non-user-profiles", {
        params: { page: page, limit: 10 },
      });
      if (data.length > 0) {
        setUsers((prevUser) => [
          ...prevUser,
          ...data.filter(
            (user: User) => !prevUser.some((prevUser) => prevUser._id === user._id)
          ),
        ]);
        setHasMore(data.length !== 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(axiosErrorManager(err));
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    getNonFollowedUsers(page);
  }, [page]);

  const handleScroll = () => {
    if (isFetching || !hasMore) return;
    const buffer = window.innerWidth <= 768 ? 100 : 50;
    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - buffer;

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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasMore, isFetching]);

  const handleFollow = async (userIdToFollow: string) => {
    try {
      const { data } = await axiosInstance.post("/user/follow", { userIdToFollow });
      if (data.message === "Followed successfully!") {
        setFollowing((prev) => new Set(prev.add(userIdToFollow)));
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <div>
        <NavBar />
      </div>
      <div className="md:ms-0 mt-20 md:mb-6 flex justify-center w-full h-full">
        {currUser && (
          <div className="flex flex-grow flex-wrap md:ms-48 justify-center md:justify-start gap-4 md:gap-8 md:ps-6 pb-20 md:pb-0">
            {users.map((user) => (
              <div key={user._id} className="bg-white flex justify-center items-center h-52 w-40 rounded-lg shadow-md cursor-pointer">
                <div className="flex flex-col items-center">
                  <div onClick={() => navigate(`/profile/${user.username}`)}>
                    <UserProfilePicture profile={user.profile} className="w-16 h-16" />
                    <h2 className="text-lg font-semibold text-red-500 text-center">{user.username}</h2>
                  </div>
                  <div className="mt-5">
                    <Button
                      variant={"pinks"}
                      className="w-32 flex justify-center items-center"
                      onClick={() => handleFollow(user._id)}
                    >
                      {following.has(user._id) ? (
                        <MdCheckCircle className="text-white" />
                      ) : (
                        "Follow"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-1/5 hidden md:block">
        <HomeSidebar />
      </div>
      <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
        <MobileBottomBar />
      </div>
      {!hasMore && users.length > 0 && (
        <p className="text-center font-semibold text-gray-500 mt-4">No more posts to load.</p>
      )}
      {isFetching && (
        <p className="text-center font-semibold text-gray-500 mt-4">Loading more posts...</p>
      )}

    </div>
  );
}

export default FriendsPage;
