import { useState, useEffect } from "react";

// 📸 Import images for slides
import dummyImage1 from "../../assets/1111.jpg";
import dummyImage2 from "../../assets/1112.jpg";
import dummyImage3 from "../../assets/shooters.jpg";

import slide2img1 from "../../assets/1115a.jpg";
import slide2img2 from "../../assets/1115b.jpg";
import slide2img3 from "../../assets/1115c.jpg";

import slide3img1 from "../../assets/1114a.jpg";
import slide3img2 from "../../assets/1114b.jpg";
import slide3img3 from "../../assets/1114d.jpg";

// 🖼️ Background image
import backgroundImage from "../../assets/1113bg.png";

// 🧾 Slide Data
const slides = [
  {
    title: "Discover Bevanda’s Best Craft Drinks",
    description: "From signature cocktails to refreshing mocktails and vibrant shooters.",
    images: [dummyImage1, dummyImage2, dummyImage3],
  },
  {
    title: "We Cater All Types of Events",
    description: "Birthdays, weddings, anniversaries — Bevanda brings the bar to you.",
    images: [slide2img1, slide2img2, slide2img3],
  },
  {
    title: "Professional Bartenders. Premium Service.",
    description: "Trained mixologists with a smile — we deliver more than just drinks.",
    images: [slide3img1, slide3img2, slide3img3],
  },
];

const WebSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔁 Auto-slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* 🟪 Header */}
      <div className="w-full text-center py-6 z-40 relative bg-black">
        <h2 className="text-4xl sm:text-5xl font-bold text-white">
          Choose Bevanda Mobile Bar for Your Event
        </h2>
      </div>

      {/* 🎞 Slide Content */}
      <div
        className="w-full h-auto flex flex-col items-center justify-center px-6 py-12 bg-cover bg-center transition-all duration-500 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🔼 Top Gradient */}
        <div className="absolute top-0 left-0 w-full z-30 h-[60px] sm:h-[80px] bg-gradient-to-b from-black to-transparent pointer-events-none" />

        {/* 🔽 Bottom Gradient */}
        <div className="absolute bottom-0 right-0 w-full z-30 h-[60px] sm:h-[80px] bg-gradient-to-t from-black to-transparent pointer-events-none" />

        {/* ◀️ Left Gradient */}
        <div className="absolute top-0 left-0 h-full w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />

        {/* ▶️ Right Gradient */}
        <div className="absolute top-0 right-0 h-full w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        {/* 🧾 Slide Content */}
        <h3 className="text-3xl md:text-4xl font-bold mb-6 z-10">
          {slides[currentSlide].title}
        </h3>
        <p className="text-lg max-w-3xl mx-auto mb-6 px-4 z-10">
          {slides[currentSlide].description}
        </p>

        {/* 🖼 Slide Images */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 z-10">
          {slides[currentSlide].images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`slide-${currentSlide}-img-${i}`}
              className="w-[500px] h-[400px] object-cover rounded-lg shadow-md"
            />
          ))}
        </div>

        {/* 🔘 Dot Indicators */}
        <div className="mt-4 flex gap-3 justify-center z-50 relative">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-110" : "bg-gray-400"
              }`}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSlider;
