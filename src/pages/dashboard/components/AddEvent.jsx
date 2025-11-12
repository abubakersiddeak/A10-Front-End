import React, { useContext, useState } from "react";
import { Leaf, Save, X } from "lucide-react";
import { Toast } from "../../../components/common/Toast";
import { AuthContext } from "../../../context/AuthContext";

export default function AddEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxParticipants: "",
    currentParticipants: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const { currentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const token = await currentUser.getIdToken();
    e.preventDefault();
    setIsSuccess(false);
    setSubmissionError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            currentParticipants: 0,
          }),
        }
      );

      if (res.ok) {
        setIsSuccess(true);
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          organizer: "",
          maxParticipants: "",
        });
      } else {
        setSubmissionError("Failed to create event.");
      }
    } catch (err) {
      console.error(err);
      setSubmissionError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center  ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-2 mb-5">
          <Leaf className="text-green-600" size={28} />
          <h2 className="text-2xl font-semibold text-gray-700">
            Create New Event
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-bold"> Title</label>
          <input
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label className="font-bold"> Description</label>
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label className="font-bold"> Start Date</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label className="font-bold">Location</label>
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <label className="font-bold"> Max Participants</label>
          <input
            name="maxParticipants"
            placeholder="Max Participants"
            type="number"
            value={formData.maxParticipants}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="cursor-pointer flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
          >
            <Save size={18} />
            Create Event
          </button>
        </div>

        {isSuccess && (
          <Toast
            message=" Event created successfully!"
            type="success"
            onClose={() => setIsSuccess(false)}
          />
        )}

        {submissionError && (
          <Toast
            message={submissionError}
            type="error"
            onClose={() => setSubmissionError("")}
          />
        )}
      </form>
    </div>
  );
}
