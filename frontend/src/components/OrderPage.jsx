import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderPage.css"; // Import CSS file

const OrderPage = () => {
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState({
    pax: "150 pax",
    price: 29500,
  });

  const packages = [
    { pax: "50 pax", price: 15000 },
    { pax: "100 pax", price: 22000 },
    { pax: "150 pax", price: 29500 },
    { pax: "200 pax", price: 37000 },
  ];

  const handlePackageChange = (event) => {
    const selected = packages.find((pkg) => pkg.pax === event.target.value);
    setSelectedPackage(selected);
  };

  const handleConfirm = () => {
    navigate("/first/booking", { state: { selectedPackage } });

  };

  return (
    <div className="order-container">
      <div className="order-card">
        <h2 className="order-title">Unlimited Package</h2>

        <div className="order-content">
          <div className="menu-section">
            <p>
              <span className="menu-title">Cocktail</span> Shirley Temple, Margarita, Mojito, etc.
            </p>
            <p>
              <span className="menu-title">Mocktail</span> Cinderella, Four Seasons, Shirley Temple Supreme, etc.
            </p>
            <p>
              <span className="menu-title">Shooters</span> Dirty Shirley, Rainbow Shot, etc.
            </p>
            <p>
              <span className="menu-title">Special Requests</span> Lime Basil, Dry Martini, Manhattan, etc.
            </p>
          </div>

          <div className="package-section">
            <label className="order-label">PAX</label>
            <select className="order-select" value={selectedPackage.pax} onChange={handlePackageChange}>
              {packages.map((pkg, index) => (
                <option key={index} value={pkg.pax}>
                  {pkg.pax} - ₱{pkg.price.toLocaleString()}
                </option>
              ))}
            </select>

            <label className="order-label">PRICE</label>
            <p className="order-price">₱{selectedPackage.price.toLocaleString()}</p>

            <button className="order-button" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;