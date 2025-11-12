import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Link } from "react-router";

export default function HeroCarousel() {
  const swiperModules = [Autoplay, Pagination];
  const [challenges, setChallenge] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/challenges`
        );
        const challenge = await res.json();
        setChallenge(challenge);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  if (!challenges || challenges.length === 0)
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 px-4 text-center text-gray-500">
        No active challenges to display.
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 px-4 md:px-6">
      <Swiper
        modules={swiperModules}
        spaceBetween={25}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          // Custom styling for light theme: dark bullets, bright active bullet
          bulletClass:
            "swiper-pagination-bullet bg-gray-400 w-2 h-2 rounded-full mx-1 transition-all duration-300",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-green-600 w-6", // Vibrant green accent
        }}
        // Light Theme Container Styling: Clean white background with subtle shadow/border
        className="hero-swiper-light rounded-xl p-6 md:p-4   "
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1280: { slidesPerView: 3, spaceBetween: 40 },
        }}
      >
        {challenges.map((challenge) => (
          <SwiperSlide key={challenge._id || challenge.title}>
            <div
              // Light Theme Slide Styling: White card with clean shadow and green hover highlight
              className="relative w-full h-96 xl:h-112 rounded-xl overflow-hidden  border border-green-300
                           hover:border-green-500 transition-all duration-500 ease-in-out cursor-pointer group 
                           hover:shadow-green-200"
            >
              {/* Image without heavy filter */}
              <img
                src={challenge.imageUrl}
                alt={challenge.title}
                // Image is clearer, slightly softer opacity for text readability
                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Modern Light Glassmorphism Overlay Card */}
              <div className="absolute inset-0 flex items-end p-4 sm:p-6 bg-linear-to-t from-black/60 to-transparent rounded-b-xl">
                <div className="w-full">
                  {/* Title */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white mb-3 sm:mb-4 leading-snug drop-shadow-lg">
                    {challenge.title}
                  </h2>

                  {/* View Challenge Button */}
                  <Link
                    to={`/challenge/${challenge._id}`}
                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg 
                 shadow-lg shadow-green-400/30 uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1"
                  >
                    View Challenge
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
