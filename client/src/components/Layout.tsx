import Footer from "./Footer";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
