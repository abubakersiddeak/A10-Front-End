import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import {
  Clock,
  TrendingUp,
  Calendar,
  XCircle,
  CheckCircle,
  Hourglass,
  Leaf,
  Target,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
  const navigate = useNavigate();

  // Fetch user's joined challenges
  useEffect(() => {
    const fetchUserChallenges = async () => {
      // If user is not authenticated yet, wait.
      if (!currentUser) return;

      // If user is authenticated but dbUser is missing (still loading or first sign-in), wait.
      if (!dbUser?._id) return setLoading(false);

      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user-challenges/${
            dbUser._id
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error(`Failed to fetch challenges`);
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

  // Handle step completion
  const handleStepComplete = async (uc, stepIndex) => {
    if (!currentUser) {
      toast.error("Please log in to update your progress.");
      return;
    }
    // Prevent re-toggling completed steps for simplicity, or modify logic if un-completing is allowed
    if (uc.completedSteps?.includes(stepIndex)) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user-challenges/${
          uc._id
        }/complete-step`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ stepId: stepIndex }),
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Failed to update progress on the server."
        );
      }

      toast.success("Progress updated successfully!");

      setChallenges((prev) =>
        prev.map((c) =>
          c._id === uc._id ? { ...responseData, challenge: c.challenge } : c
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update progress.");
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
      <div className="min-h-screen flex flex-col items-center justify-start  py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[1, 2].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="bg-white rounded-3xl shadow-xl border-t-8 border-green-500 overflow-hidden animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="w-full h-40 md:h-48 bg-green-200" />

              {/* Content Skeleton */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Title Skeleton */}
                <div className="h-6 sm:h-8 bg-green-100 rounded w-3/4" />

                {/* Progress Skeleton */}
                <div className="h-4 bg-green-100 rounded w-full mt-2" />

                {/* Steps Skeleton */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-20 bg-green-100 rounded-full"
                    />
                  ))}
                </div>

                {/* Button Skeleton */}
                <div className="h-10 w-full bg-green-200 rounded-lg mt-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-green-50">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Connection Error
        </h2>
        <p className="text-gray-600 max-w-sm">{error}</p>
      </div>
    );

  if (challenges.length === 0)
    return (
      // Responsive Empty State
      <div className="rounded-2xl  text-center p-4 sm:p-8 flex items-center justify-center">
        <div className="max-w-md mx-auto border border-green-200 bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
          <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Zero Missions Active
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Start your first eco challenge and make an impact today!
          </p>
          <Link
            to="/challenges"
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.03]"
          >
            Explore Challenges
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );

  return (
    // Outer container with padding for all screen sizes
    <div className="  text-gray-800 ">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:pb-8 p-4 p  mb-10 border-b border-green-200"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              My Challenges
            </h2>
          </div>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // Responsive Grid: 1 column on mobile, 2 columns on medium screens and up
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {challenges.map((uc) => {
            const challenge = uc.challenge;
            const {
              color: statusColor,
              icon: StatusIcon,
              label: statusLabel,
            } = getStatusVisuals(uc.status);
            // Ensure progress is a valid number between 0 and 100
            const progress = Math.min(
              100,
              Math.max(0, uc.progress ? uc.progress : 0)
            );

            return (
              <motion.div
                key={uc._id}
                variants={itemVariants}
                className="bg-white rounded-3xl flex flex-col justify-between  shadow-xl border-t-8 border-green-500 overflow-hidden 
                         hover:shadow-green-300/80 hover:translate-y-[-2px] transition-all duration-300 ease-out"
              >
                {/* Challenge Image */}
                <div className="w-full h-40 md:h-48 overflow-hidden">
                  <img
                    src={
                      challenge?.imageUrl ||
                      "https://placehold.co/600x400/86efac/3f6212?text=Eco+Mission"
                    }
                    alt={challenge?.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    {/* Responsive Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-green-800 leading-snug pr-2">
                      {challenge?.title || "Unnamed Challenge"}
                    </h3>
                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${statusColor} border shrink-0`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusLabel}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-600 mb-1 flex justify-between">
                      <span>Progress</span>
                      <span className="font-bold text-green-700">
                        {progress}%
                      </span>
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

                  {/* Steps (Flex-wrap for small screens) */}
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Daily Actions ({uc.completedSteps?.length || 0}/
                    {uc.totalActions})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: uc.totalActions }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStepComplete(uc, idx)}
                        // Adjusted padding for better touch target on mobile
                        className={`cursor-pointer hover:scale-105 duration-750 px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center gap-1 whitespace-nowrap
                          ${
                            uc.completedSteps?.includes(idx)
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 active:bg-green-100"
                          }
                        `}
                        title={`Mark Step ${idx + 1} as complete`}
                      >
                        Action {idx + 1}
                        {uc.completedSteps?.includes(idx) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className=" bottom-0 flex justify-center border-t border-green-100 pt-5 mt-6">
                    <button
                      className=" cursor-pointer w-full py-2 px-3 rounded-lg bg-green-600 text-white font-bold shadow-green-300 shadow-lg hover:scale-105 duration-750"
                      onClick={() => {
                        navigate(`/challenge/${challenge._id}`);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
