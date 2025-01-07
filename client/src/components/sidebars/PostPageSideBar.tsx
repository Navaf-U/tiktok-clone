import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { RiHome4Line } from "react-icons/ri";
import { IoIosMenu } from "react-icons/io";import { RiUserReceived2Line } from "react-icons/ri";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiLiveFill } from "react-icons/ri";
import { IoNavigateOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import logo from "../../assets/TiktokPostPageLogo.png";
import { Link } from "react-router-dom";
const PostPageSidebar = (): JSX.Element => {
  return (
    <SidebarProvider className="bg-white">
      <div className="fixed top-0 w-full border-b h-14 z-50 flex items-center border-b-gray-300 bg-white">
        <Link to='/'><img src={logo} alt="" className="w-48 h-11 ms-3" /></Link>
      </div>
      <Sidebar className="fixed top-[62px] text-black left-0 h-[0px]  transition-all w-16 lg:w-56">
      <Button variant={'pinks'} className="h-auto rounded-none p-3 mx-[12px] w-48 mt-2  focus:bg-[#ebebeb] focus:text-[gray] ">
        Upload
      </Button>
        <SidebarMenu className="">
          <SidebarMenuItem className=" border-t border-t-gray-300 flex gap-2 text-sm lg:p-4 h-12 mt-5 font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <RiHome4Line size={20} />
            
            <span className="hidden lg:inline">Home</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2  lg:p-4 h-12  font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <IoIosMenu size={20} />
            <span className="hidden lg:inline">Posts</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-sm lg:p-4 h-12 font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <RiUserReceived2Line size={20} />
            <span className="hidden lg:inline">Comments</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-sm lg:p-4 h-12 font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <LiaUserFriendsSolid size={20} />
            <span className="hidden lg:inline">Analytics</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-sm lg:p-4 h-12 font-medium  justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <RiLiveFill size={20} />
            <span className="hidden lg:inline">Inspirations</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-sm lg:p-4 h-12 font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <IoNavigateOutline size={20} />
            <span className="hidden lg:inline">Unlimited Sounds</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-sm lg:p-4 h-12 font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <IoNavigateOutline size={20} />
            <span className="hidden lg:inline">Creator Academy</span>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex gap-2 text-sm lg:p-4 h-12 font-medium justify-center items-center lg:justify-start cursor-pointer focus:bg-[#fff2f5] focus:text-[#ff3b5b]  w-[90%] rounded-md"  tabIndex={0}>
            <IoNavigateOutline size={20} />
            <span className="hidden lg:inline">Feedback</span>
          </SidebarMenuItem>
        </SidebarMenu>
        <hr className="opacity-30 mt-5" />
      </Sidebar>
    </SidebarProvider>
  );
};

export default PostPageSidebar;
