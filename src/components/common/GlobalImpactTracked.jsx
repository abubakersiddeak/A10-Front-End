import React, { useState, useEffect } from "react";
import { UserCheck, Leaf, Target } from "lucide-react";

export default function GlobalImpactTracked() {
  const [stats, setStats] = useState({
    totalJoined: 0,
    totalUsers: 0,
    completedMissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data together
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/global-stats`
        );
        const serverdata = await res.json();

        const data = serverdata.stats;

        setStats({
          totalJoined: data.totalJoined || 0,
          totalUsers: data.totalUsers || 0,
          completedMissions: data.totalCompleted || 0,
        });
      } catch (err) {
        console.error("Error fetching live stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <section className="mb-16 bg-gradient-to-b from-green-50 to-green-100 p-10 rounded-3xl shadow-lg border border-green-200 animate-pulse">
        <div className="h-10 w-80 mx-auto mb-8 bg-gradient-to-r from-green-200 via-green-100 to-green-200 rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white/80 p-8 rounded-2xl shadow-lg border border-green-200 
                       transition-transform duration-300 hover:scale-[1.03] hover:shadow-green-400/40"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-200/60 rounded-full mr-4"></div>
                <div className="h-4 w-32 bg-green-200/50 rounded-lg"></div>
              </div>

              <div className="h-10 w-40 bg-green-300/40 rounded-lg mb-3"></div>
              <div className="h-4 w-24 bg-green-200/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );

  const liveStats = [
    {
      metric: "Challenges Joined",
      value: `${stats.totalJoined}`,
      unit: "users",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      metric: "Completed Missions",
      value: `${stats.completedMissions}`,
      unit: "tasks",
      icon: Target,
      color: "text-green-700",
    },
    {
      metric: "Total Users",
      value: `${stats.totalUsers}`,
      unit: "members",
      icon: Leaf,
      color: "text-green-500",
    },
  ];

  return (
    <section className="mb-16 bg-gradient-to-b from-green-50 to-green-100 p-10 rounded-3xl shadow-lg border border-green-200">
      <h2 className="text-3xl font-extrabold text-green-900 mb-8 border-b-2 border-green-400 pb-2 text-center">
        🌎 Global Eco Impact Tracker
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {liveStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 p-8 rounded-2xl shadow-lg border border-green-200 transition-transform duration-300 hover:scale-[1.03] hover:shadow-green-400/40 hover:bg-green-50"
          >
            <div className="flex items-center mb-4">
              <stat.icon size={40} className={`mr-4 ${stat.color}`} />
              <p className="text-lg font-medium text-green-700 uppercase tracking-wider">
                {stat.metric}
              </p>
            </div>
            <div className="font-extrabold text-5xl text-green-900 tracking-tight">
              {stat.value}
              <span className="text-xl text-green-700 ml-2 font-semibold">
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
