import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import ChallengeCard from "../../components/common/ChallengeCard";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch challenge data.");
        }
        const challengeData = await res.json();
        setChallenges(challengeData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // --- Loading State ---
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // --- Error/Empty State ---
  if (error || challenges.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-gray-700 text-center">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-2xl font-semibold mb-4">
          {error ? `Error loading challenges: ${error}` : "No Challenges Found"}
        </p>
        <p className="mb-6 max-w-md">
          {error
            ? "Please check your server connection (http://localhost:3001) and try again."
            : "It looks like the challenge list is currently empty. Check back soon!"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 p-4 sm:p-8">
      {/* Container for Centering */}
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Subtitle (Enhanced) */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 pt-4"
        >
          <h1 className="text-5xl md:text-4xl font-extrabold text-green-800 leading-tight">
            Explore <span className="text-green-600">Eco Missions</span> 🌍
          </h1>
        </motion.div>

        {/* Challenges Grid (Improved Responsiveness) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 md:gap-8">
          {challenges.map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
