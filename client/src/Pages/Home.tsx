import NavBar from "@/components/NavBar";
import VideoCard from "@/components/shared/VideoCard";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { Link } from "react-router-dom";



function HomePage(): JSX.Element {
const userContext = useContext(UserContext);
const posts = userContext?.posts || [];
  return (
    <div>
      <NavBar/>
    <div className="w-40 flex">
      <HomeSidebar />
      <div className="mt-20 ms-24">
        {posts.map((post: { _id: string; file: string }) => (
          <Link to={`/user/video/${post._id}`}><VideoCard key={post._id} file={post.file} /></Link>
        ))}
      </div>
    </div>
    </div>
  );
}

export default HomePage;
