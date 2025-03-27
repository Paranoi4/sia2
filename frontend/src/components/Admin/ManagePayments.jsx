import { useEffect, useState } from "react";
import axios from "axios";
import "./ManagePayments.css";

const ITEMS_PER_PAGE = 6;

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllPayments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/payments/");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const fetchPaymentDetails = async (paymentId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/payments/${paymentId}/`);
      setSelectedPayment(response.data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleApproval = async (paymentId, action) => {
    const confirmMessage =
      action === "approve"
        ? "✅ Are you sure you want to APPROVE this payment?"
        : "⚠️ Are you sure you want to DENY this payment?";
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/approve-payment/${paymentId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Action completed successfully!");
        setSelectedPayment(null);
        fetchAllPayments();
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to connect to server.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved": return "status-approved";
      case "pending": return "status-pending";
      case "denied": return "status-denied";
      default: return "";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="manage-payments-container">
      <h2>📄 View Payments</h2>

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <>
          <table className="payments-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Event Date</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{`${payment.booking.first_name} ${payment.booking.last_name}`}</td>
                  <td>{payment.payment_method}</td>
                  <td className={getStatusClass(payment.status)}>{payment.status}</td>
                  <td>{payment.booking.event_date}</td>
                  <td>{new Date(payment.created_at).toLocaleString()}</td>
                  <td>
                    <button className="view-btn" onClick={() => fetchPaymentDetails(payment.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}

      {/* Payment Details */}
      {selectedPayment && (
        <div className="payment-details">
          <h3>🧾 Payment Details</h3>
          <div className="payment-info-grid">
            <p><strong>Name:</strong> {`${selectedPayment.booking.first_name} ${selectedPayment.booking.last_name}`}</p>
            <p><strong>Email:</strong> {selectedPayment.booking.email}</p>
            <p><strong>Phone:</strong> {selectedPayment.booking.phone_number}</p>
            <p><strong>Method:</strong> {selectedPayment.payment_method}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={getStatusClass(selectedPayment.status)}>
                {selectedPayment.status}
              </span>
            </p>
            <p><strong>Submitted:</strong> {new Date(selectedPayment.created_at).toLocaleString()}</p>
            <p><strong>Event Date:</strong> {selectedPayment.booking.event_date}</p>
            {selectedPayment.receipt && (
              <p className="receipt-link">
                <strong>Receipt:</strong>{" "}
                <a
                  href={`http://127.0.0.1:8000${selectedPayment.receipt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Receipt
                </a>
              </p>
            )}
          </div>

          {selectedPayment.status === "pending" && (
            <div>
              <button className="approve-btn" onClick={() => handleApproval(selectedPayment.id, "approve")}>
                Approve
              </button>
              <button className="deny-btn" onClick={() => handleApproval(selectedPayment.id, "deny")}>
                Deny
              </button>
            </div>
          )}

          <button className="close-btn" onClick={() => setSelectedPayment(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;