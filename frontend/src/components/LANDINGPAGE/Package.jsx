import React from "react";
import cocktailsImage from "../../assets/cocktails.png";
import packagesImage from "../../assets/packages.jpg";

const Package = () => {
  return (
    <section className="bg-black w-full text-center py-16 relative">
      <div className="container mx-auto px-4">
        {/* 🔖 Title Section */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our Packages
          </h2>
        </div>

        {/* 📦 Package Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-[600px] rounded-lg shadow-inner overflow-hidden flex items-center justify-center transition-transform transform hover:scale-105">
            <img
              src={cocktailsImage}
              alt="Cocktails Package"
              className="w-auto h-full object-contain"
            />
          </div>
          <div className="h-[600px] rounded-lg shadow-inner overflow-hidden flex items-center justify-center transition-transform transform hover:scale-105">
            <img
              src={packagesImage}
              alt="Bevanda Packages and Drinks"
              className="w-auto h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Package;