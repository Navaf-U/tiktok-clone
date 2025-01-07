import NavBar from "@/components/NavBar";
import HomeSidebar from "@/components/sidebars/HomeSideBar";


function HomePage(): JSX.Element {
  return (
    <div>
      <NavBar/>
    <div className="w-40 flex">
      <HomeSidebar />
      <div className="mt-20">
        <h1>Home Page</h1>
      </div>
    </div>
    </div>
  );
}

export default HomePage;
