import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiMessageMinus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserProvider";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { TiHomeOutline } from "react-icons/ti";
import { BiUser } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaAdn } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { GoQuestion } from "react-icons/go";
import { MdOutlineDarkMode } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import tiktokFullPng from "../assets/tiktok-full-icon.png";
import tiktokIcon from "../assets/tiktok-icon.png";
import Login from "../modal/Login";
import Signup from "../modal/Singup";
import { Link } from "react-router-dom";

function NavBar(): JSX.Element {
  const userContext = useContext(UserContext);
  const { currUser, showModal, modalType, setModalType, setShowModal } =
    userContext || {};
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

  return (
    <div className="fixed z-20 bg-[#121212] w-full h-[62px] flex justify-center items-center top-0 border-b border-b-[#ffffff48]">
      <div className="flex items-center w-full justify-between my-2 lg:my-0 px-4">
        <Link to="/" ><img src={tiktokFullPng} className="w-32 h-[35px]" alt="" /></Link>
        <div className="flex relative flex-grow max-w-lg">
          <Input
            type="text"
            placeholder="Search"
            className="rounded-full hidden sm:inline h-[45px] text-[#c9c9c9] placeholder:text-[#c9c9c9] placeholder:text-[16px] font-medium bg-[#2e2e2e] w-full border-0"
          />
          <CiSearch
            size={33}
            className="text-[#757575] hidden md:inline p-1 border-s-[1px] border-s-[#757575] absolute top-2 right-6"
          />
        </div>
        {currUser ? (
          <div className="flex items-center space-x-4">
            <Button variant={"grays"} className="hidden md:flex" >
              <FaPlus /> Upload
            </Button>
            <BiMessageMinus className="text-[#c9c9c9]" size={30} />
            <Button
              variant={"grays"}
              className="bg-[#121212] hidden md:flex rounded-none border border-[#ffffff81]"
            >
              <img
                src={tiktokIcon}
                className="w-5 outline-1 hidden md:flex outline-white"
                alt=""
              />
              Get Coin
            </Button>
            <button>
              <FaRegUserCircle
                size={30}
                className="text-white"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </button>
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
      {modalType === "login" && showModal && <Login />}
      {modalType === "signup" && showModal && <Signup />}
      {showDropdown && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute top-[60px] right-3 bg-[#2e2e2e] w-[214px] h-[345px] rounded-md"
        >
          <div className="flex flex-col items-start py-2" onClick={()=>setShowDropdown(false)}>
            {[
              {
                Icon: BiUser,
                text: "View Profiles",
                to: `/profile/${currUser?.username}`,
              },
              { Icon: FaTiktok, text: "Get Coins", to: "/get-coins" },
              {
                Icon: TiHomeOutline,
                text: "Creator Tools",
                to: "/creator-tools",
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
          <button className="flex items-center justify-start ms-4 gap-3 font-semibold w-[90%] h-[40px] hover:bg-[#3a3a3a] cursor-pointer text-white">
            <TbLogout2 size={20} className="text-white" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default NavBar;
