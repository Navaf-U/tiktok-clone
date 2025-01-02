import HomeSidebar from "@/components/HomeSideBar";

function HomePage(): JSX.Element {
  return (
    <div className="flex">
      <HomeSidebar />
      <div className="flex-1 p-4">
        <h1>Home Page</h1>
      </div>
    </div>
  );
}

export default HomePage;
