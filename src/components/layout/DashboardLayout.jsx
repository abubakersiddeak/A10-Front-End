import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Leaf,
  User,
  Target,
  PlusCircle,
  Settings,
  Brain,
  Menu, // Added for mobile menu toggle
  X, // Added for mobile menu close
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

// --- SideBar Links Configuration ---
const dashboardLinks = [
  {
    name: "Taken Challenges",
    icon: Target,
    path: "/dashboard/myactivities",
    end: true,
  },
  {
    name: " My Challenges",
    icon: Target,
    path: "/dashboard/myactivities/mycreateedchallenge",
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
    name: "Profile Settings",
    icon: User,
    path: "/dashboard/profile",
  },
];

export default function Dashboard() {
  const { dbUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 font-medium text-lg 
     ${
       isActive
         ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg transform translate-x-1"
         : "text-gray-600 hover:text-emerald-600 hover:bg-green-50/70"
     }`;

  return (
    // Base layout wrapper with a subtle background pattern for eco-futuristic feel
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 font-inter relative overflow-hidden">
      {/* Abstract background shapes for a futuristic, eco vibe */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-32 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-1 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header/Title Block - Enhanced for professional, eco-futuristic feel */}
        <header className="mb-10 md:px-0 px-4 pb-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Leaf className="w-10 h-10 text-emerald-500 animate-pulse-slow" />
            <h2 className="lg:text-5xl text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Your Dashboard
            </h2>
          </div>
          <p className="text-xl text-gray-600 mt-3 md:mt-0 md:text-right">
            Welcome,{" "}
            <span className="text-emerald-600 font-semibold">
              {dbUser?.name || "Eco-Pioneer"}
            </span>
            .<br /> Your hub for sustainable impact.
          </p>
        </header>

        {/* Mobile Menu Toggle - Styled for modern interaction */}
        <button
          className="lg:hidden w-full py-3 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-emerald-600 font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
          {isMenuOpen ? "Hide Navigation" : "Show Navigation"}
        </button>

        {/* Main Grid: Sidebar + Content */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-10">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside
            className={`transition-all duration-500 ease-in-out lg:translate-x-0 ${
              isMenuOpen
                ? "translate-x-0 block"
                : "-translate-x-full hidden lg:block"
            } absolute lg:relative inset-y-0 left-0 z-20 w-3/4 md:w-1/2 lg:w-full`} // Mobile overlay styling
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 sticky top-28 transform transition-all duration-300 hover:shadow-emerald-300/40">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                <Settings className="w-6 h-6 text-emerald-500" />
                Navigation Hub
              </h3>
              <nav className="space-y-3">
                {dashboardLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={getNavLinkClass}
                    end={link.end} // Ensures exact matching for the root path
                    onClick={() => setIsMenuOpen(false)} // Close menu on link click
                  >
                    <link.icon className="w-6 h-6" />
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA (The components load here) */}
          <main className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-2 lg:p-8 min-h-[70vh] transform transition-all duration-300 hover:shadow-blue-300/40">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
