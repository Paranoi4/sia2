import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import showcase1 from "../../assets/showcase1.jpg";
import showcase2 from "../../assets/showcase2.jpg";
import showcase3 from "../../assets/showcase3.jpg";
import wave from "../../assets/waveGif.gif"; // Make sure the waveGif.gif is in your assets folder

const HeroCard = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <>
      <section className="relative bg-black text-white py-16 overflow-hidden">
        
        {/* Wave Background */}
        <div className="absolute inset-x-0 bottom-0 z-[0]">
          <img
            src={wave}
            alt=""
            className="h-[400px] w-full object-cover mix-blend-screen -translate-y-40"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-[1]">
          <h2 
            data-aos="fade-down" 
            className="text-4xl font-bold mb-8 text-center"
          >
            Choose Bevanda Mobile Bar for Your Event
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Showcase Image 1 */}
            <div 
              data-aos="zoom-in" 
              className="h-[400px] overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={showcase1} alt="Showcase 1" className="w-full h-full object-cover" />
            </div>

            {/* Showcase Image 2 */}
            <div 
              data-aos="zoom-in" 
              data-aos-delay="200"
              className="h-[400px] overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={showcase2} alt="Showcase 2" className="w-full h-full object-cover" />
            </div>

            {/* Showcase Image 3 */}
            <div 
              data-aos="zoom-in" 
              data-aos-delay="400"
              className="h-[400px] overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={showcase3} alt="Showcase 3" className="w-full h-full object-cover" />
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroCard;
