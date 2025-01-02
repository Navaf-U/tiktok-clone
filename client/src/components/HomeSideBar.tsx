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
        className="fixed top-[62px] left-0 h-full p-4 pt-8 bg-[#121212] text-white border-0  transition-all w-16 lg:w-60"
      >
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem className="flex gap-2 text-lg font-bold justify-center lg:justify-start">
            <RiHome4Line size={26} />
            <span className="hidden lg:inline">For You</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-lg font-bold justify-center lg:justify-start">
            <MdOutlineExplore size={26} />
            <span className="hidden lg:inline">Explore</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg font-bold justify-center lg:justify-start">
            <RiUserReceived2Line size={26} />
            <span className="hidden lg:inline">Following</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg font-bold justify-center lg:justify-start">
            <LiaUserFriendsSolid size={26} />
            <span className="hidden lg:inline">Friends</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg font-bold text-[#ff3b5b] justify-center lg:justify-start">
            <RiLiveFill size={26} className="text-[#ff3b5b]" />
            <span className="hidden lg:inline">LIVE</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg font-bold justify-center lg:justify-start">
            <IoNavigateOutline size={26} />
            <span className="hidden lg:inline">Messages</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg font-bold justify-center lg:justify-start pb-2">
            <FaRegUserCircle size={26} />
            <span className="hidden lg:inline">Profile</span>
          </SidebarMenuItem>

          <hr />
        </SidebarMenu>
      </Sidebar>
      <RiHome4Line size={26} />
    </SidebarProvider>
  );
};

export default HomeSidebar;
