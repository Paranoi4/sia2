import React from "react";
import coffeeBg from "../../assets/1113bgggg.png"; // Make sure the path is correct

const Coffee = () => {
  return (
    <section
      className="text-white py-28 relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${coffeeBg})`,
      }}
    >
      {/* 🔝 Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />

      {/* 🔚 Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />

      {/* 💬 Content */}
      <div className="relative z-20 text-center px-6">
        <h2 className="text-4xl text-white sm:text-6xl font-bold mb-4">☕ Coming Soon</h2>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto text-white opacity-90">
          “Await the sweet and bitter symphony of Bevanda’s Coffee Collection — brewed to awaken memories and spark new ones.”
        </p>
      </div>
    </section>
  );
};

export default Coffee;