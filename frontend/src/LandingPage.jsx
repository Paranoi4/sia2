import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HeroCard from "./components/HeroCard";
import liquors from "./assets/liquors.mp4";
import Rapidscat from "./components/Rapidscat";
import Satelite from "./components/Satelite";
import Footer5 from "./components/Footer5";
import AboutSection from "./components/AboutSection";
import AOS from "aos";
import "aos/dist/aos.css";
//import { Satellite } from "@mui/icons-material";

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <div className="">
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
      <HeroCard />
      <Rapidscat />
      <Satelite />
      <AboutSection />
      {/* <Footer /> */}
      <Footer5 />
    </div>
  );
};

export default LandingPage;