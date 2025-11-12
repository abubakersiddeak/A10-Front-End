import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import {
  Zap,
  Clock,
  TrendingUp,
  Calendar,
  User,
  XCircle,
  ChevronRight,
  CheckCircle,
  Hourglass,
  Leaf,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

// Framer Motion variants for staggered entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MyChallenges() {
  const { dbUser } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserChallenges = async () => {
      if (!dbUser || !dbUser._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;

        const response = await fetch(
          `${backendDomain}/api/user-challenges/${dbUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await currentUser.getIdToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch your challenges. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error connecting to mission control. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserChallenges();
  }, []);

  // --- Helper to get status color and icon ---
  const getStatusVisuals = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "text-green-700 bg-green-100 border-green-300",
          icon: CheckCircle,
          label: "Completed",
        };
      case "active":
        return {
          color: "text-teal-700 bg-teal-100 border-teal-300",
          icon: TrendingUp,
          label: "Active",
        };
      case "paused":
        return {
          color: "text-yellow-700 bg-yellow-100 border-yellow-300",
          icon: Hourglass,
          label: "Paused",
        };
      default:
        return {
          color: "text-gray-500 bg-gray-100 border-gray-300",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-white text-center p-8 flex flex-col items-center justify-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Connection Error
        </h2>
        <p className="text-gray-600 text-lg">{error}</p>
      </div>
    );
  }

  // --- Empty State (Eco-themed) ---
  if (challenges.length === 0) {
    return (
      <div className="rounded-2xl bg-green-50 text-center p-8 pt-20">
        <div className="max-w-xl mx-auto border border-green-200 bg-white p-10 rounded-2xl shadow-xl">
          <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Zero Missions Active
          </h2>
          <p className="text-gray-600 text-lg">
            Your portfolio is clear! Explore the main challenge board to join a
            new eco-mission and start tracking your impact.
          </p>
        </div>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className=" bg-green-50 text-gray-800 rounded-2xl p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Block (Clean and light) */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-6 mb-8 border-b border-green-200"
        >
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              My Eco-Track
            </h2>
          </div>
        </motion.header>

        {/* Challenges List Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {challenges.map((userChallenge) => {
            const challenge = userChallenge.challenge;
            const {
              color: statusColor,
              icon: StatusIcon,
              label: statusLabel,
            } = getStatusVisuals(userChallenge.status);

            const progress = Math.min(
              100,
              Math.max(0, userChallenge.progress || 0)
            );

            return (
              <motion.div
                key={userChallenge._id}
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-2xl border-t-8 border-green-500/80 transition-all duration-300  p-6    
                           hover:shadow-xl hover:shadow-green-200/50 relative group"
              >
                {/* Challenge Title and Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-green-800 group-hover:text-green-600 transition-colors leading-snug">
                    {challenge?.title || "Unnamed Eco Challenge"}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${statusColor} border`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                  </div>
                </div>

                {/* Progress Bar (Softer Eco Look) */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Progress: {progress}%
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      // Gradient fill reflecting growth
                    />
                  </div>
                </div>

                {/* Details Grid (Clean and organized) */}
                <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600 border-t border-green-100 pt-4">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    Category:{" "}
                    <span className="font-semibold text-gray-800">
                      {challenge?.category || "General"}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    Duration:{" "}
                    <span className="font-semibold text-gray-800">
                      {challenge?.duration} days
                    </span>
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Joined:{" "}
                    <span className="font-semibold text-gray-800">
                      {new Date(userChallenge.joinDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Impact Metric (Placeholder based on previous challenge data) */}
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-500" />
                    Impact:{" "}
                    <span className="font-semibold text-gray-800">High</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="cursor-pointer mt-6 w-full flex items-center justify-center gap-2 text-green-700 border border-green-400 bg-green-50 py-2 rounded-xl 
                                   hover:bg-green-100 hover:border-green-600 transition-all duration-300 font-semibold"
                >
                  Mission Log & Data
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
