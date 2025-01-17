import { MdOutlineExplore } from "react-icons/md";
import { RiHome4Line, RiUserReceived2Line } from "react-icons/ri";
import UserProfilePicture from "../shared/UserProfilePicture";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function MobileBottomBar(): JSX.Element {
const userContext = useContext(UserContext);
const { currUser } = userContext || {};
const navigate = useNavigate();
    return (
    <div>
      <div className="bg-[#121212] w-full h-16 flex justify-around items-center">
          <RiHome4Line onClick={()=>navigate("/")} size={32} />
          <MdOutlineExplore onClick={()=>(navigate("/explore"))} size={32} />
          <RiUserReceived2Line onClick={()=>navigate("/following")} size={32} />
          <div onClick={()=>navigate(`/profile/${currUser?.username}`)}>
          {currUser && (
              <UserProfilePicture 
                profile={currUser?.profile}
                className="object-cover w-10 h-10"
              />
          )}
          </div>
      </div>
    </div>
  );
}

export default MobileBottomBar;
