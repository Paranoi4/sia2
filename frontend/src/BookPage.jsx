import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderPage from "./components/OrderPage";
import BookingForm from "./components/BookingForm";
import PaymentForm from "./components/PaymentForm"; // ✅ Import Payment Page
import PaymentPending from "./components/PaymentPending";// JUST ADDED 
import ManagePayments from "./components/Admin/ManagePayments";  // ✅ Ensure this path is correct
import ManagePackages from "./components/Admin/ManagePackages";

const BookPage = () => {
  return (
   
      <Routes>
        <Route index element={<OrderPage />} /> {/* /first */}
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/payment" element={<PaymentForm />} /> {/* ✅ Ensure this exists */}
        <Route path="/payment-pending" element={<PaymentPending />} /> {/* ✅ 4:31 ADDED */}
        <Route path="payments" element={<ManagePayments />} />
        <Route path="packages" element={<ManagePackages />} />

      </Routes>

  );
};

export default BookPage;
