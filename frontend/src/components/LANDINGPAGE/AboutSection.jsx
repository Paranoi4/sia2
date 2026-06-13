import React from "react";
import logo from "../../assets/logo.jpg";
import backgroundImage from "../../assets/1113bgg.jpg"; // Background image

const AboutSection = () => {
  return (
    <section
      className="text-white py-20 relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🌫 Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />
      {/* 🌫 Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />

      {/* 👤 About Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* ✏️ Text Block */}
          <div className="space-y-6">
            <h2 className="text-6xl font-extrabold text-white">About Us</h2>
            <p className="text-lg text-white leading-relaxed">
              Experience the ultimate bar experience at your desired location with{" "}
              <span className="font-bold text-white">Bevanda Mobile Bar</span>. We offer
              premier bartending services for all kinds of events, delivering the best cocktails,
              mocktails, shooters, and flaming shots right to your venue.
            </p>
            <p className="text-lg text-white leading-relaxed">
              Whether it’s a wedding, birthday, corporate event, or any celebration, we ensure a
              fun and flavorful experience that keeps your guests entertained and satisfied.
            </p>
          </div>

          {/* 📷 Image Block */}
          <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-xl flex items-center justify-center">
            <img
              src={logo}
              alt="Bevanda Logo"
              className="w-60 h-60 rounded-full border-4 border-white-400 shadow-md object-cover mb-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
