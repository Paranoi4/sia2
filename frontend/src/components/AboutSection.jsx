import React from "react";
import cocktailsImage from "../assets/cocktails.png";
import packagesImage from "../assets/packages.jpg";
import logo from "../assets/logo.jpg";

const AboutSection = () => {
  return (
    <section className="bg-black text-white py-20 relative"> 
      <div className="container mx-auto px-4 space-y-16 relative z-10">

        {/* About Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-6xl font-extrabold text-white">About Us</h2>
            <p className="text-lg text-blue-400 leading-relaxed">
              Experience the ultimate bar experience at your desired location with <span className="font-bold text-white">Bevanda Mobile Bar</span>. We offer premier bartending services for all kinds of events, delivering the best cocktails, mocktails, shooters, and flaming shots right to your venue.
            </p>
            <p className="text-lg text-blue-400 font-semibold leading-relaxed">
              Whether it's a wedding, birthday, corporate event, or any celebration, we ensure a fun and flavorful experience that keeps your guests entertained and satisfied. Let us elevate your event with expertly crafted drinks and exceptional service.
            </p>
          </div>

          {/* Image */}
          <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-xl">
              {/* Image */}
<div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-xl flex items-center justify-center"> 
  <img
    src={logo}
    alt="Bevanda Logo"
    className="w-60 h-60 rounded-full border-4 border-indigo-400 shadow-md object-cover mb-3"
  />
</div>

          </div>
        </div>

 {/* Drinks List */}
<div className="max-w-6xl mx-auto mb-12">
  <h2 className="text-4xl font-semibold text-center mb-8 text-white">Our Drinks</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left text-sm sm:text-base">
    {[
      { title: "Cocktail", items: ["Shirley Temple", "Margarita Blue", "Margarita Red", "Tequila Sunrise", "Cuba Libre", "Mojito", "Gimlet", "Straight-up", "Blue Lagoon", "Blue Hawaii", "Tom Collins", "Kamikaze", "Screwdriver", "Sex on the Beach"] },
      { title: "Mocktail", items: ["Cinderella", "Four Seasons", "Shirley Temple", "Appletini"] },
      { title: "Shooters", items: ["Dirty Shirley", "Daiquiri", "Rainbow", "Summer Shot", "Mellon Ball", "Amnesia", "Blowjob", "4th of July", "Red Headed"] },
      { title: "Special Requests", items: ["Lime Basil", "Dry Martini", "Manhattan", "Perfect Manhattan", "Cosmopolitan", "Gibson", "Harvey Wallbanger", "Grasshopper", "Brandy Alexander", "White Russian", "Black Russian", "Negroni", "Vodka Martini", "Mudshake", "Frozen Daiquiri", "Mango Daiquiri"] }
    ].map((category, index) => (
      <div 
        key={index} 
        className="bg-gray-900 text-gray-200 rounded-xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-2xl hover:bg-gray-800"
      >
        <h3 className="text-2xl font-bold mb-4 text-white">{category.title}</h3>
        <ul className="space-y-2 font-sans text-base leading-relaxed">
          {category.items.map((item, idx) => (
            <li key={idx} className="text-gray-300 hover:text-white transition-colors">{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>


        {/* Package Preview */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold mb-6 text-white">Our Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-[600px] rounded-lg shadow-inner overflow-hidden flex items-center justify-center transition-transform transform hover:scale-105"> 
              <img src={cocktailsImage} alt="Cocktails Package" className="w-auto h-full object-contain" /> 
            </div>
            <div className="h-[600px] rounded-lg shadow-inner overflow-hidden flex items-center justify-center transition-transform transform hover:scale-105"> 
              <img src={packagesImage} alt="Packages with Pax and Drinks" className="w-auto h-full object-contain" /> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
