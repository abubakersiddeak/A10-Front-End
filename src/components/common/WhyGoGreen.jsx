import React from "react";
import { Leaf, Zap, UserCheck, Award } from "lucide-react";
const whyGoGreen = [
  {
    title: "Healthier Planet",
    description: "Preserve ecosystems and biodiversity for future generations.",
    icon: Leaf,
  },
  {
    title: "Reduced Costs",
    description: "Lower energy and water bills by adopting sustainable habits.",
    icon: Zap,
  },
  {
    title: "Community Strength",
    description:
      "Connect with like-minded individuals and build local resilience.",
    icon: UserCheck,
  },
];
export default function WhyGoGreen() {
  return (
    <section className="mb-16 py-12 bg-green-50 rounded-2xl shadow-inner shadow-green-200/50">
      <h2 className="text-4xl font-extrabold text-center text-green-700 mb-10">
        Why Go Green? <Award className="inline-block w-8 h-8 ml-2" />
      </h2>
      <div className="grid md:grid-cols-3 gap-8 px-8">
        {whyGoGreen.map((item, index) => (
          <div
            key={index}
            className="text-center p-6 border border-green-300 rounded-xl bg-white shadow-lg transition-all duration-300 hover:border-green-500"
          >
            <item.icon size={36} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
