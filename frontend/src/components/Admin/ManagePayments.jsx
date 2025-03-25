import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManagePayments.css";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleApproval = async (paymentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/approve-payment/${paymentId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve" }),
      });
  
      let data = {};
      try {
        data = await response.json();
      } catch {
        data.message = "No message returned from server.";
      }
  
      if (response.ok) {
        alert(data.message);
        setSelectedPayment(null);
        const updated = await axios.get("http://127.0.0.1:8000/api/payments/");
        setPayments(updated.data);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to connect to server.");
    }
  };
  

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/payments/")
      .then(response => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching payments:", error);
        setLoading(false);
      });
  }, []);

  const fetchPaymentDetails = async (paymentId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/payments/${paymentId}/`);
      setSelectedPayment(response.data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  return (
    <div className="manage-payments-container">
      <h2>📄 View Payments</h2>

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <table className="payments-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{`${payment.booking.first_name} ${payment.booking.last_name}`}</td>
                <td>{payment.payment_method}</td>
                <td className={payment.status === "approved" ? "status-approved" : "status-pending"}>
                  {payment.status}
                </td>
                <td>{new Date(payment.created_at).toLocaleString()}</td>
                <td>
                  <button className="view-btn" onClick={() => fetchPaymentDetails(payment.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Payment Details Section */}
      {selectedPayment && (
        <div className="payment-details">
          <h3>📝 Payment Details</h3>
          <p><strong>Name:</strong> {`${selectedPayment.booking.first_name} ${selectedPayment.booking.last_name}`}</p>
          <p><strong>Email:</strong> {selectedPayment.booking.email}</p>
          <p><strong>Phone:</strong> {selectedPayment.booking.phone_number}</p>
          <p><strong>Method:</strong> {selectedPayment.payment_method}</p>
          <p><strong>Status:</strong> <span className={selectedPayment.status === "approved" ? "status-approved" : "status-pending"}>
            {selectedPayment.status}
          </span></p>
          <p><strong>Submitted:</strong> {new Date(selectedPayment.created_at).toLocaleString()}</p>

          {selectedPayment.receipt && (
            <p>
              <strong>Receipt:</strong> 
              <a href={`http://127.0.0.1:8000${selectedPayment.receipt}`} target="_blank" rel="noopener noreferrer">
                View Receipt
              </a>
            </p>
          )}

          {/* ✅ Approve Button for Pending Payments */}
          {selectedPayment.status === "pending" && (
            <div>
              <button className="approve-btn" onClick={() => handleApproval(selectedPayment.id)}>Approve</button>
              <button className="deny-btn" onClick={() => handleApproval(selectedPayment.id, "deny")}>Deny</button>
            
            </div>
          )}

          <button className="close-btn" onClick={() => setSelectedPayment(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;