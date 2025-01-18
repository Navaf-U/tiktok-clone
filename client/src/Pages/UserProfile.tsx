import { UserContext } from "@/context/UserProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { HiDotsHorizontal } from "react-icons/hi";
import UserDetailsEdit from "@/modal/UserDetailsEdit";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import UserProfilePicture from "../components/shared/UserProfilePicture";
import NavBar from "@/components/NavBar";
import ProfileVideoShow from "@/components/ProfileVideoShow";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import axiosInstance from "@/utilities/axiosInstance";
import FollowersShow from "@/modal/FollowersShow";
import { FaPlus } from "react-icons/fa6";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
interface User {
  _id: string;
  username: string;
  email: string;
  profile: string;
  bio: string;
  role: string;
}

interface Follower {
  _id: string;
  follower: {
    _id: string;
    username: string;
    profile: string;
  };
  following: string;
}
interface Following {
  _id: string;
  following: {
    _id: string;
    username: string;
    profile: string;
  };
  follower: string;
}

function UserProfile(): JSX.Element {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is not available");
  }
  const {
    currUser,
    showUserEdit,
    setShowUserEdit,
    followsShow,
    setFollowsShow,
  } = userContext;
  const { username } = useParams();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [following, setFollowing] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [stage, setStage] = useState<"following" | "followers" | "suggested">("following" );
  const navigate = useNavigate()

  const editPorfile = () => {
    setShowUserEdit(true);
  };

  const followerHandler = () => {
    setStage("followers");
    setFollowsShow(true);
  };

  const followingHandler = () => {
    setStage("following");
    setFollowsShow(true);
  };

  const isCurrUser = currUser?.username === username;

  useEffect(() => {
    const FetchUser = async (): Promise<void> => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${username}`
        );
        const data = res.data;
        if (data.username === username) {
          setOtherUser(data);
          setUserNotFound(false);
          checkIfFollowing(data._id);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setUserNotFound(true);
        } else {
          console.error(axiosErrorManager(error));
        }
      }
    };

    const checkIfFollowing = async (otherUserID: string) => {
      try {
        const userID = currUser?._id;
        if (!userID) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/followers/${otherUserID}/${userID}`
        );
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };

    FetchUser();
  }, [username, currUser]);

  useEffect(() => {
    const getFollowes = async (): Promise<void> => {
      try {
        const userId = isCurrUser ? currUser?._id : otherUser?._id;
        if (!userId) {
          return;
        }
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/follows/${userId}`
        );
        setFollowing(data.following.data);
        setFollowers(data.followers.data);
        setFollowingCount(data.following.count);
        setFollowersCount(data.followers.count);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    getFollowes();
  }, [currUser, otherUser, isCurrUser, isFollowing]);

  const followUser = async (): Promise<void> => {
    try {
      const userId = otherUser?._id;
      if (!userId) {
        return;
      }
      await axiosInstance.post(`/user/follow/`, {
        userIdToFollow: userId,
      });
      setIsFollowing(true);
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
  };

  const unfollowUser = async (): Promise<void> => {
    try {
      const userId = otherUser?._id;
      if (!userId) {
        return;
      }
      await axiosInstance.post(`/user/unfollow/`, {
        userIdToUnfollow: userId,
      });
      setIsFollowing(false);
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
  };

  return (
    <div>
      <NavBar />
      {isCurrUser && (
        <div>
          <div className="flex mt-24 md:ms-64">
            <div className=" absolute left-28 w-[150px] h-[150px] top-16 flex md:hidden items-center rounded-full overflow-hidden">
              <UserProfilePicture
                profile={currUser?.profile}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="md:w-[150px] md:h-[150px] hidden md:flex items-center rounded-full overflow-hidden">
              <UserProfilePicture
                profile={currUser?.profile}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mt-16 md:mt-0">
              <h1 className="text-white text-2xl ms-5 mt-8">{username}</h1>
              <div className="flex">
                <Button
                  onClick={editPorfile}
                  variant={"pinks"}
                  className="ms-4 mt-3 w-[115px] h-[40px]"
                >
                  Edit Profile
                </Button>
                <IoSettingsOutline className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
                <RiShareForwardLine className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
                <FaPlus onClick={()=>navigate("/upload/video")} className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
              </div>
              <div className="flex gap-5 ms-5 mt-2 text-white font-semibold">
                <p
                  onClick={followingHandler}
                  className="hover:underline cursor-pointer"
                >
                  {followingCount} Following
                </p>
                <p
                  onClick={followerHandler}
                  className="hover:underline cursor-pointer"
                >
                  {followersCount} Followers
                </p>
                <p className="hover:underline cursor-pointer">0 Likes</p>
              </div>
              <div className="mt-2 ms-5 font-normal text-[17px]">
                {isCurrUser && currUser?.bio ? (
                  <h1>{currUser.bio}</h1>
                ) : (
                  <p>No bio yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 md:ms-64 ms-7">
            {username && <ProfileVideoShow username={username} />}
          </div>
        </div>
      )}
      {otherUser && !isCurrUser && (
        <div>
          <div className="flex items-center mt-24 md:ms-72 ">
            <div className=" absolute left-28 w-[150px] h-[150px] top-16 flex md:hidden items-center rounded-full overflow-hidden">
              <UserProfilePicture
                profile={otherUser?.profile}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-[150px] h-[150px] hidden md:flex items-center rounded-full overflow-hidden">
              <UserProfilePicture
                profile={otherUser?.profile}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-white text-2xl ms-5 md:mt-8 mt-32">{username}</h1>
              <div className="flex">
                <Button
                  variant={"pinks"}
                  onClick={isFollowing ? unfollowUser : followUser}
                  className="ms-4 mt-3 w-[115px] h-[40px]"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <button className="ms-4 mt-[12px] bg-[#303030] rounded-md w-[115px] h-[40px] text-white hover:bg-[#3e3e3e] cursor-pointer">
                  Message
                </button>
                <RiShareForwardLine className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
                <HiDotsHorizontal className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
              </div>
              <div className="flex gap-5 ms-5 mt-2 text-white font-semibold">
                <p
                  onClick={followingHandler}
                  className="hover:underline cursor-pointer"
                >
                  {followingCount} Following
                </p>
                <p
                  onClick={followerHandler}
                  className="hover:underline cursor-pointer"
                >
                  {followersCount} Followers
                </p>
                <p className="hover:underline cursor-pointer">0 Likes</p>
              </div>
              <div className="mt-2 ms-5 font-normal text-[17px]">
                {otherUser && otherUser?.bio ? (
                  <h1>{otherUser.bio}</h1>
                ) : (
                  <p>No bio yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 md:ms-64 ms-7">
            {username && <ProfileVideoShow username={username} />}
          </div>
        </div>
      )}
      {userNotFound && (
        <div className="flex flex-col justify-center items-center mt-20">
          <h1 className="text-white text-3xl font-bold">User Not Found</h1>
          <p className="text-gray-400 mt-2">
            The user you are looking for does not exist.
          </p>
        </div>
      )}
      <div className="hidden lg:flex">
        <HomeSidebar />
      </div>
      <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
          <MobileBottomBar/>
        </div>
      <div className="absolute left-[-200px] top-0">
      {showUserEdit && <UserDetailsEdit />}
      {followsShow && (
        <FollowersShow
          followingCount={followingCount}
          followersCount={followersCount}
          following={following}
          followers={followers}
          setFollowing={setFollowing}
          setFollowingCount={setFollowingCount}
          stage={stage}
          setStage={setStage}
        />
      )}
      </div>
    </div>
  );
}

export default UserProfile;
