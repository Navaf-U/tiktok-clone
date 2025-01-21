import NavBar from "@/components/NavBar"
import { IoSettingsOutline } from "react-icons/io5";
import { TiArrowLeft } from "react-icons/ti";
function Messages() : JSX.Element {
  return (
    <div className="h-screen">
      <div>
        <NavBar />
      </div>
      <div className="w-full pt-16 flex justify-center gap-4">
        <div>
            <TiArrowLeft className=" text-[#b5b5b5] bg-[#1c1c1c] rounded-full mt-3 p-1" size={35}/>
        </div>
        <div className="w-[300px] h-[500px] rounded-md bg-[#262626]">
            <div className="flex mx-5 mt-2 justify-between items-center">
            <p className="font-semibold text-[23px]">Messages</p>
            <IoSettingsOutline className="mt-1" size={25}/>
            </div>
        </div>
        <div className="w-[600px] h-[500px] rounded-md bg-[#262626]">
            ShowTEXT
        </div>
      </div>
    </div>
  )
}

export default Messages
