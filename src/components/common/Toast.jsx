import { CheckCircle, X } from "lucide-react";
export const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  const styleMap = {
    success: "bg-green-600 border-green-800",
    error: "bg-red-600 border-red-800",
  };

  // Icon mapping using lucide-react (or simplified SVG for error)
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-white" />,
    error: (
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-100 p-4 pl-6 rounded-xl text-white shadow-2xl transition-all duration-500 ease-out transform translate-x-0 ${styleMap[type]} flex items-center gap-3 border-l-4`}
      style={{ minWidth: "250px" }}
    >
      {iconMap[type]}
      <div className="flex flex-col">
        <span className="font-bold">
          {type === "success" ? "Success" : "Error"}
        </span>
        <span className="text-sm">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 p-1 text-white/80 hover:text-white rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
