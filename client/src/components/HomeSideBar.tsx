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
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
const HomeSidebar = (): JSX.Element => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <SidebarProvider >
      <Sidebar
        className={`fixed top-[62px] left-0 h-full p-4 pt-8 bg-[#121212] text-white border-t-[1px] border-[#ffffff48] transition-all ${
          isSidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <RiHome4Line size={26} />
            {!isSidebarCollapsed && <span>For You</span>}
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <MdOutlineExplore size={26} />
            {!isSidebarCollapsed && <span>Explore</span>}
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <RiUserReceived2Line size={26} />
            {!isSidebarCollapsed && <span>Following</span>}
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LiaUserFriendsSolid size={26} />
            {!isSidebarCollapsed && <span>Friends</span>}
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold text-[#ff3b5b] ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <RiLiveFill size={26} className="text-[#ff3b5b]" />
            {!isSidebarCollapsed && <span>LIVE</span>}
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <IoNavigateOutline size={26} />
            {!isSidebarCollapsed && <span>Messages</span>}
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`flex gap-2 text-lg font-bold pb-2 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FaRegUserCircle size={26} />
            {!isSidebarCollapsed && <span>Profile</span>}
          </SidebarMenuItem>
          <hr />
        </SidebarMenu>
        <button
          className={`absolute top-1/2 right-[-20px] transform -translate-y-1/2 p-1 text-white  w-[20px] pt-8 border border-[#5c5c5cb7]  transition-all ${
            isSidebarCollapsed ? "rotate-180 rounded-s-xl" : "rounded-e-xl"
          }`}
          onClick={toggleSidebar}
        >
          <ChevronLeft className="mb-8 m-[-5px]" size={20}  />
        </button>
      </Sidebar>
    </SidebarProvider>
  );
};

export default HomeSidebar;
