import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import { Link } from "react-router-dom";

// NOTE: Custom CSS for .challenge-card, .glow-ring, and @keyframes are assumed to be available globally.

export default function HeroCarousel() {
  const swiperModules = [Autoplay, Pagination, EffectCoverflow];
  // Renamed to better reflect that it holds challenge objects
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // Corrected the URL to fetch 'popular challenges' if necessary,
        // but kept 'top-participants' logic as it might be intentional.
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_DOMAIN
          }/api/challenges/top-participants`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setChallenges(data);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };
    fetchdata();
  }, []);

  if (!challenges || challenges.length === 0)
    return (
      <div className="w-full max-w-6xl mx-auto mt-12 px-4 text-center text-gray-500 font-sans p-20 bg-gray-950/90 rounded-[3rem] shadow-4xl border border-green-700/50">
        <p className="text-3xl font-light text-green-400">
          {" "}
          <span className="font-extrabold text-lime-300">
            Hypersleep Mode:
          </span>{" "}
          No Challenges Found. Data streams loading. Please stand by.
        </p>
      </div>
    );

  // Helper function to dynamically determine the status text and class
  const getStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return { text: "COMPLETED", color: "bg-green-600 shadow-green-600/70" };
      case "upcoming":
        return {
          text: "UPCOMING",
          color: "bg-indigo-400 shadow-indigo-400/70",
        };
      // Default for 'active', 'running', etc.
      default:
        return { text: "RUNNING", color: "bg-lime-400 shadow-lime-400/70" };
    }
  };

  return (
    <div
      className="w-full max-w-8xl mx-auto mt-15 px-4" // Added horizontal padding for safety
      style={{
        backgroundImage:
          'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjQiIG51bU9jdGF2ZXM9IjIiIHNlZWQ9IjkiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDEwMjA0Ii8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIuMDgiLz48L2ZpbHRlcj48L3N2Zy4")',
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Holographic Title with Z-Axis Shift */}
      <div className="relative text-center  pb-10">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text 
                 bg-gradient-to-r from-green-300 via-lime-400 to-green-500 
                 drop-shadow-lg tracking-tight leading-snug 
                 relative z-10 
                 transition-all duration-500 ease-in-out
                 hover:scale-[1.02] hover:drop-shadow-xl"
        >
          Popular Challenges
        </h1>
      </div>

      {/* Refined Swiper Component */}
      <Swiper
        modules={swiperModules}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        autoplay={{
          delay: 1800,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 3.5,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet bg-gray-600/40 w-2.5 h-2.5 rounded-full mx-2 transition-all duration-1500 transform hover:scale-[2.5]",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-lime-300 !w-14 h-3 shadow-lime-300/90 shadow-[0_0_15px_6px] rounded-full",
        }}
        className="hero-swiper-hyper-organic py-28"
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2.3, spaceBetween: 10 },
          1280: { slidesPerView: 3.3, spaceBetween: 20 },
        }}
        // Added accessibility attribute
        aria-label="Popular Challenges Carousel"
      >
        {challenges.map((challenge) => {
          // Determine status dynamically
          const statusInfo = getStatusInfo(challenge.status);

          return (
            <SwiperSlide
              key={challenge._id || challenge.title}
              className="!w-[320px] md:!w-[450px] perspective-1200"
            >
              <Link to={`/challenge/${challenge._id}`} className="block h-full">
                <div
                  className="challenge-card relative w-full h-96 xl:h-112 rounded-[2rem] overflow-hidden 
                            shadow-4xl shadow-black/90 border border-green-800/50 
                            transition-all duration-[1200ms] ease-out-quint 
                            hover:shadow-[0_40px_80px_-20px_rgba(163,230,53,0.9)] hover:translate-z-8 hover:-translate-y-4 group"
                >
                  {/* Holographic Glow Ring */}
                  <div className="glow-ring absolute"></div>

                  {/* Image Layer */}
                  <img
                    src={challenge.imageUrl}
                    alt={challenge.title}
                    className="w-full h-full object-cover transition-all duration-[1200ms] 
                                group-hover:scale-[1.25] brightness-[0.7] saturate-[1.4] group-hover:brightness-[0.9] group-hover:saturate-[1.5]"
                    style={{ filter: "hue-rotate(-15deg) contrast(1.1)" }}
                  />

                  {/* Hyper-Organic Data Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/60 to-transparent p-10 flex flex-col justify-end rounded-[2rem]">
                    {/* Status Chip (Dynamic Status and Color) */}
                    <div
                      className={`inline-block px-5 py-2 mb-6 text-xs font-mono uppercase tracking-[0.2em] text-green-950 
                                      ${statusInfo.color} rounded-xl shadow-xl transform skew-x-[-10deg] transition-all duration-500 hover:skew-x-0`}
                    >
                      <span className="skew-x-[10deg] font-black">
                        {statusInfo.text}
                      </span>
                    </div>

                    {/* Title (Kinetic Typography) */}
                    <h2
                      className="text-3xl sm:text-4xl font-black text-white mb-8 leading-tight drop-shadow-lg font-sans transition-all duration-500
                                   transform group-hover:tracking-wider group-hover:text-lime-300"
                    >
                      {challenge.title}
                    </h2>

                    {/* Button: Constant Bio-Pulse */}
                    <button
                      className="cursor-pointer w-full text-center bg-lime-400 hover:bg-lime-300 text-green-950 font-black text-xl py-5 rounded-xl
                                 uppercase tracking-widest transition-all duration-300 
                                 transform hover:scale-[1.03] active:scale-[0.96] focus:outline-none ring-4 ring-lime-400/0 hover:ring-lime-400/60 button-pulse"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
