import React from "react";
import { CheckCircle, Activity, Target } from "lucide-react";
const howItWorks = [
  {
    step: 1,
    title: "Join a Challenge",
    description:
      "Select from various categories like Waste, Energy, or Transport.",
    icon: Target,
  },
  {
    step: 2,
    title: "Track Progress",
    description: "Update your metrics regularly on your activities dashboard.",
    icon: Activity,
  },
  {
    step: 3,
    title: "Share Tips",
    description: "Contribute knowledge and upvote fellow Eco-Citizens' tips.",
    icon: CheckCircle,
  },
];
export default function HowItWorks() {
  return (
    <section className="mb-12 py-10">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        🌿 How It Works <span className="text-green-600">// Get Started</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {howItWorks.map((item) => (
          <div
            key={item.step}
            className="p-8 bg-white rounded-2xl border border-green-200 shadow-lg group transition-all duration-300 hover:shadow-xl hover:border-green-500"
          >
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 border-4 border-green-300 transition-all duration-300 relative">
              <span className="absolute text-5xl font-extrabold text-green-600 opacity-10 top-2 left-1/2 transform -translate-x-1/2">
                {item.step}
              </span>
              <item.icon size={36} className="text-green-600 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 mt-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
