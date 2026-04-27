import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderPage.css";
import axios from "axios";
import backgroundImage from "../assets/1113bg.png"; // ✅ Imported background image

const OrderPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [drinkCategories, setDrinkCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowDropdown(false);
  };

  useEffect(() => {
    axios.get("http://192.168.254.154:8000/api/packages/")
      .then((res) => {
        const available = res.data.filter((pkg) => pkg.available);
        setPackages(available);
        setSelectedPackage(available[0] || null);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch packages:", err);
      });
  }, []);

  useEffect(() => {
    axios.get("http://192.168.254.154:8000/api/drink-categories/")
      .then((res) => setDrinkCategories(res.data))
      .catch((err) => console.error("Failed to load drink categories", err));
  }, []);

  const handleConfirm = () => {
    if (!selectedPackage) return;
    navigate("/first/booking", { state: { selectedPackage } });
  };

  if (!selectedPackage) {
    return <div className="text-center text-lg mt-10 text-white">Loading packages...</div>;
  }

  return (
    <div
      className="order-container relative bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🌫 Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-[60px] sm:h-[80px] bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[60px] sm:h-[80px] bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 h-full w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* 🧾 Order Card Content */}
      <div className="order-card relative z-30">
        <h2 className="order-title">Unlimited Package</h2>

        <div className="order-content">
          <div className="menu-section space-y-4 mb-6">
            {drinkCategories.map((category) => (
              <div key={category.id}>
                <h3 className="text-lg font-semibold text-yellow-400">{category.name}</h3>
                <p className="text-gray-300">{category.items}</p>
              </div>
            ))}
          </div>

          {/* 📦 Package Selector and Price */}
          <div className="package-section w-full max-w-xs mx-auto">

            <label className="order-label">PAX</label>

            {/* Custom Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full px-4 py-2 border border-yellow-400 rounded text-left bg-white text-black hover:bg-gray-100"
              >
               <div className="flex justify-between font-mono items-center">
  <span>{selectedPackage?.pax} pax</span>
  <span className="mx-4 text-gray-500">-</span>
  <span>₱{Number(selectedPackage?.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
</div>

              </button>

              {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-yellow-400 rounded shadow-lg">
                  {packages.map((pkg) => (
                    <div
                    key={pkg.id}
                    onClick={() => handleSelect(pkg)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between font-mono text-black items-center"
                  >
                    <span>{pkg.pax} pax</span>
                    <span className="mx-4 text-gray-500">-</span>
                    <span>₱{Number(pkg.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  ))}
                </div>
              )}
            </div>

            <label className="order-label mt-4">PRICE</label>
            <p className="order-price w-full text-center font-bold py-2 rounded bg-gray-800 text-white">
  ₱{Number(selectedPackage?.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
</p>


            <button className="order-button mt-4" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
