import React from "react";
import { Link } from "react-router-dom";
import "./PaymentSuccess.css"; // ✅ Add CSS file for styling

const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <h1>🎉 Payment Successful! 🎉</h1>
      <p>Thank you for your payment. Your booking is now confirmed.</p>
      
      <Link to="/landing-page" className="home-button">Go to Home</Link>

    </div>
  );
};

export default PaymentSuccess;