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
import tiktokFullPng from "../assets/tiktok-full-icon.png";
import tiktokIcon from "../assets/tiktok-icon.png";
import Login from "../modal/Login";
import Signup from "../modal/Singup";

function NavBar(): JSX.Element {
  const [showUserDropDown, setShowUserDropDown] = useState<boolean>(false);
  const userContext = useContext(UserContext);
  const { currUser, showModal, modalType, setModalType,setShowModal } = userContext || {};

  const handleUserDropDown : React.MouseEventHandler<HTMLButtonElement> = () => {
    setShowUserDropDown(!showUserDropDown);
  };

  return (
    <div className="position fixed z-20 bg-[#121212] w-full">
      <div className="flex items-center w-full justify-between my-2 my-lg-0">
        <img src={tiktokFullPng} className="ms-3 w-32 h-[35px]" alt="" />
        <div className="flex relative">
          <Input
            type="text"
            placeholder="Search"
            className="rounded-full h-[45px] text-[#c9c9c9] placeholder:text-[#c9c9c9] placeholder:text-[16px] font-medium bg-[#2e2e2e] ms-2 w-[500px] border-0"
          />
          <CiSearch
            size={33}
            className="text-[#757575] p-1 border-s-[1px] border-s-[#757575]  absolute top-2 right-6"
          />
        </div>
        {currUser ? (
          <div className="flex w-[25%] justify-between items-center ms-2 me-4">
            <Button variant={"grays"}>
              <FaPlus /> Upload
            </Button>
            <BiMessageMinus className="text-[#c9c9c9]" size={30} />
            <Button
              variant={"grays"}
              className="bg-[#121212] rounded-none border border-[#ffffff81]"
            >
              {" "}
              <img
                src={tiktokIcon}
                className="w-5 outline-1 outline-white"
                alt=""
              />{" "}
              Get Coin
            </Button>
            <button onClick={handleUserDropDown}><FaRegUserCircle size={30} className="text-white" /></button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Button
              className="bg-[#ff2b56] hover:bg-[#eb2e54] me-5 w-[100px] font-extrabold"
              onClick={() => {
                if (setModalType) setModalType("login"); // Set modal type to "signup"
                if (setShowModal) setShowModal(true); // Show the modal
              }}
            >
              Login
            </Button>
            <BsThreeDotsVertical size={20} className="text-white me-4" />
          </div>
        )}
      </div>
      {modalType === "login" && showModal && <Login />}
      {modalType === "signup" && showModal && <Signup />}
      {showUserDropDown && (
        <div className="absolute top-[60px] right-3 bg-[#2e2e2e] w-[200px] h-auto rounded-md">
          <div className="flex justify-center items-center flex-col">
          <div className="flex items-center text-start justify-center w-full h-[50px]">
            <BiUser size={30} className="text-white" />
            <p className="text-white ms-2 text-start">View Profiles</p>
          </div>
          <div className="flex items-center text-start justify-center w-full h-[50px]">
            <TiHomeOutline size={30} className="text-white" />
            <p className="text-white ms-2 text-start">Creator tools </p>
          </div>
          <div className="flex items-center text-start justify-center h-[50px]">
            <IoSettingsOutline size={30} className="text-white" />
            <p className="text-white ms-2 text-start"> Settings </p>
          </div>
          <div className="flex items-center text-start justify-center h-[50px]">
            <FaRegUserCircle size={30} className="text-white" />
            <p className="text-white ms-2 text-start  "> Log Out </p>
          </div>
          <div className="flex items-center text-start justify-center h-[50px]">
            <FaAdn size={30} className="text-white flex flex-row justify-center items-center" />
            <p className="text-white ms-2 text-start  "> Log Out </p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
