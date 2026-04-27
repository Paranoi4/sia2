import React from "react";
import visionImg from "../../assets/vision.jpg"; // Vision image
import missionImg from "../../assets/mission.jpg"; // Mission image

const MissionAndVision = () => {
  return (
    <section className="bg-black text-white py-20 px-6 space-y-20">
      {/* 🔵 VISION Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 border-l-2 border-b-2 border-white p-6">
      
          <h1 className="text-4xl font-bold uppercase">Vision</h1>
          <p className="text-lg leading-relaxed">
            “To be the leading mobile bar service that transforms every event into an unforgettable experience through exceptional service, innovative cocktail creations, and a commitment to sustainability.”
          </p>
        </div>
        <div>
          <img
            src={visionImg}
            alt="Vision"
            className="w-full sm:w-[90%] max-h-[350px] object-cover rounded shadow-md"
          />
        </div>
      </div>

      {/* 🔵 MISSION Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div>
          <img
            src={missionImg}
            alt="Mission"
            className="w-full sm:w-[90%] max-h-[350px] object-cover rounded shadow-md"
          />
        </div>
        <div className="space-y-4 border-r-2 border-b-2 border-white p-6 text-right sm:text-left">
          
          <h1 className="text-4xl font-bold uppercase">Mission</h1>
          <p className="text-lg leading-relaxed">
            “Our mission is to provide a unique and personalized mobile bar experience that elevates celebrations and gatherings. We strive to deliver high-quality beverages, expert mixology, and exceptional customer service while fostering a fun and inclusive atmosphere. We are dedicated to using locally sourced ingredients and eco-friendly practices to create memorable moments for our clients and their guests.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionAndVision;
