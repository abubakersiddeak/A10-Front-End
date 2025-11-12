import React, { useEffect, useState } from "react";

export default function ChallengeProgress({ userId }) {
  const [userChallenges, setUserChallenges] = useState([]);

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_DOMAIN
      }/api/userChallenges?userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => setUserChallenges(data))
      .catch((err) => console.error("Error fetching user progress:", err));
  }, [userId]);

  // Update progress function
  const handleProgressUpdate = async (id, newProgress) => {
    await fetch(
      `${
        import.meta.env.VITE_BACKEND_DOMAIN
      }/api/userChallenges/${id}/progress`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      }
    );

    // Update local state instantly
    setUserChallenges((prev) =>
      prev.map((uc) =>
        uc._id === id
          ? {
              ...uc,
              progress: newProgress,
              status: newProgress >= 100 ? "Completed" : "In Progress",
            }
          : uc
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {userChallenges.map((uc) => (
        <div key={uc._id} className="border p-4 rounded-xl bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            Challenge ID: {uc.challengeId}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full ${
                uc.progress >= 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${uc.progress}%` }}
            ></div>
          </div>
          <p className="text-gray-700">
            Progress: <strong>{uc.progress}%</strong> | Status:{" "}
            <strong>{uc.status}</strong>
          </p>
          <button
            onClick={() =>
              handleProgressUpdate(uc._id, Math.min(uc.progress + 10, 100))
            }
            className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
          >
            +10% Progress
          </button>
        </div>
      ))}
    </div>
  );
}
