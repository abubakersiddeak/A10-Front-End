import React from "react";
import { Leaf, Users, Clock, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function ChallengeCard({ challenge }) {
  const {
    title,
    category,
    description,
    participants,
    impactMetric,
    duration,
    imageUrl,
    _id,
  } = challenge;

  const shortDescription =
    description.length > 80
      ? description.substring(0, 77) + "..."
      : description;

  const navigateToChallengeDetails = () => {
    console.log(`Navigating to challenge: ${_id}`);
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 15px 30px -5px rgba(16, 185, 129, 0.2)",
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      onClick={navigateToChallengeDetails}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 
                 cursor-pointer group relative transition-all duration-300 ease-in-out 
                 flex flex-col justify-between w-full max-w-sm sm:max-w-md md:max-w-lg"
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between grow">
        <div>
          <h3 className="font-extrabold text-xl text-gray-900 mb-2 leading-tight group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 border-t border-green-100 pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-800">
              {participants} people
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-800">{impactMetric}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-800">{duration} days</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-800">
              {challenge.target || "Goal-Oriented"}
            </span>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/challenge/${_id}`}
          className="cursor-pointer mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg 
                     hover:bg-green-600 transition-colors duration-300 shadow-md group-hover:shadow-lg group-hover:bg-green-600"
        >
          View Challenge
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
