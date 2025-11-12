import { useState, useEffect } from "react";

export default function ChallengeFilter() {
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minParticipants, setMinParticipants] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const fetchChallenges = async () => {
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
      if (!res.ok) throw new Error("Failed to fetch challenges");

      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching challenges");
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Filter Challenges</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Participants"
          value={minParticipants}
          onChange={(e) => setMinParticipants(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Participants"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchChallenges}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.length === 0 && <p>No challenges found</p>}
        {challenges.map((ch) => (
          <div key={ch._id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{ch.title}</h3>
            <p>Category: {ch.category}</p>
            <p>Participants: {ch.participants}</p>
            <p>Start: {new Date(ch.startDate).toLocaleDateString()}</p>
            <p>End: {new Date(ch.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
