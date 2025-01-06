import HomeSidebar from "@/components/sidebars/HomeSideBar";

function HomePage(): JSX.Element {
  return (
    <div className="flex">
      <HomeSidebar />
      <div className="mt-20">
        <h1>Home Page</h1>
      </div>
    </div>
  );
}

export default HomePage;
