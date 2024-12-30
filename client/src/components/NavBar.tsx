import tiktokFullPng from "../assets/tiktok-full-icon.png";
import tiktokIcon from "../assets/tiktok-icon.png"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiMessageMinus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "@/context/UserProvider";
import { BsThreeDotsVertical } from "react-icons/bs";
import Login from "../modal/Login";
function NavBar(): JSX.Element {
  const userContext = useContext(UserContext);
  const currUser = userContext ? userContext.currUser : null;
  const showLogin = userContext ? userContext.showLogin : false;
  const setShowLogin = userContext ? userContext.setShowLogin : () => {};
  const handleToggle = () => {
    setShowLogin(!showLogin);
  };
  return (
    <div className="position fixed z-20 bg-[#121212] w-full">
      <div className="flex items-center w-full justify-between my-2 my-lg-0">
            <img src={tiktokFullPng} className="ms-3 w-32 h-[35px]" alt="" />
            <Input
              type="text"
              placeholder="Search"
              className="rounded-full h-[45px] text-[#c9c9c9] placeholder:text-[#c9c9c9] placeholder:text-[16px] font-medium bg-[#2e2e2e] ms-2 w-[500px] border-0"
            />
            {currUser ? (<div className="flex w-[25%] justify-between items-center ms-2 me-4">
            <Button variant={"grays"}>
              <FaPlus /> Upload 
            </Button>
            <BiMessageMinus className="text-white" size={30} />
            <Button variant={'grays'} className="bg-[#121212] rounded-none border border-[#ffffff81]"> <img src={tiktokIcon} className="w-5 outline-1 outline-white" alt="" /> Get Coin</Button>
            <FaRegUserCircle size={30} className="text-white"/>
            </div>) : (
              <div className="flex justify-center items-center">
                <Button className="bg-[#ff2b56] hover:bg-[#eb2e54] me-5 w-[100px] font-extrabold" onClick={handleToggle}>
                Login
              </Button>
              <BsThreeDotsVertical size={20} className="text-white me-4"/>
              </div>
            )}
            </div>
            {showLogin && <Login />}
    </div>
  )
}

export default NavBar
