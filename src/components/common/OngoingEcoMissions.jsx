import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ChallengeCard from "./ChallengeCard";
export default function OngoingEcoMissions() {
  const [challenges, setChallenge] = useState([]);

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
      }
    };
    fetchdata();
  }, []);
  return (
    <section className="mb-16">
      <div className="flex justify-between items-baseline mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          🌿 Ongoing Eco Missions{" "}
          <span className="text-green-500">({challenges.length})</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.slice(0, 6).map((c) => (
          <ChallengeCard key={c._id} challenge={c} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        {" "}
        <Link
          to="/challenge"
          className="text-green-600  text-center hover:text-green-700 transition-colors font-semibold flex items-center gap-1"
        >
          View All Challenges &rarr;
        </Link>
      </div>
    </section>
  );
}
