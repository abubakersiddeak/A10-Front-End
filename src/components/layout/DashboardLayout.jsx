import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Leaf,
  User,
  Target,
  Activity,
  PlusCircle,
  Heart,
  Settings,
  Brain,
} from "lucide-react";

// Import the component you previously created for the default view:
import { AuthContext } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

// --- SideBar Links Configuration ---
const dashboardLinks = [
  // {
  //   name: " Activities",
  //   icon: Activity,
  //   path: "/dashboard/myactivities",
  //   end: true,
  // },
  {
    name: "My Challenges",
    icon: Target,
    path: "/dashboard/myactivities",
    end: true,
  },
  {
    name: "My Tips",
    icon: Brain,
    path: "/dashboard/myactivities/mytips",
  },
  {
    name: "Add Tips",
    icon: PlusCircle,
    path: "/dashboard/myactivities/addtips",
  },
  {
    name: "Add Event",
    icon: PlusCircle,
    path: "/dashboard/myactivities/addevent",
  },
  {
    name: "Create Challenge",
    icon: PlusCircle,
    path: "/dashboard/myactivities/createchallenge",
  },
  {
    name: "Track Progress",
    icon: Activity,
    path: "/dashboard/myactivities/trackprogress",
  },
  {
    name: "My Contributions",
    icon: Heart,
    path: "/dashboard/myactivities/mycontributions",
  },

  {
    name: "Profile Settings",
    icon: User,
    path: "/dashboard/profile",
  },
];
export default function Dashboard() {
  const { dbUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to render NavLink with active styling
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-semibold text-gray-700 
     ${
       isActive
         ? "bg-green-100 text-green-700 shadow-sm border border-green-200"
         : "hover:bg-green-50 hover:text-green-600"
     }`;

  return (
    // Base layout wrapper with a soft, clean background
    <div className=" bg-green-50/70 ">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Header/Title Block */}
        <header className="mb-8 pb-4 border-b border-green-200">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Eco Hero Activities
            </h2>
          </div>
          <p className="text-gray-500 text-lg mt-1">
            Welcome,{" "}
            <span className="text-green-600 font-medium">
              {dbUser?.name || "Participant"}
            </span>
            . Manage your eco-missions here.
          </p>
        </header>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden w-full py-3 mb-6 bg-white border border-green-300 rounded-xl text-green-600 font-bold flex items-center justify-center gap-2 shadow-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Settings className="w-5 h-5" />
          {isMenuOpen ? "Hide Navigation" : "Show Navigation"}
        </button>

        {/* Main Grid: Sidebar + Content */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside
            className={`transition-all duration-300 ${
              isMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="rounded-3xl shadow-2xl border-l-8 border-t-8 border-green-500/80 transition-all duration-300 bg-white p-6  sticky top-20">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-green-100">
                Navigation
              </h3>
              <nav className="space-y-2">
                {dashboardLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={getNavLinkClass}
                    end={link.end} // Ensures exact matching for the root path
                    onClick={() => setIsMenuOpen(false)} // Close menu on link click
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA (The components load here) */}
          <main className="rounded-3xl shadow-2xl border-l-8 border-t-8 border-green-500/80 transition-all duration-300 bg-white p-6 sm:p-8  min-h-[60vh]">
            {/* The default view (MyChallengesList) will render at the root /my-activities route */}
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
