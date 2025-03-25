import "./PaymentSuccess.css"; // ✅ Add CSS file for styling
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <h2>🎉 Payment Approved!</h2>
      <p>Your booking has been successfully confirmed. Thank you for choosing us!</p>
      <button onClick={() => navigate("/landing-page")}>Back to Home</button>
    </div>
  );
};

export default PaymentSuccess;