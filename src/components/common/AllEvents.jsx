import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import EventCard from "./EventCard";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/events`
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
        🌱 All Eco Events
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-600">No events found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className=" flex flex-col justify-between">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
