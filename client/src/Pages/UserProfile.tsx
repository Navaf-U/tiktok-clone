import { UserContext } from "@/context/UserProvider";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

// import HomeSidebar from "@/components/HomeSideBar";
import { Button } from "@/components/ui/button";
function UserProfile() : JSX.Element {
    const userContext = useContext(UserContext);
    const {currUser} = userContext || {};
    const {username} = useParams();
    console.log(username);
    console.log(currUser)
        const FetchUser = async (): Promise<void> => {
            try {
                const res = await axios.get(`http://localhost:3000/user/profile/${username}`);
                const data = res.data;
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
useEffect(() => {
    FetchUser();
}, [])
    return (
    <div className="">
        <h1>User Profile</h1>
        <div className="flex items ms-72 mt-16">
        <FaUserCircle  className=" h-[200px] w-[200px] text-white"/>
        <div>
        <h1 className="text-white text-2xl ms-5 mt-8 ">{username}</h1>
        <div className="flex">
        <Button variant={"pinks"} className="ms-4 mt-3 w-[115px] h-[40px]">Edit Profile</Button>
        <IoSettingsOutline className="ms-3 mt-3 w-[40px] p-2 h-[40px] bg-[#303030] rounded-md text-white"/>
        </div>
        </div>
        </div>
        {/* <HomeSidebar/> */}
    </div>
  )
}

export default UserProfile
