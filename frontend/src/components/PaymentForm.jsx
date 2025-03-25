import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentForm.css";

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
      alert("Error: Booking data is missing! Make sure you have completed the booking step.");
      console.error("🚨 Missing bookingData:", bookingData);
      return;
    }

    const formData = new FormData();
    formData.append("booking_id", bookingData.id);  // ✅ Ensure we're sending the correct booking ID
    formData.append("payment_method", paymentMethod);
    formData.append("receipt", receipt);

    console.log("📤 Submitting Payment Data:", Object.fromEntries(formData.entries())); // ✅ Debugging Log

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://127.0.0.1:8000/api/payments/", formData, {
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
    <div className="payment-container">
      <div className="payment-box">
        <h2 className="payment-title">Payment</h2>

        {/* Payment Details (Side by Side Layout) */}
        <div className="payment-details">
          {/* Payment Options */}
          <div className="payment-options">
            <h3>Payment Options:</h3>
            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="GCASH" onChange={(e) => setPaymentMethod(e.target.value)} />
                GCASH - Jassy Angeli N. Suarez (09096300880)
              </label>
              <img src="/gcash-logo.png" alt="GCASH" />
            </div>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="BPI" onChange={(e) => setPaymentMethod(e.target.value)} />
                BPI - 0109046146 (Jassy Angeli N. Suarez)
              </label>
              <img src="/bpi-logo.png" alt="BPI" />
            </div>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="METROBANK" onChange={(e) => setPaymentMethod(e.target.value)} />
                METROBANK - 7983838790624 (Jassy Angeli N. Suarez)
              </label>
              <img src="/metrobank-logo.png" alt="Metrobank" />
            </div>

            <div className="payment-method">
              <label>
                <input type="radio" name="paymentMethod" value="PNB" onChange={(e) => setPaymentMethod(e.target.value)} />
                PNB Passbook - 401710007695 (Jassy Angeli N. Suarez)
              </label>
              <img src="/pnb-logo.png" alt="PNB" />
            </div>
          </div>

          {/* Order Details (Right Side) */}
          <div className="order-details">
            <h3>Order Details:</h3>
            <p><strong>Event Type:</strong> {bookingData?.event_type}</p>
            <p><strong>PAX:</strong> {bookingData?.pax}</p>
            <p><strong>Price:</strong> ₱{bookingData?.price?.toLocaleString()}</p>
            <p><strong>Event Date:</strong> {bookingData?.event_date}</p>
          </div>
        </div>

        {/* Upload Receipt */}
        <div className="upload-container">
          <h3>Please Upload File as Your Proof of Payment</h3>
          <label className="upload-button">
            Upload Receipt
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {receipt && <span className="upload-success">✔</span>}
        </div>

        {/* Confirm Payment Button */}
        <button className="confirm-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "CONFIRM"}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;