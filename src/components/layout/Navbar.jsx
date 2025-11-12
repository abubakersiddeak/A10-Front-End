import React, { use, useState } from "react";
import { Menu, LogIn, LogOut, UserPlus, Leaf } from "lucide-react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const { currentUser, signout } = use(AuthContext);

  // Helper function for themed link styling
  const getNavLinkClass = ({ isActive }) =>
    `font-semibold p-2 rounded-lg transition-colors duration-200 
     ${
       isActive
         ? // Active link style: Green background/text
           "text-green-700 bg-green-100 shadow-sm"
         : // Inactive link style: Gray text, green hover
           "text-gray-600 hover:text-green-600 hover:bg-green-50"
     }`;

  const links = (
    <>
      <NavLink className={getNavLinkClass} to="/">
        Home{" "}
      </NavLink>

      <NavLink className={getNavLinkClass} to="/challenge">
        Challenges{" "}
      </NavLink>
      {currentUser ? (
        <NavLink
          className={getNavLinkClass}
          to="/dashboard/myactivities"
          end={false}
        >
          My Activities{" "}
        </NavLink>
      ) : null}
    </>
  );

  const handleLogout = () => {
    try {
      signout();
    } catch (error) {
      console.log(error);
    }
  };

  // Themed Button Styles (Green accents)
  const primaryButtonClass =
    "px-4 py-2 text-sm cursor-pointer font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition duration-300 shadow-md shadow-green-400/50";
  const secondaryButtonClass =
    "px-4 py-2 text-sm font-bold cursor-pointer text-green-600 border-2 border-green-600 hover:bg-green-50 rounded-xl transition duration-300";

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and EcoTrack Text (Themed Green) */}
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-extrabold tracking-wider flex items-center cursor-pointer p-1 rounded-lg"
          >
            <Leaf className="w-7 h-7 text-green-600 mr-2" />
            <span className="text-gray-900 font-extrabold">Eco</span>
            <span className="text-green-600 font-normal">Track</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:space-x-4 items-center">
            {links}
          </div>

          {/* Desktop Auth/User Actions (Themed) */}
          <div className="hidden md:flex md:space-x-3 items-center">
            <div className="ml-6 flex items-center space-x-3">
              {currentUser ? (
                <>
                  {/* Profile Dropdown/Avatar (Themed Border/Hover) */}
                  <button
                    onClick={() => {
                      navigate("/dashboard/profile"); // **Kept original link**
                    }}
                    className="relative"
                    onMouseEnter={() => setIsProfileHovered(true)}
                    onMouseLeave={() => setIsProfileHovered(false)}
                  >
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-green-500 hover:border-green-700 cursor-pointer transition transform hover:scale-105" // Themed border
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                    />
                    {isProfileHovered && (
                      <div className="absolute top-full mt-2 right-0 bg-white p-3 rounded-xl shadow-2xl border border-green-100 z-50 whitespace-nowrap">
                        {" "}
                        {/* Themed shadow/border */}
                        <p className="text-sm font-semibold text-gray-900">
                          {currentUser.displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentUser.email}
                        </p>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    // Simple logout button styling
                    className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition duration-150 hover:bg-gray-200 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                // Login/Register Buttons (Themed)
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className={secondaryButtonClass}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")} // **Kept original link: /signup**
                    className={primaryButtonClass}
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500" // Themed focus ring
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Themed) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-green-100 py-4 bg-white shadow-xl">
          <div className="px-4 pt-2 pb-3 space-y-2 sm:px-3 flex flex-col">
            {/* Mobile Nav Links: Re-rendered to inherit themed class */}
            {links}
          </div>

          <div className="pt-4 pb-3 border-t border-green-100">
            {currentUser ? (
              <div className="flex items-center px-5">
                <div className="flex shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover border-2 border-green-500" // Themed border
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                  />
                </div>
                <div className="ml-3 truncate">
                  <div className="text-base font-medium text-gray-900 truncate">
                    {currentUser.displayName}
                  </div>
                  <div className="text-sm font-medium text-gray-500 truncate">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto flex items-center space-x-1.5 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-full transition duration-150 hover:bg-green-700" // Themed button
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-3 px-5">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className={`${secondaryButtonClass} flex-1 flex items-center justify-center`}
                >
                  <LogIn className="w-4 h-4 inline-block mr-1" /> Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsMenuOpen(false);
                  }}
                  className={`${primaryButtonClass} cursor-pointer flex-1 flex items-center justify-center`}
                >
                  <UserPlus className="w-4 h-4 inline-block mr-1" /> Signup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
