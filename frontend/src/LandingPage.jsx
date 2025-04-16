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
    </div>
  );
};

export default LandingPage;