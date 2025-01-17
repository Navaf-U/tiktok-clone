import NavBar from "@/components/NavBar";
import VideoCard from "@/components/shared/VideoCard";
import HomeSidebar from "@/components/sidebars/HomeSideBar";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { Link } from "react-router-dom";

function ExplorePage(): JSX.Element {
  const userContext = useContext(UserContext);
  const posts = userContext?.posts || [];

  return (
    <div>
      <NavBar />
      <div className="flex">
        <div className="w-1/5  hidden md:block">
          <HomeSidebar />
        </div>
        <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
          <MobileBottomBar/>
        </div>
        <div className="flex-grow mt-20 ms-8 pt-4">
          <div className="flex flex-wrap gap-6 justify-start">
            {posts.map((post: { _id: string; file: string }) => (
              <Link to={`/user/video/${post._id}`} key={post._id}>
                <VideoCard file={post.file} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
