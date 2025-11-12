import React, { useState, useEffect, use } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../context/AuthContext";

export default function Profile() {
  const { currentUser, ubdateUser, loading } = use(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setUpdating(true);

    try {
      await ubdateUser(currentUser, formData.name, formData.photoURL);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-wave flex justify-center items-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-3xl animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-36 h-36 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-custom-wave flex justify-center items-start p-4 md:p-8">
      <div className="rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300 bg-white  w-full max-w-3xl p-6 md:p-12 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:items-start flex-1">
          <div className="w-40 h-40 mb-6">
            <img
              src={formData.photoURL}
              alt={formData.name}
              className="w-full h-full rounded-full object-cover border-4 border-green-500/80"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {formData.name || "No Name"}
          </h1>
          <p className="text-gray-600 mb-1">Email: {formData.email}</p>
        </div>

        <div className="flex-1 bg-gray-50 p-6 rounded-2xl shadow-inner">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Update Profile
          </h2>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Profile Image URL
              </label>
              <input
                type="text"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full rounded-lg p-3 border border-gray-300 bg-gray-200 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`w-full cursor-pointer bg-green-500/95 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
