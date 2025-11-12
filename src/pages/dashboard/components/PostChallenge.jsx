import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Leaf, PlusSquare } from "lucide-react"; // Added icons

const PostChallenge = () => {
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    createdBy: currentUser?.email || "",
    target: "",
    totalActions: "",
    participants: 0,
    impactMetric: "",
    duration: "",
    startDate: "",
    endDate: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // Added loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let errors = {};
    let valid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      valid = false;
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
      valid = false;
    }
    // Updated Image URL validation message and color theme
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = "Image URL is required";
      valid = false;
    } else if (!/^https?:\/\/\S+$/i.test(formData.imageUrl)) {
      errors.imageUrl = "Please enter a valid image URL (jpg, png, gif)";
      valid = false;
    }
    if (!formData.category.trim()) {
      errors.category = "Category is required";
      valid = false;
    }
    if (!formData.target.trim()) {
      errors.target = "Target is required";
      valid = false;
    }
    if (!formData.impactMetric.trim()) {
      errors.impactMetric = "Impact Metric is required";
      valid = false;
    }
    // Duration check
    if (!formData.duration || Number(formData.duration) <= 0) {
      errors.duration = "Duration must be greater than 0 days";
      valid = false;
    }
    if (!formData.startDate.trim()) {
      errors.startDate = "Start Date is required";
      valid = false;
    } else if (new Date(formData.startDate) < new Date()) {
      errors.startDate = "Start Date cannot be in the past";
      valid = false;
    }
    if (!formData.endDate.trim()) {
      errors.endDate = "End Date is required";
      valid = false;
    } else if (new Date(formData.endDate) <= new Date()) {
      errors.endDate = "End Date must be in the future";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Prepare payload, converting duration to number
    const payload = {
      ...formData,
      duration: Number(formData.duration),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // Check if response is okay (2xx status)
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Server Response:", data);

      // Successfully posted
      toast.success("🌱 Challenge Posted Successfully! Go check it out.", {
        position: "top-center",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        category: "",
        createdBy: currentUser?.email || "",
        target: "",
        totalActions: "",
        participants: 0,
        impactMetric: "",
        duration: "",
        startDate: "",
        endDate: "",
      });

      setFormErrors({});
    } catch (error) {
      console.error("Error posting challenge:", error);
      toast.error(
        ` Failed to post challenge. Error: ${
          error.message || "Network issue."
        }`,
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  // --- THEMED UI ---
  const inputClass = (error) =>
    `w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all duration-200 ${
      error
        ? "border-red-500 focus:ring-red-400 focus:border-red-400 bg-red-50"
        : "border-gray-300 focus:ring-green-500 focus:border-green-500 bg-white"
    }`;

  const errorTextClass = "text-red-500 text-sm mt-1 font-medium";

  return (
    <div className="flex items-center justify-center p-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300 bg-white p-8 sm:p-10 "
      >
        <div className="flex items-center justify-center mb-6">
          <PlusSquare className="w-10 h-10 text-green-600 mr-3" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Initiate New Mission
          </h2>
        </div>
        <p className="text-center text-gray-500 mb-8">
          Define your sustainable challenge and inspire the community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Plastic-Free July"
              className={inputClass(formErrors.title)}
            />
            {formErrors.title && (
              <p className={errorTextClass}>{formErrors.title}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 30"
              className={inputClass(formErrors.duration)}
            />
            {formErrors.duration && (
              <p className={errorTextClass}>{formErrors.duration}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Waste Reduction, Energy Conservation"
              className={inputClass(formErrors.category)}
            />
            {formErrors.category && (
              <p className={errorTextClass}>{formErrors.category}</p>
            )}
          </div>

          {/* Target */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Target
            </label>
            <input
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g. Complete a 50km bicycle ride"
              className={inputClass(formErrors.target)}
            />
            {formErrors.target && (
              <p className={errorTextClass}>{formErrors.target}</p>
            )}
          </div>
          {/* total action */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Total Actions
            </label>
            <input
              name="totalActions"
              value={formData.totalActions}
              onChange={handleChange}
              placeholder="0"
              className={inputClass(formErrors.target)}
            />
            {formErrors.target && (
              <p className={errorTextClass}>{formErrors.target}</p>
            )}
          </div>

          {/* Impact Metric */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Impact Metric (Unit)
            </label>
            <input
              name="impactMetric"
              value={formData.impactMetric}
              onChange={handleChange}
              placeholder="e.g. kg CO2 avoided, Liters water saved"
              className={inputClass(formErrors.impactMetric)}
            />
            {formErrors.impactMetric && (
              <p className={errorTextClass}>{formErrors.impactMetric}</p>
            )}
          </div>
          {/* Start Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClass(formErrors.startDate)}
            />
            {formErrors.startDate && (
              <p className={errorTextClass}>{formErrors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClass(formErrors.endDate)}
            />
            {formErrors.endDate && (
              <p className={errorTextClass}>{formErrors.endDate}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/challenge-banner.jpg"
              className={inputClass(formErrors.imageUrl)}
            />
            {formErrors.imageUrl && (
              <p className={errorTextClass}>{formErrors.imageUrl}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Provide detailed instructions and why this challenge is important."
              className={inputClass(formErrors.description)}
            />
            {formErrors.description && (
              <p className={errorTextClass}>{formErrors.description}</p>
            )}
          </div>
        </div>

        {/* Submit Button (Themed Green) */}
        <button
          type="submit"
          className="cursor-pointer w-full py-3 mt-10 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-400/50 hover:bg-green-700 transition duration-300 flex items-center justify-center gap-3"
          disabled={loading} // Disabled while loading
        >
          {loading ? (
            // Reusing the nice loading spinner logic
            <svg
              className="animate-spin h-5 w-5 text-white"
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
          ) : (
            <>
              <Leaf size={20} /> Create Challenge
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PostChallenge;
