import React, { useContext, useState, useEffect, useCallback } from "react";

import { Leaf, Edit, Trash2, X, Save } from "lucide-react";
import { Toast } from "../../../components/common/Toast";
import { AuthContext } from "../../../context/AuthContext";

export default function MyTips() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser.email);
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [editingTipId, setEditingTipId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // State for CRUD operation feedback
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Energy Saving",
    "Waste Reduction",
    "Water Conservation",
    "Sustainable Food",
    "DIY & Upcycling",
    "Transportation",
    "Gardening & Nature",
  ];

  // --- Toast Logic ---
  const showToast = (message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage({ message: "", type: "" }), 5000);
  };

  // --- Fetching Logic ---
  const fetchMyTips = useCallback(async () => {
    if (!currentUser || !currentUser.email) return;

    setIsLoading(true);
    setFetchError("");
    const apiUrl = `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips/${
      currentUser.email
    }`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tips.");
      }
      const data = await response.json();
      setTips(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setFetchError("Could not load your tips. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetchMyTips();
    }
  }, [currentUser, fetchMyTips]);

  // --- Editing Handlers ---
  const handleEdit = (tip) => {
    setEditingTipId(tip._id);
    setEditFormData({
      title: tip.title,
      category: tip.category,
      content: tip.content,
    });
  };

  const handleCancelEdit = () => {
    setEditingTipId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Update (PUT) Logic ---
  const handleUpdate = async (tipId) => {
    setIsSaving(true);

    // Simple validation check before sending
    if (
      editFormData.title.length < 5 ||
      editFormData.content.length < 50 ||
      !editFormData.category
    ) {
      showToast("Please ensure all fields are valid.", "error");
      setIsSaving(false);
      return;
    }

    const apiUrl = `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips/${tipId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error during update." }));
        throw new Error(
          errorData.message || `Update failed with status: ${response.status}`
        );
      }

      // Update local state and show success message
      setTips(
        tips.map((tip) =>
          tip._id === tipId ? { ...tip, ...editFormData } : tip
        )
      );
      setEditingTipId(null);
      showToast("Tip updated successfully!", "success");
    } catch (error) {
      console.error("Update Error:", error);
      showToast(error.message || "Failed to update tip.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Delete (DELETE) Logic ---
  const handleDelete = async (tipId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tip? This cannot be undone."
      )
    ) {
      return;
    }

    const apiUrl = `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips/${tipId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error during deletion." }));
        throw new Error(
          errorData.message || `Deletion failed with status: ${response.status}`
        );
      }

      // Remove the tip from local state
      setTips(tips.filter((tip) => tip._id !== tipId));
      showToast("Tip deleted successfully!", "success");
    } catch (error) {
      console.error("Delete Error:", error);
      showToast(error.message || "Failed to delete tip.", "error");
    }
  };

  // --- Render Loading/Error/Empty States ---
  if (!currentUser.email) {
    return (
      <div className="text-center p-12 text-gray-600 bg-white shadow-xl rounded-xl max-w-lg mx-auto mt-10">
        <p className="text-xl font-semibold">
          Please log in to view and manage your tips.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-12 mt-10">
        <svg
          className="animate-spin h-8 w-8 text-green-600 mx-auto"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-gray-600 mt-3">Loading your shared wisdom...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 border border-red-300 rounded-xl max-w-lg mx-auto mt-10">
        <p className="font-semibold">Error:</p>
        <p>{fetchError}</p>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="text-center p-12 text-gray-600 bg-white shadow-xl rounded-xl max-w-lg mx-auto mt-10">
        <Leaf className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <p className="text-xl font-semibold">
          You haven't shared any tips yet.
        </p>
        <p className="text-gray-500 mt-2">Time to inspire the community!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 ">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
        <Leaf className="w-8 h-8 text-green-600 mr-3" />
        My Shared Tips ({tips.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip) => (
          <div
            key={tip._id}
            className="rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300 bg-white p-6  hover:shadow-xl    flex flex-col"
          >
            {editingTipId === tip._id ? (
              // --- EDITING VIEW ---
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(tip._id);
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full p-2 text-xl font-bold border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />

                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <textarea
                  name="content"
                  value={editFormData.content}
                  onChange={handleEditChange}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-700"
                />

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-2 cursor-pointer px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition duration-150 flex items-center gap-1"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-2 cursor-pointer px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-150 shadow-md flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        ...
                      </svg>
                    ) : (
                      <>
                        <Save size={18} /> Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // --- DISPLAY VIEW ---
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {tip.title}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(tip)}
                      className="p-2 cursor-pointer rounded-full text-green-600 hover:bg-green-50 transition duration-150"
                      title="Edit Tip"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tip._id)}
                      className="p-2 cursor-pointer rounded-full text-red-600 hover:bg-red-50 transition duration-150"
                      title="Delete Tip"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <span className="inline-block text-xs font-semibold text-green-800 bg-green-100 py-1 px-3 rounded-full mb-3">
                  {tip.category}
                </span>
                <p className="text-gray-700 flex-grow mb-4 whitespace-pre-wrap">
                  {tip.content}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                  <span className="font-medium">
                    <span className="text-green-600 font-bold">
                      {tip.upvotes || 0}
                    </span>{" "}
                    Upvotes
                  </span>
                  <span>
                    Shared: {new Date(tip.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* --- Toast Notifications --- */}
      <Toast
        message={toastMessage.message}
        type={toastMessage.type}
        onClose={() => setToastMessage({ message: "", type: "" })}
      />
    </div>
  );
}
