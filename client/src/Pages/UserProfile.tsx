import { UserContext } from "@/context/UserProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { HiDotsHorizontal } from "react-icons/hi";
import UserDetailsEdit from "@/modal/UserDetailsEdit";
import HomeSidebar from "@/components/HomeSideBar";
interface User {
  id: string;
  username: string;
  email: string;
  profile: string;
  bio: string;
  role: string;
}

function UserProfile(): JSX.Element {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is not available");
  }
  const { currUser, showUserEdit, setShowUserEdit } = userContext;
  const { username } = useParams();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const isCurrUser = currUser?.username === username;

  useEffect(() => {
    const FetchUser = async (): Promise<void> => {
      try {
        const res = await axios.get(
          `http://localhost:3000/user/profile/${username}`
        );
        const data = res.data;
        if (data.username === username) {
          setOtherUser(data);
          setUserNotFound(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setUserNotFound(true);
        } else {
          console.error(error);
        }
      }
    };
    FetchUser();
  }, [username, currUser]);
  return (
    <div>
      {isCurrUser && (
        <div className="flex mt-24 ms-64">
          <div className="w-[150px] h-[150px] flex items-center rounded-full overflow-hidden" >
          {currUser?.profile ? (
            <img className="object-cover w-full h-full" src={currUser?.profile} alt="" />
          ) : (
            <FaUserCircle className="text-white w-full h-full" size={150} />
          )}
          </div>
          <div>
            <h1 className="text-white text-2xl ms-5 mt-8">{username}</h1>
            <div className="flex">
              <Button
                onClick={() => setShowUserEdit(true)}
                variant={"pinks"}
                className="ms-4 mt-3 w-[115px] h-[40px]"
              >
                Edit Profile
              </Button>
              <IoSettingsOutline className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
              <RiShareForwardLine className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
            </div>
            <div className="flex gap-5 ms-5 mt-2 text-white font-semibold">
              <p className="hover:underline cursor-pointer">0 Following</p>
              <p className="hover:underline cursor-pointer">0 Followers</p>
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
      )}
      {otherUser && !isCurrUser && (
        <div className="flex items-center mt-24 ms-72 ">
          <div className="w-[150px] h-[150px] flex items-center rounded-full overflow-hidden" >
          {otherUser?.profile ? (
            <img className="object-cover w-full h-full" src={otherUser?.profile} alt="" />
          ) : (
            <FaUserCircle className="text-white w-full h-full" size={150} />
          )}
          </div>
          <div>
            <h1 className="text-white text-2xl ms-5 mt-8">{username}</h1>
            <div className="flex">
              <Button
                variant={"pinks"}
                className="ms-4 mt-3 w-[115px] h-[40px]"
              >
                Follow
              </Button>
              <button className="ms-4 mt-[12px] bg-[#303030] rounded-md w-[115px] h-[40px] text-white hover:bg-[#3e3e3e] cursor-pointer">
                Message
              </button>
              <RiShareForwardLine className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
              <HiDotsHorizontal className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white hover:bg-[#3e3e3e] cursor-pointer" />
            </div>
            <div className="flex gap-5 ms-5 mt-2 text-white font-semibold">
              <p className="hover:underline cursor-pointer">0 Following</p>
              <p className="hover:underline cursor-pointer">0 Followers</p>
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
      )}
      {userNotFound && (
        <div className="flex flex-col justify-center items-center mt-20">
          <h1 className="text-white text-3xl font-bold">User Not Found</h1>
          <p className="text-gray-400 mt-2">
            The user you are looking for does not exist.
          </p>
        </div>
      )}
      <HomeSidebar />
      {showUserEdit && <UserDetailsEdit />}
    </div>
  );
}

export default UserProfile;
