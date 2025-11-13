import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ChallengeCard from "./ChallengeCard";

export default function OngoingEcoMissions() {
  const [challenges, setChallenge] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges/running`
        );
        const challenge = await res.json();
        setChallenge(challenge);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  return (
    <section className="mb-16">
      <div className="flex justify-between items-baseline mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          🌿 Ongoing Eco Missions{" "}
          <span className="text-green-500">
            {loading ? "" : `(${challenges.length})`}
          </span>
        </h2>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="w-full h-40 bg-gray-300 rounded-xl"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="flex justify-between mt-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center mt-10">
          <div className="text-gray-600 text-lg bg-green-50 p-6 rounded-2xl shadow-md inline-block">
            🌱 You haven't created any challenges yet.
            <br />
            <span className="text-green-600 font-semibold">
              Start your first eco mission today!
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.slice(0, 6).map((c) => (
              <ChallengeCard key={c._id} challenge={c} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              to="/challenge"
              className="text-green-600 text-center hover:text-green-700 transition-colors font-semibold flex items-center gap-1"
            >
              View All Challenges &rarr;
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
