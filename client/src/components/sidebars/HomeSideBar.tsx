import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { RiLiveLine } from "react-icons/ri";
import { RiHome4Line } from "react-icons/ri";
import { MdOutlineExplore } from "react-icons/md";
import { RiUserReceived2Line } from "react-icons/ri";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import UserProfilePicture from "../shared/UserProfilePicture";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const HomeSidebar = (): JSX.Element => {
  const userContext = useContext(UserContext);
  const { currUser } = userContext || {};
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <Sidebar className="fixed top-[62px] left-0 h-[0px] bg-[#121212] border-0 text-white  transition-all w-16 lg:w-56">
        <SidebarMenu className="">
          <SidebarMenuItem onClick={()=>navigate("/")} className="flex gap-2 text-md lg:p-4 h-12 mt-5 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <RiHome4Line size={22}  />
            <span className="hidden lg:inline">For You</span>
          </SidebarMenuItem>
          <SidebarMenuItem onClick={()=>navigate("/explore")}  className="flex gap-2 text-md lg:p-4 h-12  font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <MdOutlineExplore size={22} />
            <span className="hidden lg:inline">Explore</span>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={()=>navigate("/following")} className="flex gap-2 text-md lg:p-4 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <RiUserReceived2Line size={22} />
            <span className="hidden lg:inline">Following</span>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={()=>navigate("/friends")} className="flex gap-2 text-md lg:p-4 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <LiaUserFriendsSolid size={22} />
            <span className="hidden lg:inline">Friends</span>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex gap-2 text-md lg:p-4 h-12 font-bold  justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <RiLiveLine size={22} className="" />
            <span className="hidden lg:inline">LIVE</span>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={()=>navigate("/user/messages")} className="flex gap-2 text-md lg:p-4 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <PiPaperPlaneTiltBold size={22} />
            <span className="hidden lg:inline">Messages</span>
          </SidebarMenuItem>
          {currUser && (
            <SidebarMenuItem onClick={()=>navigate(`/profile/${currUser.username}`)} className="flex gap-2 text-md lg:p-4 h-12 font-bold justify-center items-center lg:justify-start cursor-pointer hover:bg-[#30303051]  w-[90%] rounded-md">
            <div className="w-[30px] h-[30px] flex items-center rounded-full overflow-hidden me-1">
              <UserProfilePicture
                profile={currUser?.profile}
                className="object-cover w-full h-full hidden lg:flex"
              />
            </div>
            <span className="hidden lg:inline">Profile</span>
          </SidebarMenuItem>
          )}
        </SidebarMenu>
        <hr className="opacity-30 mt-5 w-[70%] ms-2" />
      </Sidebar>
    </SidebarProvider>
  );
};

export default HomeSidebar;
