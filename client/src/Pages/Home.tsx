import HomeSidebar from "@/components/HomeSideBar";
import NavBar from "@/components/NavBar";

function HomePage(): JSX.Element {
  return (
    <div>
      <NavBar/>
      <h1>Home Page</h1>
      <HomeSidebar/>
    </div>
  );
}

export default HomePage;
