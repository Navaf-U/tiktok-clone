import tiktokFullPng from "../assets/tiktok-full-icon.png";
import tiktokIcon from "../assets/tiktok-icon.png"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiMessageMinus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

function NavBar(): JSX.Element {
  return (
    <div className="position fixed z-20 bg-[#121212] w-full">
      <div className="flex items-center w-full justify-between my-2 my-lg-0">
            <img src={tiktokFullPng} className="ms-3 w-32 h-[35px]" alt="" />
            <Input
              type="text"
              placeholder="Search"
              className="rounded-full h-[45px] text-[#c9c9c9] placeholder:text-[#c9c9c9] placeholder:text-[16px] font-medium bg-[#2e2e2e] ms-2 w-[500px] border-0"
            />
            <div className="flex w-[25%] justify-between items-center ms-2 me-4">
            <Button variant={"grays"}>
              <FaPlus /> Upload 
            </Button>
            <BiMessageMinus className="text-white" size={30} />
            <Button variant={'grays'} className="bg-[#121212] rounded-none border border-[#ffffff81]"> <img src={tiktokIcon} className="w-5 outline-1 outline-white" alt="" /> Get Coin</Button>
            <FaRegUserCircle size={30} className="text-white"/>
            </div>
            </div>
    </div>
  )
}

export default NavBar
