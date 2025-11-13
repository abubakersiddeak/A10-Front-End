import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Leaf, PlusSquare, PlusCircle, Trash2 } from "lucide-react";

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

  const [steps, setSteps] = useState([{ title: "" }]); // 🆕 Steps array
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Handle Step Change
  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].title = value;
    setSteps(updatedSteps);
  };

  // ✅ Add New Step
  const addStep = () => {
    setSteps([...steps, { title: "" }]);
  };

  // ✅ Remove Step
  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  // ✅ Form Validation
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
    if (!formData.duration || Number(formData.duration) <= 0) {
      errors.duration = "Duration must be greater than 0 days";
      valid = false;
    }
    if (!formData.startDate.trim()) {
      errors.startDate = "Start Date is required";
      valid = false;
    }
    if (!formData.endDate.trim()) {
      errors.endDate = "End Date is required";
      valid = false;
    }
    if (steps.length === 0 || steps.some((s) => !s.title.trim())) {
      errors.steps = "Please add at least one valid step";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  //  Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formattedSteps = steps.map((s, index) => ({
      stepNumber: index + 1,
      title: s.title,
    }));

    const payload = {
      ...formData,
      duration: Number(formData.duration),
      steps: formattedSteps, // 🆕 include steps
      totalActions: formattedSteps.length, // auto set total actions
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

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();
      console.log(data);
      toast.success("🌱 Challenge Posted Successfully!", {
        position: "top-center",
      });

      // Reset Form
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
      setSteps([{ title: "" }]);
      setFormErrors({});
    } catch (error) {
      console.error("Error posting challenge:", error);
      toast.error(`❌ Failed to post: ${error.message}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error) =>
    `w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all duration-200 ${
      error
        ? "border-red-500 focus:ring-red-400 bg-red-50"
        : "border-gray-300 focus:ring-green-500 bg-white"
    }`;

  const errorTextClass = "text-red-500 text-sm mt-1 font-medium";

  return (
    <div className="flex items-center justify-center p-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-3xl shadow-2xl border-t-8 border-green-500/80 bg-white p-8 sm:p-10"
      >
        <div className="flex items-center justify-center mb-6">
          <PlusSquare className="w-10 h-10 text-green-600 mr-3" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Create New Challenge
          </h2>
        </div>
        <p className="text-center text-gray-500 mb-8">
          Define your sustainable challenge and inspire the community.
        </p>

        {/* --- Main Form --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["title", "Title", "e.g. Plastic-Free July"],
            ["duration", "Duration (days)", "e.g. 30", "number"],
            ["category", "Category", "e.g. Waste Reduction"],
            ["target", "Target", "e.g. Save 50L of water"],
            ["impactMetric", "Impact Metric", "e.g. kg CO2 saved"],
            ["startDate", "Start Date", "", "date"],
            ["endDate", "End Date", "", "date"],
            ["imageUrl", "Image URL", "https://example.com/banner.jpg"],
          ].map(([name, label, placeholder, type = "text"]) => (
            <div
              key={name}
              className={name === "imageUrl" ? "md:col-span-2" : ""}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={inputClass(formErrors[name])}
              />
              {formErrors[name] && (
                <p className={errorTextClass}>{formErrors[name]}</p>
              )}
            </div>
          ))}

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
              placeholder="Provide detailed instructions..."
              className={inputClass(formErrors.description)}
            />
            {formErrors.description && (
              <p className={errorTextClass}>{formErrors.description}</p>
            )}
          </div>
        </div>

        {/* --- 🆕 Steps Section --- */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-green-700 mb-3">
            Challenge Steps
          </h3>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                placeholder={`Step ${index + 1} description`}
                value={step.title}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={22} />
                </button>
              )}
            </div>
          ))}
          {formErrors.steps && (
            <p className={errorTextClass}>{formErrors.steps}</p>
          )}
          <button
            type="button"
            onClick={addStep}
            className="mt-2 flex items-center gap-2 text-green-600 font-semibold hover:text-green-800"
          >
            <PlusCircle size={20} /> Add Step
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="cursor-pointer w-full py-3 mt-10 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-400/50 hover:bg-green-700 transition duration-300 flex items-center justify-center gap-3"
          disabled={loading}
        >
          {loading ? (
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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
