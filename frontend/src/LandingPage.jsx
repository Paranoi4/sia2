import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Components
import Navbar from "./components/LANDINGPAGE/Navbar";
import Hero from "./components/LANDINGPAGE/Hero";
//import HeroCard from "./components/LANDINGPAGE/HeroCard";
//import Rapidscat from "./components/LANDINGPAGE/Rapidscat";
//import Satelite from "./components/LANDINGPAGE/Satelite";
import MissionAndVision from "./components/LANDINGPAGE/MissionAndVision";
import AboutSection from "./components/LANDINGPAGE/AboutSection";
import Package from "./components/LANDINGPAGE/Package";
import WebSlider from "./components/LANDINGPAGE/WebSlider";
import Highlights from "./components/LANDINGPAGE/Highlights";
import Reviews from "./components/LANDINGPAGE/Reviews";
import Coffee from "./components/LANDINGPAGE/Coffee";
import Footer5 from "./components/LANDINGPAGE/Footer5";

// Assets
import liquors from "./assets/liquors.mp4";

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div>
      {/* 🔥 Hero Section with Video */}
      <div className="h-[700px] relative">
        <video
          autoPlay
          loop
          muted
          className="fixed right-0 top-0 h-[700px] w-full object-cover z-[-1]"
        >
          <source src={liquors} type="video/mp4" />
        </video>
        <Navbar />
        <Hero />
      </div>
  {/* 🎞 WebSlider (Slides with bg) */}
  <WebSlider />
      {/* 💳 Hero Content Cards */}
    
      {/* 🎬 Brand Highlights Section */}
    
      

   


      {/* 🍹 Package Display */}
      <Package />

    
      <Coffee />
      {/* 🎠 Highlights Carousel */}
      <Highlights />

      {/* ⭐ Reviews Carousel */}
      

      {/* ☕ Coffee Coming Soon Section */}

       {/* 📖 About Bevanda Section */}
       <AboutSection />
        {/* 🌐 Company Vision & Mission */}
        <MissionAndVision />
     
      <Reviews />
      {/* ⚓ Footer */}
      <Footer5 />
      {/* 🛜 Messenger Icon */}
  <a
    href="https://www.facebook.com/messages/t/208991199769575"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-8 h-8"
    >
      <path d="M12 2C6.48 2 2 6.19 2 11c0 2.4 1.08 4.56 2.82 6.16V22l2.62-1.44c1.26.34 2.62.52 4.04.52 5.52 0 10-4.19 10-9.34S17.52 2 12 2zm1.45 12.58-2.42-2.58-5.03 2.58 5.45-5.82 2.4 2.6 5.05-2.6-5.45 5.82z" />
    </svg>
  </a>
    </div>
  );
};

export default LandingPage;