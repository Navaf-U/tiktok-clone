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

const PostPageSidebar = (): JSX.Element => {
  return (
    <SidebarProvider>
      <Sidebar className="fixed top-[62px] left-0 h-[0px] bg-[#121212] border-0 text-white  transition-all w-16 lg:w-60">
        <SidebarMenu className="">
          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 mt-5 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <RiHome4Line size={26} />
            <span className="hidden lg:inline">Home</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12  font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <MdOutlineExplore size={26} />
            <span className="hidden lg:inline">Posts</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6  h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <RiUserReceived2Line size={26} />
            <span className="hidden lg:inline">Comments</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <LiaUserFriendsSolid size={26} />
            <span className="hidden lg:inline">Analytics</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold text-[#ff3b5b] justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <RiLiveFill size={26} className="text-[#ff3b5b]" />
            <span className="hidden lg:inline">Inspirations</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <IoNavigateOutline size={26} />
            <span className="hidden lg:inline">Unlimited Sounds</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <IoNavigateOutline size={26} />
            <span className="hidden lg:inline">Creator Academy</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-lg p-6 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#303030]  w-[90%] rounded-md">
            <IoNavigateOutline size={26} />
            <span className="hidden lg:inline">Feedback</span>
          </SidebarMenuItem>
        </SidebarMenu>
        <hr className="opacity-30 mt-5" />
      </Sidebar>
    </SidebarProvider>
  );
};

export default PostPageSidebar;
