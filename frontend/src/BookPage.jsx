import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderPage from "./components/OrderPage";
import BookingForm from "./components/BookingForm";
import PaymentForm from "./components/PaymentForm"; // ✅ Import Payment Page
import PaymentSuccess from "./components/PaymentSuccess"; // ✅ Import PaymentSuccess component

const BookPage = () => {
  return (
   
      <Routes>
        <Route index element={<OrderPage />} /> {/* /first */}
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/payment" element={<PaymentForm />} /> {/* ✅ Ensure this exists */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>

  );
};

export default BookPage;