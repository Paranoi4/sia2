import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderPage.css"; // Make sure this CSS file exists
import axios from "axios";

const OrderPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [drinkCategories, setDrinkCategories] = useState([]);

  // Fetch available packages from packages.json (or backend later)
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/packages/")

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
    axios.get("http://127.0.0.1:8000/api/drink-categories/")
      .then((res) => setDrinkCategories(res.data))
      .catch((err) => console.error("Failed to load drink categories", err));
  }, []);

  const handlePackageChange = (event) => {
    const selected = packages.find((pkg) => pkg.pax === event.target.value);
    setSelectedPackage(selected);
  };

  const handleConfirm = () => {
    if (!selectedPackage) return;
    navigate("/first/booking", { state: { selectedPackage } });
  };

  // Show loading while packages are being fetched
  if (!selectedPackage) {
    return <div className="text-center text-lg mt-10">Loading packages...</div>;
  }

  return (
    <div className="order-container">
      <div className="order-card">
        <h2 className="order-title">Unlimited Package</h2>

        <div className="order-content">
        <div className="menu-section space-y-4 mb-6">
  {drinkCategories.map((category) => (
    <div key={category.id}>
      <h3 className="text-lg font-semibold">{category.name}</h3>
      <p>{category.items}</p>
    </div>
  ))}
</div>


          <div className="package-section">
            <label className="order-label">PAX</label>
            <select
              className="order-select"
              value={selectedPackage.pax}
              onChange={handlePackageChange}
            >
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
