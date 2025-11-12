import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import {
  Clock,
  TrendingUp,
  Calendar,
  XCircle,
  ChevronRight,
  CheckCircle,
  Hourglass,
  Leaf,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MyChallenges() {
  const { dbUser, currentUser } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Fetch user's joined challenges
  useEffect(() => {
    const fetchUserChallenges = async () => {
      if (!dbUser?._id) return setLoading(false);

      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user-challenges/${
            dbUser._id
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await currentUser.getIdToken()}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`Failed to fetch challenges (${response.status})`);

        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching your challenges. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserChallenges();
  }, [dbUser, currentUser]);

  //  Handle Finish Challenge
  const handleFinishChallenge = async (challengeId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/finish-challenge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: dbUser._id,
            email: currentUser.email,
            challengeId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(" Challenge marked as completed!");
        setChallenges((prev) =>
          prev.map((c) =>
            c.challenge._id === challengeId ? { ...c, status: "completed" } : c
          )
        );
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Error finishing challenge:", err);
      alert("⚠️ Failed to finish challenge.");
    }
  };

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );

  if (challenges.length === 0)
    return (
      <div className="rounded-2xl bg-green-50 text-center p-8 pt-20">
        <div className="max-w-xl mx-auto border border-green-200 bg-white p-10 rounded-2xl shadow-xl">
          <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Zero Missions Active
          </h2>
          <p className="text-gray-600 text-lg">
            Start your first eco challenge and make an impact today!
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-green-50 text-gray-800 rounded-2xl p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
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
                className="bg-white rounded-3xl shadow-lg border-t-8 border-green-500 p-6 hover:shadow-green-200/60 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-green-800">
                    {challenge?.title || "Unnamed Challenge"}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${statusColor} border`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Progress: {progress}%
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <motion.div
                      className="h-2 bg-green-600 rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600 border-t border-green-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    Category:{" "}
                    <span className="font-semibold text-gray-800">
                      {challenge?.category || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    Duration:{" "}
                    <span className="font-semibold text-gray-800">
                      {challenge?.duration} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Joined:{" "}
                    <span className="font-semibold text-gray-800">
                      {new Date(userChallenge.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-500" />
                    Impact:{" "}
                    <span className="font-semibold text-gray-800">High</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-2">
                  <button
                    className="w-full flex items-center justify-center gap-2 text-green-700 border border-green-400 bg-green-50 py-2 rounded-xl 
                                   hover:bg-green-100 transition-all duration-300 font-semibold"
                  >
                    Mission Log & Data
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* ✅ Finish Button */}
                  {userChallenge.status !== "completed" && (
                    <button
                      onClick={() => handleFinishChallenge(challenge._id)}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 text-white bg-green-600 py-2 rounded-xl 
                                 hover:bg-green-700 transition-all duration-300 font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Finish Challenge
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
