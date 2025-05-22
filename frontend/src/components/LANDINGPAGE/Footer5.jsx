import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdCall, MdMessage } from "react-icons/md";
import logo from "../../assets/logo.jpg";

const Footer = () => {
  return (
    <div className="bg-[#0a192f] "> {/* Dark Blue Background */}
      <section className="max-w-[1200px] mx-auto text-white py-8 px-4">
        <div className="grid md:grid-cols-2 py-5">
          
          {/* About Section */}
          <div className="flex flex-col items-start space-y-4">
            <img src={logo} alt="Bevanda Logo" className="w-40 h-auto mb-4" />
            <p className="text-gray-300 text-sm max-w-md">
              Your premier mobile bar experience, serving handcrafted cocktails, premium beverages, 
              and unforgettable moments at every event!
            </p>
          </div>

          {/* Contact Us Section */}
          <div>
            <h1 className="sm:text-xl text-xl font-bold mb-3 text-white  ">Contact Us</h1>
            <div className="flex flex-col gap-3 text-gray-300">
              <div className="flex items-center gap-3">
                <HiLocationMarker className="text-white" />
                <p>Davao City</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <MdMessage className="text-white" />
                <p>jassynarciso@gmail.com</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <MdCall className="text-white" />
                <p>+91 9277709812</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="flex justify-between items-center text-center py-6 border-t-2 border-gray-300/40">
            
            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <a href="#" className="hover:text-sky-400">
                <FaInstagram className="text-4xl" />
              </a>
              <a href="https://www.facebook.com/bevandamobilebar" className="hover:text-sky-400">
                <FaFacebook className="text-4xl" />
              </a>
            
            </div>

            {/* Links */}
            <span className="text-sm text-gray-300 ">
              <ul className="flex gap-3">
                <li className="hover:text-sky-400 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-sky-400 cursor-pointer">Terms & Conditions</li>
              </ul>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
