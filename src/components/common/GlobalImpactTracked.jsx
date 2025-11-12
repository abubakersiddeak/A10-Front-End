import React, { useState, useEffect } from "react";
import { Zap, Droplet, UserCheck } from "lucide-react";

export default function GlobalImpactTracked() {
  const [stats, setStats] = useState({
    totalCO2: 0,
    totalPlastic: 0,
    totalJoined: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch live stats (CO2 & Plastic)
        const statsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/statistics`
        );
        const statsData = await statsRes.json();

        // Fetch joined challenges
        const joinRes = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/total-joined`
        );
        const joinData = await joinRes.json();

        setStats({
          totalCO2: statsData.totalCO2 || 0,
          totalPlastic: statsData.totalPlastic || 0,
          totalJoined: joinData.totalJoined || 0,
        });
      } catch (err) {
        console.error("Error fetching live stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center">Loading live stats...</p>;

  const liveStats = [
    {
      metric: "CO₂ Saved",
      value: `${stats.totalCO2.toFixed(2)}`,
      unit: "kg",
      icon: Zap,
      color: "text-red-600",
    },
    {
      metric: "Plastic Reduced",
      value: `${stats.totalPlastic.toFixed(2)}`,
      unit: "kg",
      icon: Droplet,
      color: "text-blue-600",
    },
    {
      metric: "Challenges Joined",
      value: `${stats.totalJoined}`,
      unit: "users",
      icon: UserCheck,
      color: "text-purple-600",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b border-green-200 pb-2">
        Global Impact Tracked 🌎
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {liveStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 transition-transform duration-300 hover:scale-[1.03] hover:shadow-green-300/50"
          >
            <div className="flex items-center mb-4">
              <stat.icon size={36} className={`text-green-500 mr-3`} />
              <p className="text-lg font-medium text-gray-500 uppercase tracking-wider">
                {stat.metric}
              </p>
            </div>
            <div className="font-extrabold text-5xl text-gray-900 tracking-tight">
              {stat.value}
              <span className={`text-xl text-green-600 ml-2 font-bold`}>
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
