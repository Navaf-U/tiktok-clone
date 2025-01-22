import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import UploadPage from "./Pages/UploadPage";
import SingleVideoPage from "./Pages/SingleVideoPage";
import ExplorePage from "./Pages/ExplorePage";
import FollowingUsersVideo from "./Pages/FollowingUsersVideo";
import FriendsPage from "./Pages/FriendsPage";
import Messages from "./Pages/Messages";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/upload/video" element={<UploadPage/>} />
        <Route path="/user/video/:id" element={<SingleVideoPage/>} />
        <Route path="/following" element={<FollowingUsersVideo />} />
        <Route path="/friends" element={<FriendsPage/>} />
        <Route path="/user/messages/" element={<Messages/>}/>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
