import React from "react";

import HeroCarousel from "../../components/common/HeroCarousel";
import OngoingEcoMissions from "../../components/common/OngoingEcoMissions";
import WhyGoGreen from "../../components/common/WhyGoGreen";
import RecentTripAndUpcommingEvent from "../../components/common/RecentTripAndUpcommingEvent";
import HowItWorks from "../../components/common/HowItWorks";
import GlobalImpactTracked from "../../components/common/GlobalImpactTracked";

export default function Home() {
  return (
    <div className="w-full bg-linear-to-b from-green-50 to-white text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto  md:px-6 lg:px-8 pt-6 pb-12">
        <section className="mb-16">
          <h1 className="sr-only">Eco-Track Home Dashboard</h1>

          <HeroCarousel />
        </section>
        <div className="p-4 md:p-0">
          <GlobalImpactTracked />

          <OngoingEcoMissions />

          <WhyGoGreen />

          <RecentTripAndUpcommingEvent />

          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
