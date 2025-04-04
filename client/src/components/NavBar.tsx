/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiMessageMinus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserProvider";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { BiUser } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaAdn } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { GoQuestion } from "react-icons/go";
import { MdOutlineDarkMode } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import tiktokFullPng from "../assets/tiktok-full-icon.png";
import tiktokIconPng from "../assets/tiktok-icon.png";
import Login from "../modal/Login";
import Signup from "../modal/Singup";
import { Link, useNavigate } from "react-router-dom";
import UserProfilePicture from "./shared/UserProfilePicture";
import axios from "axios";
import axiosErrorManager from "@/utilities/axiosErrorManager.ts";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { useNotifications } from "@/context/NotificationProvider";
import NotificationShow from "@/modal/NotificationShow";

interface User {
  _id: string;
  username: string;
  profile: string;
  bio: string;
}

function NavBar(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is not available");
  }
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount, notifications } = useNotifications();

  const {
    currUser,
    showModal,
    modalType,
    setModalType,
    setShowModal,
    logoutUser,
    setIsLoading,
  } = userContext;
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 1000);
    setHideTimeout(timeout);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logoutUser();
  };

  const handleNavigateToMessages = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/user/messages");
  };

  const handleNotificationClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchUsers = async (query: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/search`,
        {
          params: { query },
        }
      );
      setSearchResults(data);
    } catch (error) {
      console.error(axiosErrorManager(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
    setSearchResults([]);
  };

  return (
    <div className="fixed z-20 bg-[#121212] w-full h-[58px] flex justify-center items-center top-0 border-b border-b-[#ffffff18]">
      <div className="flex items-center w-full justify-between my-2 lg:my-0 px-4">
        <Link to="/">
          <img
            src={tiktokFullPng}
            className="w-28 hidden md:flex h-[32px]"
            alt=""
          />
        </Link>
        <Link to="/">
          <img src={tiktokIconPng} className="w-12 md:hidden h-[35px]" alt="" />
        </Link>
        <div className="flex relative flex-grow left-[10%] md:left-0 max-w-lg">
          <Input
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
            className="rounded-full h-[35px] me-10 md:me:0 sm:inline sm:h-[45px] text-[#c9c9c9] placeholder:text-[#c9c9c9] placeholder:text-[16px] font-medium bg-[#2e2e2e] w-[80%] lg:w-[90%] border-0"
          />
          <CiSearch
            size={30}
            className="text-[#757575] hidden md:inline p-1 absolute top-2 right-16"
          />
        </div>
        {currUser ? (
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/upload/video")}
              variant={"grays"}
              className="hidden md:flex"
            >
              <FaPlus /> Upload
            </Button>
            <button
              onClick={handleNavigateToMessages}
              className="p-2 hover:bg-[#2e2e2e] rounded-full"
            >
              <PiPaperPlaneTiltFill
                size={25}
                className="text-[#c9c9c9] cursor-pointer"
              />
            </button>
            <div className="relative">
              <div className="bg-red-600 absolute -top-1 -right-1 rounded-md px-1.5 min-w-[20px] h-[20px] flex justify-center items-center text-[11px] text-white">
                {unreadCount}
              </div>
              <button
                onClick={handleNotificationClick}
                className="p-2 hover:bg-[#2e2e2e] rounded-full"
              >
                <BiMessageMinus className="text-[#c9c9c9]" size={25} />
              </button>
            </div>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="w-[40px] h-[40px] flex items-center rounded-full overflow-hidden cursor-pointer"
            >
              <UserProfilePicture
                profile={currUser?.profile}
                className="object-cover w-8 h-8"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button
              className="bg-[#ff2b56] hover:bg-[#eb2e54] w-[100px] font-extrabold"
              onClick={() => {
                if (setModalType) setModalType("login");
                if (setShowModal) setShowModal(true);
              }}
            >
              Login
            </Button>
            <BsThreeDotsVertical size={20} className="text-white" />
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div
          className={
            currUser
              ? `absolute top-[55px] md:left-[31%] md:right-[45%] right-[35%] w-[50%] md:w-[33%] rounded-lg bg-[#222222] max-h-[300px] overflow-y-auto z-10`
              : `absolute top-[55px] md:left-[37.5%] md:right-[65%] right-[35%] w-[50%] md:w-[33%] rounded-lg bg-[#222222] max-h-[300px] overflow-y-auto z-10`
          }
        >
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="p-3 hover:bg-[#3a3a3a] cursor-pointer"
              onClick={() => handleUserClick(user.username)}
            >
              <div className="flex items-center">
                <UserProfilePicture
                  profile={user.profile}
                  className="w-10 h-10 rounded-full"
                />
                <p className="ml-3 text-white">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalType === "login" && showModal && <Login />}
      {modalType === "signup" && showModal && <Signup />}
      {showDropdown && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute top-[60px] right-3 bg-[#2e2e2e] w-[214px] h-[345px] rounded-md z-30"
        >
          <div
            className="flex flex-col items-start py-2"
            onClick={() => setShowDropdown(false)}
          >
            {[
              {
                Icon: BiUser,
                text: "View Profiles",
                to: `/profile/${currUser?.username}`,
              },
              { Icon: FaTiktok, text: "Get Coins", to: "/get-coins" },
              {
                Icon: LiaUserFriendsSolid,
                text: "Friends",
                to: "/friends",
              },
              { Icon: IoSettingsOutline, text: "Settings", to: "/settings" },
              { Icon: FaAdn, text: "Language", to: "/language" },
              { Icon: GoQuestion, text: "Help", to: "/help" },
              { Icon: MdOutlineDarkMode, text: "Dark Mode", to: "/dark-mode" },
            ].map(({ Icon, text, to }, index) => (
              <Link
                to={to}
                key={index}
                className="flex items-center w-full h-[40px] ps-3 hover:bg-[#3a3a3a] cursor-pointer"
              >
                <Icon size={20} className="text-white" />
                <p className="text-white ml-4 font-semibold">{text}</p>
              </Link>
            ))}
          </div>
          <hr className="opacity-30" />
          <button
            onClick={handleLogout}
            className="flex items-center w-full h-[40px] ps-3 hover:bg-[#3a3a3a] cursor-pointer"
          >
            <TbLogout2 size={20} className="text-white" />
            <p className="text-white ml-4 font-semibold">Log out</p>
          </button>
        </div>
      )}
      {showNotifications && (
        <NotificationShow
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

export default NavBar;
