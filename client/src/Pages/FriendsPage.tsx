import NavBar from "@/components/NavBar";
import UserProfilePicture from "@/components/shared/UserProfilePicture";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserProvider"
import axiosInstance from "@/utilities/axiosInstance"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    email: string;
    username: string;
    profile: string;
    bio: string;
    role: string;
}

function FriendsPage() :JSX.Element{
    const [page,setPage] = useState(1)
    const [users,setUsers] = useState<User[]>([])
    const userContext = useContext(UserContext)
    const {currUser} = userContext || {}
    const navigate = useNavigate()
    useEffect(()=>{
        const getNonFollowedUsers = async ()=>{
            try{
                const {data} = await axiosInstance.get(`/user/following/non-user-profiles`,{
                    params:{page,limit:10}
                })
                console.log(data)
                setUsers(data)
            }catch(err){
                console.log(err)
            }
        }
        getNonFollowedUsers()
    },[])
    

    return (
    <div className="h-screen overflow-hidden">
        <div>
        <NavBar />
        </div>
      <div className="ms-8 md:ms-0 mt-20 md:mb-6  w-full mb-28 pb-28">
        {currUser && (
            <div className="flex flex-grow flex-wrap md:ms-48 gap-8 md:ps-6">
                {users.map((user) => (
                <div key={user._id} className="bg-white flex justify-center items-center h-52 w-40 rounded-lg shadow-md cursor-pointer">
                    <div className="flex flex-col items-center">
                    <div onClick={()=>navigate(`/profile/${user.username}`)}>
                    <UserProfilePicture profile={user.profile} className="w-16 h-16" />
                        <h2 className="text-lg font-semibold text-red-500 text-center">{user.username}</h2>
                    </div>
                    <div className="mt-5">
                        <Button variant={'pinks'} className="w-32">Follow</Button>                        
                    </div>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>
      <div className="w-1/5 hidden md:block">
          <HomeSidebar />
        </div>      
        <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
          <MobileBottomBar/>
        </div>
    </div>
  )
}

export default FriendsPage
