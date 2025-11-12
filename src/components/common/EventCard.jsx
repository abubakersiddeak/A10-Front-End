import React, { useContext } from "react";

import { Calendar, MapPin } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function EventCard({ event }) {
  const { currentUser } = useContext(AuthContext);
  const startDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative bg-linear-to-br from-white/80 to-green-50/70 backdrop-blur-xl border border-green-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 w-full flex items-center justify-between gap-6 overflow-hidden">
      {/* Decorative light glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-r from-green-100/40 to-transparent blur-2xl rounded-2xl"></div>

      {/* Left side content */}
      <div className="flex flex-col gap-1 grow z-10">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition duration-300">
          {event.title}
        </h4>
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="flex items-center gap-3 text-gray-600 mt-2">
          <span className="flex items-center gap-1 text-xs">
            <Calendar size={14} className="text-green-600" />
            {startDate}
          </span>
          {event.location && (
            <span className="flex items-center gap-1 text-xs">
              <MapPin size={14} className="text-green-600" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* View button */}
      {currentUser ? (
        <button
          onClick={() => {
            toast.error("Opps join Function is not Developd");
          }}
          className="cursor-pointer z-10 text-center py-2 px-5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md transition duration-200"
        >
          Join
        </button>
      ) : null}
    </div>
  );
}
