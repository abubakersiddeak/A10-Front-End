import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ChallengeCard from "../../components/common/ChallengeCard";

export default function ChallengesWithFilter() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [categories, setCategories] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minParticipants, setMinParticipants] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const fetchChallenges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        categories,
        startDate,
        endDate,
        minParticipants,
        maxParticipants,
      });

      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN
        }/api/challenges/filter?${queryParams.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch challenge data.");
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // --- Loading State ---
  if (isLoading) return <LoadingSpinner />;

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-gray-700 text-center">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-2xl font-semibold mb-4">
          Error loading challenges: {error}
        </p>
        <p className="mb-6 max-w-md">
          Please check your server connection and try again.
        </p>
      </div>
    );
  }

  // --- Empty State ---
  if (!error && challenges.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-gray-700 text-center">
        <XCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-2xl font-semibold mb-4">No Challenges Found</p>
        <p className="mb-6 max-w-md">
          The filters you applied did not match any challenges. Try different
          filters!
        </p>
        <button
          onClick={() => {
            setCategories("");
            setStartDate("");
            setEndDate("");
            setMinParticipants("");
            setMaxParticipants("");
            fetchChallenges();
          }}
          className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 pt-4"
        >
          <h1 className="text-5xl md:text-4xl font-extrabold text-green-800 leading-tight">
            Explore <span className="text-green-600">Eco Missions</span> 🌍
          </h1>
        </motion.div>

        {/* Filter Inputs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Categories</label>
            <input
              type="text"
              placeholder="Comma separated"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="border p-2 rounded w-60"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Min Participants
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minParticipants}
              onChange={(e) => setMinParticipants(e.target.value)}
              className="border p-2 rounded w-40"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Max Participants
            </label>
            <input
              type="number"
              placeholder="Max"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              className="border p-2 rounded w-40"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={fetchChallenges}
              className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Filter
            </button>
          </div>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {challenges.map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
