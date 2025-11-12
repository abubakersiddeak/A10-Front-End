import { Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function PublicLayout() {
  return (
    <div className="flex  mx-auto flex-col min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
