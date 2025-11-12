import React from "react";
import { Zap, Droplet, UserCheck } from "lucide-react";
const liveStats = [
  {
    metric: "CO₂ Saved",
    value: "8,500",
    unit: "kg",
    icon: Zap,
    color: "text-red-600",
  },
  {
    metric: "Plastic Reduced",
    value: "1,200",
    unit: "kg",
    icon: Droplet,
    color: "text-blue-600",
  },
  {
    metric: "Challenges Joined",
    value: "3,100",
    unit: "users",
    icon: UserCheck,
    color: "text-purple-600",
  },
];
export default function GlobalImpactTracked() {
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
