import React, { useContext, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Tips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips`
        );
        const data = await res.json();
        setTips(data);
      } catch (err) {
        console.error("Error fetching tips:", err);
      }
    };
    fetchTips();
  }, []);

  const handleUpvote = async (id) => {
    if (!currentUser) {
      alert("Please login to vote!");
      return;
    }

    try {
      setLoading(id);
      const token = await currentUser.getIdToken();

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips/${id}/upvote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update local UI after vote
      setTips((prev) =>
        prev.map((tip) =>
          tip._id === id
            ? {
                ...tip,
                upvotes: data.voted
                  ? (tip.upvotes || 0) + 1
                  : (tip.upvotes || 0) - 1,
                upvotedUsers: data.voted
                  ? [...(tip.upvotedUsers || []), currentUser.email]
                  : (tip.upvotedUsers || []).filter(
                      (u) => u !== currentUser.email
                    ),
              }
            : tip
        )
      );
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Vote failed");
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="rela  max-w-6xl min-h-[60vh] mx-auto px-4 py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          🌿 All Community Tips
        </h1>
        <p className="text-gray-500 text-sm">
          Explore all sustainability tips shared by our eco-community
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No tips found.
          </p>
        ) : (
          tips.map((t) => {
            const isVoted = t.upvotedUsers?.includes(currentUser?.email);
            return (
              <div
                key={t._id}
                className="p-4 bg-linear-to-r from-green-50 to-white rounded-lg border border-green-200 hover:shadow-md transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {t.content.slice(0, 80)}...
                </p>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>👤 {t.authorName || t.author}</span>
                  <button
                    disabled={loading === t._id}
                    onClick={() => handleUpvote(t._id)}
                    className={`cursor-pointer flex items-center gap-1 font-medium transition transform hover:scale-105 ${
                      isVoted
                        ? "text-red-600"
                        : "text-green-700 hover:text-green-800"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isVoted ? "fill-red-500 text-red-500" : "text-gray-400"
                      } ${loading === t._id ? "animate-pulse opacity-60" : ""}`}
                    />
                    {t.upvotes || 0} Upvotes
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Back button */}
      <div className="text-center mt-10">
        <Link
          to="/"
          className="text-green-600 hover:text-green-800 font-semibold text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
