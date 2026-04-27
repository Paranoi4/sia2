import React from "react";
import flameImg from "../../assets/cat.png"; // Decorative image
import backgroundImage from "../../assets/1113bggg.png"; // Background image

import jessaImg from "../../assets/1111.jpg";
import ameliaImg from "../../assets/1111.jpg";
import sofiaImg from "../../assets/1111.jpg";
import miguelImg from "../../assets/1111.jpg"; // Additional reviewer

const reviews = [
  {
    name: "Jessa Dela Cruz",
    location: "Marikina",
    message:
      "Unbelievable, professional service from start to finish. The Bevanda experience is magnificent! Perfect for parties, team buildings or conferences.",
    image: jessaImg,
  },
  {
    name: "Amelia Lee",
    location: "Zambales",
    message:
      "On my wedding day, their team showed up early and had drinks flowing before the reception started. Everyone was raving about the mobile bar all night. Highly recommend Bevanda!",
    image: ameliaImg,
  },
  {
    name: "Sofia Sanchez",
    location: "Batangas",
    message:
      "The bartenders are incredibly friendly and accommodating, making everyone feel welcome and ensuring their drink preferences were met. Mobile Bar is the way to go!",
    image: sofiaImg,
  },
  {
    name: "Miguel Ramos",
    location: "Taguig",
    message:
      "Our corporate event was a success thanks to Bevanda. Guests loved the drinks and setup. Very professional and smooth service.",
    image: miguelImg,
  },
];

const Reviews = () => {
  return (
    <section
      className="text-white py-20 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* 🌫 Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />
      {/* 🌫 Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />

      {/* 🌟 Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-black/85 backdrop-blur-sm rounded-xl p-8 relative z-20">
        {/* 🔥 Left Section: Title + Flame */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-white tracking-widest font-semibold uppercase">Happy Customers</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Clients Reviews.</h2>
          <div className="w-14 h-1 bg-white mb-6" />
          <img
            src={flameImg}
            alt="Flaming Cocktail"
            className="w-[280px] h-auto animate-wiggle"
          />
        </div>

        {/* 💬 Right Section: Reviews */}
        <div className="space-y-10">
          {reviews.map((review, index) => (
            <div key={index} className="border-t border-gray-500 pt-6">
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-red-500"
                />
                <div>
                  <p className="font-bold text-lg text-white">{review.name}</p>
                  <p className="text-sm text-white">{review.location}</p>
                </div>
              </div>
              <p className="text-white leading-relaxed">{review.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
