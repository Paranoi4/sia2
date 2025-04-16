import img1 from "../../assets/2222.jpg";
import img2 from "../../assets/2222g.jpg";
import img3 from "../../assets/3333ggg.jpg";
import img4 from "../../assets/2222gg.jpg";
import img5 from "../../assets/3333.jpg";
import img6 from "../../assets/3333g.jpg";
import img7 from "../../assets/4444.jpg";
import img8 from "../../assets/4444g.jpg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

const Highlights = () => {
  return (
    <section className="bg-black text-white py-16 overflow-hidden relative">
      {/* 🔼 Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20" />
      {/* 🔽 Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />

      {/* 📝 Title + Message */}
      <div className="text-center mb-10 z-30 relative">
        <h2 className="text-3xl sm:text-5xl font-bold text-white">
          With Bevanda, You Create Memories with Your Loved Ones
        </h2>
        <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
          At Bevanda, we cherish what you cherish — laughter, togetherness, and unforgettable moments shared with the people who matter most.
        </p>
      </div>

      {/* 🔁 Infinite Carousel */}
      <div className="overflow-hidden relative w-full">
        <div className="flex w-max animate-marquee gap-4">
          {[...images, ...images].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`highlight-${i}`}
              className="w-[400px] h-[400px] object-cover rounded-xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
