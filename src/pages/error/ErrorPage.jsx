import { motion } from "framer-motion";
import { Leaf, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-green-100 to-green-300 text-gray-800">
      {/* Animated Leaf Icon */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6"
      >
        <Leaf className="w-20 h-20 text-green-600" />
      </motion.div>

      {/* Error Code */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-7xl font-bold text-green-700"
      >
        404
      </motion.h1>

      {/* Error Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-3 text-lg text-center max-w-md"
      >
        Oops! The page you’re looking for has gone missing 🌱 Maybe it’s been
        recycled or never existed.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8"
      >
        <button
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-md"
        >
          <Home className="w-5 h-5" />
          Go Back Home
        </button>
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 text-sm text-gray-600"
      >
        EcoTrack © {new Date().getFullYear()} — Sustainable Living for Everyone
        🌍
      </motion.p>
    </div>
  );
}
