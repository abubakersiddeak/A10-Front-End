import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Clock,
  Users,
  Target,
  ArrowLeft,
  Calendar,
  User,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

// Helper for date formatting
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ChallengeDetails() {
  const { dbUser, currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch challenge data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch challenge data.");
        const challengeData = await res.json();
        setChallenge(challengeData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleJoinButtonClick = async () => {
    if (!currentUser || !dbUser) {
      toast.info("Please login or sign up to join a challenge.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges/join/${
          challenge._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: dbUser._id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Joined challenge successfully!");
        setChallenge((prev) => ({
          ...prev,
          participants: prev.participants + 1,
        }));
      } else {
        toast.error(data.message || "Failed to join challenge.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while joining.");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !challenge)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-gray-700 text-center">
        <Leaf className="w-12 h-12 text-green-600 mb-4" />
        <p className="text-2xl font-semibold mb-4">
          {error ? `Error: ${error}` : "Challenge not found"} 😔
        </p>
        <p className="mb-6">
          The challenge with ID <strong>{id}</strong> might have been removed.
        </p>
        <button
          onClick={() => navigate("/challenges")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          Explore Other Challenges
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer inline-flex items-center justify-center mb-8  text-green-600 font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:scale-105 duration-800  "
        >
          <ArrowLeft className="w-5 h-5 mr-3 -ml-1" />
          GO BACK
        </button>

        <div className="lg:flex lg:space-x-10">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <motion.img
              src={challenge.imageUrl}
              alt={challenge.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-72 md:h-[450px] object-cover rounded-3xl shadow-xl mb-8"
            />

            <div className="mb-6">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {challenge.category || "General Challenge"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                {challenge.title}
              </h1>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 border-l-4 border-green-400 pl-4">
              {challenge.description}
            </p>

            {/* Steps */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Challenge Steps ({challenge.totalActions})
              </h2>
              <ul className="space-y-3">
                {challenge.steps?.map((step) => (
                  <li
                    key={step.stepNumber}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl shadow-sm"
                  >
                    <span className="text-green-600 font-bold text-lg">
                      Step {step.stepNumber}:
                    </span>
                    <span className="text-gray-700">{step.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Join Button */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm shadow-2xl lg:hidden z-10">
              <motion.button
                onClick={handleJoinButtonClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 rounded-xl transition duration-300 shadow-lg"
              >
                Join Challenge
              </motion.button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-8 bg-green-50 p-6 rounded-3xl shadow-xl border border-green-200"
            >
              <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-2 border-green-300">
                Challenge At A Glance
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Duration
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {challenge.duration} days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <Users className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Participants
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {challenge.participants || 0} People
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <Target className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Challenge Goal
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {challenge.target}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <Leaf className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Core Impact
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {challenge.impactMetric}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-green-200 space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <p>Start: {formatDate(challenge.startDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <p>End: {formatDate(challenge.endDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  <p>Created By: {challenge.createdBy}</p>
                </div>
              </div>

              {/* Desktop Join Button */}
              {currentUser ? (
                <motion.button
                  onClick={handleJoinButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer hidden lg:block mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-xl transition duration-300 shadow-md"
                >
                  Join Challenge Now
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden cursor-pointer lg:block mt-8 w-full bg-green-400 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-xl transition duration-300 shadow-md"
                >
                  Login Or Signup to Join this challenge
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
