import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import NavBar from "./components/NavBar";
import NotFound from "./Pages/NotFound";

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/profile/:username"
          element={
              <UserProfile />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
        
    </>
  );
}

export default AppRoutes;
