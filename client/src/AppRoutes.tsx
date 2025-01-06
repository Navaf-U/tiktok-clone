import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import NotFound from "./Pages/NotFound";
import UploadPage from "./Pages/UploadPage";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/upload/video" element={<UploadPage/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
