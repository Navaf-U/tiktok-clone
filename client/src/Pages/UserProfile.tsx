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
import axiosErrorManager from "@/utilities/axiosErrorManager.ts";
import axiosInstance from "@/utilities/axiosInstance.ts";
import FollowersShow from "@/modal/FollowersShow";
import { FaPlus } from "react-icons/fa6";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
import DeleteUserAccount from "@/modal/DeleteUserAccount";
import PfpOnlyShow from "@/modal/PfpOnlyShow";
import { useSocketContext } from "@/context/SocketProvider";
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
  const { socket } = useSocketContext();
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
    showAccountDelete,
    setShowAccountDelete,
  } = userContext;
  const { username } = useParams();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [following, setFollowing] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [profileShow, setProfileShow] = useState<boolean>(false);
  const [likeCountOfUser, setlikeCountOfUser] = useState<number>(0);

  const [stage, setStage] = useState<"following" | "followers" | "suggested">(
    "following"
  );
  const navigate = useNavigate();

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
          `${import.meta.env.VITE_API_URL
          }/user/followers/${otherUserID}/${userID}`
        );
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };

    FetchUser();
  }, [username, currUser]);

  const getUserLikes = async (userID: string) => {
    try {
      if (userID) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/posts/like/${userID}`
        );
        setlikeCountOfUser(data.length);
      }
    } catch (err) {
      console.error(axiosErrorManager(err));
    }
  };

  useEffect(() => {
    const userID = isCurrUser ? currUser?._id : otherUser?._id;
    if (userID) {
      getUserLikes(userID);
    }
  }, [currUser, isCurrUser, otherUser]);

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
      if (socket) {
        socket.emit("follow", { receiverId: userId });
      }
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
            <div
              onClick={() => setProfileShow(true)}
              className="absolute left-28 w-[150px] h-[150px] top-16 flex md:hidden items-center rounded-full overflow-hidden"
            >
              <UserProfilePicture
                profile={currUser?.profile}
                className="object-cover cursor-pointer w-full h-full"
              />
            </div>
            <div
              onClick={() => setProfileShow(true)}
              className="md:w-[150px] md:h-[150px] hidden md:flex items-center rounded-full overflow-hidden"
            >
              <UserProfilePicture
                profile={currUser?.profile}
                className="object-cover cursor-pointer w-full h-full"
              />
            </div>
            {profileShow && currUser?.profile && (
              <PfpOnlyShow
                profile={currUser.profile}
                setProfileShow={setProfileShow}
              />
            )}
            <div className="mt-16 md:mt-0">
              <h1 className="text-white text-2xl text-center ms-10 md:text-start md:ms-5 mt-16 md:mt-0">
                {username}
              </h1>
              <div className="flex ms-10 md:ms-0 md:mt-0">
                <Button
                  onClick={editPorfile}
                  variant={"pinks"}
                  className="ms-4 mt-3 w-[115px] h-[40px]"
                >
                  Edit Profile
                </Button>
                <IoSettingsOutline
                  onClick={() => setShowAccountDelete(true)}
                  className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer"
                />
                <RiShareForwardLine className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
                <FaPlus
                  onClick={() => navigate("/upload/video")}
                  className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer"
                />
              </div>
              <div className="flex gap-5 ms-16 mt-5 md:ms-5 md:mt-2 text-white font-semibold">
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
                <p className="hover:underline cursor-pointer">
                  {likeCountOfUser} Likes
                </p>
              </div>
              <div className="mt-2 ms-16 md:mt-2 md:ms-5 font-normal text-[17px]">
                {isCurrUser && currUser?.bio ? (
                  <h1>{currUser.bio}</h1>
                ) : (
                  <p>No bio yet.</p>
                )}
              </div>
            </div>
          </div>
          {showAccountDelete && <DeleteUserAccount />}
          <div className="mt-5 md:mt-7 md:ms-64 ms-2">
            {username && <ProfileVideoShow username={username} />}
          </div>
        </div>
      )}
      {otherUser && !isCurrUser && (
        <div>
          <div className="flex items-center mt-24 md:ms-72 ">
            <div
              onClick={() => setProfileShow(true)}
              className="absolute left-28 w-[150px] h-[150px] top-16 flex md:hidden items-center rounded-full overflow-hidden"
            >
              <UserProfilePicture
                profile={otherUser?.profile}
                className="object-cover w-full cursor-pointer h-full"
              />
            </div>
            <div
              onClick={() => setProfileShow(true)}
              className="w-[150px] h-[150px] hidden md:flex items-center rounded-full overflow-hidden"
            >
              <UserProfilePicture
                profile={otherUser?.profile}
                className="object-cover cursor-pointer w-full h-full"
              />
            </div>
            {profileShow && (
              <PfpOnlyShow
                profile={otherUser?.profile}
                setProfileShow={setProfileShow}
              />
            )}
            <div>
              <h1 className="text-white text-2xl text-center  md:text-start md:ms-9 md:mt-8 mt-32">
                {username}
              </h1>
              <div className="flex ms-5">
                <Button
                  variant={"pinks"}
                  onClick={isFollowing ? unfollowUser : followUser}
                  className="ms-4 mt-3 w-[115px] h-[40px]"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <button
                  disabled={!currUser}
                  onClick={() =>
                    navigate(`/user/messages?u=${otherUser.username}`)
                  }
                  className={`ms-2 mt-[12px] rounded-md w-[115px] h-[40px] text-white relative group transition
                     ${currUser
                      ? 'bg-[#303030] hover:bg-[#3e3e3e] cursor-pointer'
                      : 'bg-[#555555] cursor-not-allowed opacity-60'}`}
                >
                  Message

                  {!currUser && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      You must login
                    </span>
                  )}
                </button>
                <RiShareForwardLine className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
                <HiDotsHorizontal className="ms-2 mt-3 me-1 w-[40px] p-2 h-[40px]  bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
              </div>
              <div className="flex gap-5 ms-16 mt-2 text-white font-semibold">
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
                <p className="hover:underline cursor-pointer">
                  {likeCountOfUser} Likes
                </p>
              </div>
              <div className="mt-2 ms-16  font-normal text-[17px]">
                {otherUser && otherUser?.bio ? (
                  <h1>{otherUser.bio}</h1>
                ) : (
                  <p>No bio yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 md:ms-64">
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
        <MobileBottomBar />
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
