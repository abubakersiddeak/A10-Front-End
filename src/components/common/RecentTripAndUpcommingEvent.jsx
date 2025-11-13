import React, { useContext, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { AuthContext } from "../../context/AuthContext";

export default function RecentTripAndUpcommingEvent() {
  const [tips, setTips] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(null); // store loading ID
  const { currentUser } = useContext(AuthContext);

  //  Fetch Tips from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tips`
        );
        const data = await res.json();
        const last5Tips = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setTips(last5Tips);
      } catch (error) {
        console.error("Error fetching tips:", error);
      }
    };
    fetchData();
  }, []);

  //  Fetch upcomming event
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/events/upcomming`
        );
        const data = await res.json();
        setUpcomingEvents(data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
      }
    };

    fetchUpcoming();
  }, []);

  //  Handle Upvote Toggle
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
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        🌿 Tips & Upcoming Events
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/*  Recent Tips Panel */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-baseline mb-6 border-b border-green-100 pb-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Latest Community Tips ({tips.length})
            </h2>
            <Link
              to="/tips"
              className="text-green-600 hover:text-green-700 text-sm font-semibold transition"
            >
              See All →
            </Link>
          </div>

          <div className="space-y-4">
            {tips.slice(0, 5).map((t) => {
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
                          isVoted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        } ${
                          loading === t._id ? "animate-pulse opacity-60" : ""
                        }`}
                      />
                      {t.upvotes || 0} Upvotes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/*  Upcoming Events */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-baseline mb-6 border-b border-green-100 pb-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Upcoming Eco Events
            </h2>
            <Link
              to="/allevents"
              className="text-green-600 hover:text-green-700 text-sm font-semibold transition"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <p>No upcoming event yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
