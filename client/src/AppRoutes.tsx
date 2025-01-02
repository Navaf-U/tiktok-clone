import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/Home"
import UserProfile from "./Pages/UserProfile"
function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/profile/:username" element={<UserProfile/>} />
    </Routes>
  )
}

export default AppRoutes
