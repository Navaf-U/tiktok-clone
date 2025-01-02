import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { RiHome4Line } from "react-icons/ri";
import { MdOutlineExplore } from "react-icons/md";
import { RiUserReceived2Line } from "react-icons/ri";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiLiveFill } from "react-icons/ri";
import { IoNavigateOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";

const HomeSidebar = (): JSX.Element => {
  return (
    <SidebarProvider>
      <Sidebar
        className="fixed top-[62px] left-0 h-[0px] bg-[#121212] border-0 text-white  transition-all w-16 lg:w-60"
      >
        <SidebarMenu className="">
          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 mt-5 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <RiHome4Line size={26} />
            <span className="hidden lg:inline">For You</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12  font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <MdOutlineExplore size={26} />
            <span className="hidden lg:inline">Explore</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6  h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <RiUserReceived2Line size={26} />
            <span className="hidden lg:inline">Following</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <LiaUserFriendsSolid size={26} />
            <span className="hidden lg:inline">Friends</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold text-[#ff3b5b] justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <RiLiveFill size={26} className="text-[#ff3b5b]" />
            <span className="hidden lg:inline">LIVE</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <IoNavigateOutline size={26} />
            <span className="hidden lg:inline">Messages</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <FaRegUserCircle size={26} />
            <span className="hidden lg:inline">Profile</span>
          </SidebarMenuItem>
        </SidebarMenu>
        <hr className="opacity-30 mt-5"/>
      </Sidebar>
    </SidebarProvider>
  );
};

export default HomeSidebar;
