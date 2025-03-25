import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PendingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {}; // ✅ Correctly extract bookingData

  const [paymentStatus, setPaymentStatus] = useState("pending");

  // ✅ Ensure bookingData exists before rendering
  useEffect(() => {
    if (!bookingData || !bookingData.id) {
      alert("No booking data found. Redirecting to home.");
      navigate("/");
    }
  }, [bookingData, navigate]);

  // ✅ Check Payment Status Every 5 Seconds
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/payment-status/${bookingData.id}/`);
        setPaymentStatus(response.data.status);

        if (response.data.status === "approved") {
          alert("✅ Payment approved! Redirecting...");
          navigate("/first/payment-success");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000); // ✅ Poll every 5 seconds
    return () => clearInterval(interval);
  }, [bookingData, navigate]);

  return (
    <div className="pending-container">
      <h2>⏳ Waiting for Admin Approval...</h2>
      <p>Please wait while the admin verifies your payment.</p>
    </div>
  );
};

export default PendingPayment;