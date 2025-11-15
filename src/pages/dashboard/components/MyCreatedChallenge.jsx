import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion"; // ✅ FIXED (MOST IMPORTANT)

export default function MyCreateedChallenge() {
  const { currentUser } = useContext(AuthContext);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [editData, setEditData] = useState({ steps: [] });

  useEffect(() => {
    if (!currentUser) return;

    const fetchChallenges = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges`
        );
        const data = await res.json();

        const myCreated = data.filter(
          (c) =>
            c.createdBy === currentUser.email || c.email === currentUser.email
        );

        setMyChallenges(myCreated);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch your challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this challenge?"))
      return;

    try {
      const token = await currentUser.getIdToken();

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Deleted successfully!");
        setMyChallenges((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleEditClick = (challenge) => {
    setEditingChallenge(challenge._id);
    setEditData({
      ...challenge,
      steps: challenge.steps || [],
    });
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...editData.steps];
    updatedSteps[index].title = value;
    setEditData({ ...editData, steps: updatedSteps });
  };

  const handleAddStep = () => {
    setEditData({
      ...editData,
      steps: [
        ...editData.steps,
        { stepNumber: editData.steps.length + 1, title: "" },
      ],
    });
  };

  const handleRemoveStep = (index) => {
    const updated = [...editData.steps];
    updated.splice(index, 1);
    updated.forEach((s, i) => (s.stepNumber = i + 1));
    setEditData({ ...editData, steps: updated });
  };

  const handleSaveEdit = async () => {
    try {
      const token = await currentUser.getIdToken();

      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN
        }/api/challenges/${editingChallenge}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Updated successfully!");

        setMyChallenges((prev) =>
          prev.map((c) => (c._id === editingChallenge ? editData : c))
        );

        setEditingChallenge(null);
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating");
    }
  };

  // -----------------------------------------
  // LOADING SKELETON
  // -----------------------------------------
  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl shadow-xl border-t-8 border-green-500 p-5"
          >
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-10 bg-green-200 rounded w-24"></div>
              <div className="h-10 bg-red-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );

  // -----------------------------------------
  // NO CHALLENGES
  // -----------------------------------------
  if (!myChallenges.length)
    return (
      <div className="flex flex-col items-center justify-center mt-16 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-8 rounded-3xl shadow-md border border-green-200 max-w-md"
        >
          <Leaf className="w-14 h-14 text-green-600 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            No Challenges Yet!
          </h3>
          <p className="text-gray-600 mb-4">
            You haven’t created any challenges yet — start one and inspire
            others 🌱
          </p>
        </motion.div>
      </div>
    );

  // -----------------------------------------
  // MAIN RETURN
  // -----------------------------------------
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6 relative">
      <div className="flex flex-col gap-6 col-span-2 w-full">
        <header className="pb-8 mb-10 border-b border-green-200 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              My Created Challenges
            </h2>
          </div>
        </header>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {myChallenges.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-white rounded-3xl shadow-xl border-t-8 border-green-500 p-5 flex flex-col"
            >
              <img
                src={challenge.imageUrl}
                alt={challenge.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h2 className="text-xl font-semibold">{challenge.title}</h2>

              <p className="text-gray-600 text-sm mb-1">
                <strong>Category:</strong> {challenge.category}
              </p>

              <p className="text-gray-600 text-sm mb-1">
                <strong>Target:</strong> {challenge.target}
              </p>

              <p className="text-gray-600 text-sm mb-1">
                <strong>Total Actions:</strong>{" "}
                {challenge.totalActions || editData.steps?.length}
              </p>

              <p className="text-gray-600 text-sm mb-1">
                <strong>Duration:</strong> {challenge.duration} days
              </p>

              <p className="text-gray-600 text-sm mb-1">
                <strong>Start Date:</strong> {challenge.startDate}
              </p>

              <p className="text-gray-600 text-sm mb-1">
                <strong>End Date:</strong> {challenge.endDate}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditClick(challenge)}
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(challenge._id)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------
          Edit Modal
      ------------------------- */}
      {editingChallenge && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90%] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Edit Challenge</h2>

            {/* FORM */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Title</label>
              <input
                type="text"
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="font-semibold">Description</label>
              <textarea
                rows={3}
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="font-semibold">Category</label>
              <input
                type="text"
                value={editData.category || ""}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="font-semibold">Image URL</label>
              <input
                type="text"
                value={editData.imageUrl || ""}
                onChange={(e) =>
                  setEditData({ ...editData, imageUrl: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="font-semibold">Target</label>
              <input
                type="text"
                value={editData.target || ""}
                onChange={(e) =>
                  setEditData({ ...editData, target: e.target.value })
                }
                className="border p-2 rounded"
              />

              {/* STEPS */}
              <label className="font-semibold mt-3">Steps</label>

              {editData.steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                  />

                  <button
                    onClick={() => handleRemoveStep(idx)}
                    className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddStep}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
              >
                Add Step
              </button>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingChallenge(null)}
                className="bg-gray-400 cursor-pointer hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
