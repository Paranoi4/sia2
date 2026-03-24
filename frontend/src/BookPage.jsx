import React from "react";
import { Routes, Route } from "react-router-dom";

import BookingForm from "./components/BookingForm";
import PaymentForm from "./components/PaymentForm"; // ✅ Import Payment Page
import PaymentPending from "./components/PaymentPending";// JUST ADDED 
import ManagePayments from "./components/Admin/ManagePayments";  // ✅ Ensure this path is correct

const BookPage = () => {
  return (
   
      <Routes>
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/payment" element={<PaymentForm />} /> {/* ✅ Ensure this exists */}
        <Route path="/payment-pending" element={<PaymentPending />} /> {/* ✅ 4:31 ADDED */}
        <Route path="payments" element={<ManagePayments />} />

      </Routes>

  );
};

export default BookPage;