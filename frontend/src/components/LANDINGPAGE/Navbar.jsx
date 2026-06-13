import React from "react";
import logo from "../../assets/logo.jpg";

const Navbar = () => {
  return (
    <>
      <nav
        data-aos="fade-down"
        className="fixed top-0 right-0 w-full z-50 bg-green/10 backdrop-blur-sm py-4 sm:py-0"
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-white font-bold text-2xl">
               <img
                  src={logo}
                  alt="Bevanda Logo"
                  className="w-10 h-10 rounded-full border-1 border-white-400 shadow-md object-cover" />
              <span>Bevanda Mobile Bar</span>
            </div>
            <div className="text-white hidden sm:block">
              <ul className="flex items-center gap-6 text-xl py-4 ">
                <li>
                <a
  href="https://www.facebook.com/bevandamobilebar"
  target="_blank"
  rel="noopener noreferrer"
>
  Facebook
</a>

                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
