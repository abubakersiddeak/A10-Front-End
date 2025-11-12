import React, { useContext, useState, useEffect } from "react";
import { Leaf, Save, X } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { Toast } from "../../../components/common/Toast";

export default function AddTips() {
  const { currentUser, dbUser } = useContext(AuthContext);
  console.log(currentUser);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const categories = [
    "Energy Saving",
    "Waste Reduction",
    "Water Conservation",
    "Sustainable Food",
    "DIY & Upcycling",
    "Transportation",
    "Gardening & Nature",
  ];

  // --- Toast Auto-Dismissal Logic ---
  useEffect(() => {
    let timer;
    if (isSuccess || submissionError) {
      timer = setTimeout(() => {
        setIsSuccess(false);
        setSubmissionError("");
      }, 5000); // Auto-dismiss after 5 seconds
    }
    return () => clearTimeout(timer); // Cleanup function
  }, [isSuccess, submissionError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation and submission errors when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setIsSuccess(false);
    setSubmissionError("");
  };

  const validateForm = () => {
    let errors = {};
    let valid = true;

    if (!formData.title.trim() || formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters long.";
      valid = false;
    }
    if (!formData.category) {
      errors.category = "Please select a category.";
      valid = false;
    }
    if (!formData.content.trim() || formData.content.length < 50) {
      errors.content = "Tip content must be at least 50 characters long.";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const token = await currentUser.getIdToken();

    setIsSubmitting(true);
    setIsSuccess(false);
    setSubmissionError("");

    const tipPayload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      author: currentUser.email,
      authorName: currentUser.displayName,
      userDbId: dbUser._id,
      upvotes: 0,
      upvotedUsers: [],
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tipPayload),
        }
      );

      if (!response.ok) {
        // Attempt to parse a specific error message from the server response body
        const errorData = await response.json().catch(() => ({
          message: "Server responded with an unknown error.",
        }));
        throw new Error(
          errorData.message ||
            `Submission failed with status: ${response.status}`
        );
      }

      // const result = await response.json(); // Use this if the backend returns the saved tip object

      console.log("Tip submitted successfully:", tipPayload);

      setIsSuccess(true);
      // Reset form after successful submission
      setFormData({
        title: "",
        category: "",
        content: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      // Display a user-friendly error message
      setSubmissionError(
        error.message || "Network error. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Input Class based on validation state
  const inputClass = (name) =>
    `w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all duration-200 bg-white ${
      formErrors[name]
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-green-500"
    }`;

  const errorTextClass =
    "text-red-500 text-sm mt-1 font-medium flex items-center gap-1";

  return (
    // Mobile friendly container: Padded wrapper with full width, minimum viewport height
    <div className="flex items-center justify-center w-full ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300"
      >
        <div className="flex items-center justify-center mb-6">
          <Leaf className="w-10 h-10 text-green-600 mr-3" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-center">
            Share Your Eco-Tip
          </h2>
        </div>
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
          Help the community by sharing your best sustainable practices and
          hacks.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold mb-2"
            >
              Tip Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The 5-minute cold shower challenge"
              className={inputClass("title")}
            />
            {formErrors.title && (
              <p className={errorTextClass}>{formErrors.title}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-semibold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={
                inputClass("category") +
                (formData.category === "" ? " text-gray-500" : " text-gray-900")
              }
            >
              <option value="" disabled>
                Select a relevant category...
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-gray-900">
                  {cat}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className={errorTextClass}>{formErrors.category}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-gray-700 font-semibold mb-2"
            >
              The Tip (Detailed Explanation)
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              placeholder="Provide step-by-step instructions, benefits, and how others can implement this tip."
              className={inputClass("content")}
            />
            {formErrors.content && (
              <p className={errorTextClass}>{formErrors.content}</p>
            )}
          </div>
        </div>

        {/* Submit Button (Themed Green) */}
        <button
          type="submit"
          className="cursor-pointer w-full py-3 mt-10 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-400/50 hover:bg-green-700 transition duration-300 flex items-center justify-center gap-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            // Loading Spinner
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
              <Save size={20} /> Submit Tip
            </>
          )}
        </button>
      </form>

      {/* --- Toast Notifications --- */}
      {isSuccess && (
        <Toast
          message="Your tip has been shared with the community. Thank you!"
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
    </div>
  );
}
