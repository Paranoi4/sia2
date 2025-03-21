import React from "react";
//import sateliteImg from "../assets/satelite1.jpg";
import bevv1 from "../assets/bevv1.mp4";


const Rapidscat = () => {
  return (
    <>
      <section className="bg-primary">
        <div className="container ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div data-aos="zoom-in">
            <video
                src={bevv1}
                alt="Rapidscat Video"
                className="w-full sm:w-[80%] mx-auto max-h-[350px] object-cover"
                autoPlay
                loop
                muted
              />
            </div>
            <div className="space-y-3 xl:pr-36 p-4 border-r-2 border-b-2 border-r-sky-800 border-b-sky-800 ">
              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="text-sky-800 uppercase"
              >
                Bevanda
              </p>
              <h1
                data-aos="fade-up"
                data-aos-delay="500"
                className="uppercase text-5xl"
              >
                HIGHLIGHTS
              </h1>
              <p data-aos="fade-up" data-aos-delay="700">
              Ready to party at your own place or setting with Bevanda Mobile Bar. We offer bartending services to all kinds of events where you experience the best drinks right at your venue. Unlimited cocktails, mocktails and shooters/flaming shots.
              </p>
        
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Rapidscat;