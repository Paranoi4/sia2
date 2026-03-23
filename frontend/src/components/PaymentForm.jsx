import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentForm.css";

// ✅ Import payment images from src/assets
import gcash from "../assets/gcash.jpg";
import bpi from "../assets/bpi.jpg";
import metro from "../assets/metro.jpg";
import pnb from "../assets/pnb.png";
import backgroundImage from "../assets/1113bg.png"; // ✅ Add this

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!bookingData) {
    alert("No booking data found. Redirecting to home.");
    navigate("/");
    return null;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      setReceipt(null);
      return;
    }
    setReceipt(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod || !receipt) {
      alert("Please select a payment method and upload a receipt.");
      return;
    }

    if (!bookingData || !bookingData.id) {
      alert("Error: Booking data is missing!");
      console.error("🚨 Missing bookingData:", bookingData);
      return;
    }

    const formData = new FormData();
    formData.append("booking_id", bookingData.id);
    formData.append("payment_method", paymentMethod);
    formData.append("receipt", receipt);

    console.log("📤 Submitting Payment Data:", Object.fromEntries(formData.entries()));

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://192.168.254.101:8000/api/payments/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Payment Submission Response:", response.data);
      alert("✅ Payment submitted successfully!");
      navigate("/first/payment-pending", { state: { bookingData } });

    } catch (error) {
      console.error("🚨 Payment submission error:", error.response?.data);
      alert("Error: " + JSON.stringify(error.response?.data || "An error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
    className="payment-container relative bg-cover bg-center overflow-hidden"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black to-transparent z-20" />
    <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-black to-transparent z-20" />
    <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-20" />
    <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-20" />
      <div className="payment-box">
        <h2 className="payment-title text-white">Payment form</h2>

        <div className="payment-details">
          <div className="payment-options">
            <h3>Payment Options:</h3>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="GCASH" onChange={(e) => setPaymentMethod(e.target.value)} />
                GCASH - Jassy Angeli N. Suarez (09096300880)
              </label>
              <img src={gcash} alt="GCASH" />
            </div>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="BPI" onChange={(e) => setPaymentMethod(e.target.value)} />
                BPI - 0109046146 (Jassy Angeli N. Suarez)
              </label>
              <img src={bpi} alt="BPI" />
            </div>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="METROBANK" onChange={(e) => setPaymentMethod(e.target.value)} />
                METROBANK - 7983838790624 (Jassy Angeli N. Suarez)
              </label>
              <img src={metro} alt="Metrobank" />
            </div>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="PNB" onChange={(e) => setPaymentMethod(e.target.value)} />
                PNB Passbook - 401710007695 (Jassy Angeli N. Suarez)
              </label>
              <img src={pnb} alt="PNB" />
            </div>
          </div>

          <div className="order-details">
            <h3>Order Details:</h3>
            <p><strong>Event Type:</strong> {bookingData?.event_type}</p>
            <p><strong>PAX:</strong> {bookingData?.pax}</p>
            <p><strong>Price:</strong> ₱{bookingData?.price?.toLocaleString()}</p>
            <p><strong>Event Date:</strong> {bookingData?.event_date}</p>
          </div>
        </div>

        <div className="upload-container">
          <h3>Please Upload File as Your Proof of Payment</h3>
          <label className="upload-button">
            Upload Receipt
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {receipt && <span className="upload-success">✔</span>}
        </div>

        <button className="confirm-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "CONFIRM"}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
