import { UserContext } from "@/context/UserProvider";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    <div>
      <h1>hiii</h1>
    </div>
  )
}

export default UserProfile
