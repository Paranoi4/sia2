import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentForm.css"; // ✅ Ensure the CSS file exists

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {}; // Retrieve booking details

  const [paymentMethod, setPaymentMethod] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  // ✅ Redirect if bookingData is missing
  if (!bookingData) {
    alert("No booking data found. Redirecting to home.");
    navigate("/");
    return null;
  }

  // ✅ Validate file before uploading
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, etc.).");
      setReceipt(null); // Reset file
      return;
    }
    setReceipt(file);
  };
//HANDLE SUBMIT
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
    formData.append("booking_id", bookingData.id); // ✅ Ensure booking ID is sent
    formData.append("payment_method", paymentMethod);
    formData.append("receipt", receipt);

    console.log("📤 Submitting Payment:", Object.fromEntries(formData.entries())); // ✅ Debugging log

    try {
        setIsSubmitting(true);
        const response = await axios.post("http://127.0.0.1:8000/api/payments/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        alert("✅ Payment submitted successfully!");
        navigate("/first/payment-success"); // ✅ Redirect to success page

    } catch (error) {
        console.error("🚨 Payment submission error:", error.response?.data);
        alert("Error: " + JSON.stringify(error.response?.data || "An error occurred"));
    } finally {
        setIsSubmitting(false);
    }
};




  return (
    <div className="payment-container">
      <h2 className="payment-title">Payment</h2>

      <div className="payment-content">
        {/* Payment Options */}
        <div className="payment-options">
          <h3>Payment Options:</h3>
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="GCASH"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            GCASH - Jassy Angeli N. Suarez (09096300880)
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="BPI"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            BPI - 0109046146 (Jassy Angeli N. Suarez)
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="METROBANK"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            METROBANK - 7983838790624 (Jassy Angeli N. Suarez)
          </label>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <h3>Order Details:</h3>
          <p><strong>Event Type:</strong> {bookingData?.event_type}</p>
          <p><strong>PAX:</strong> {bookingData?.pax}</p>
          <p><strong>Price:</strong> ₱{bookingData?.price?.toLocaleString()}</p>
          <p><strong>Event Date:</strong> {bookingData?.event_date}</p>
        </div>
      </div>

      {/* Upload Receipt */}
      <div className="receipt-upload">
        <h3>Upload Receipt</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {receipt && (
          <div className="receipt-preview">
            <img src={URL.createObjectURL(receipt)} alt="Receipt Preview" />
          </div>
        )}
      </div>

      {/* Confirm Payment Button */}
      <button
        className={`confirm-button ${isSubmitting ? "loading" : ""}`} // ✅ Add loading class
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
};

export default PaymentForm;