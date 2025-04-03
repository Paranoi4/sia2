import { useEffect, useState } from "react";
import axios from "axios";
import "./ManagePayments.css";

const ITEMS_PER_PAGE = 6;

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [greenDates, setGreenDates] = useState(() => {
    const storedGreenDates = JSON.parse(sessionStorage.getItem("greenDates")) || [];
    return storedGreenDates;
});

const fetchAllPayments = async () => {
  try {
      const response = await axios.get("http://127.0.0.1:8000/api/payments/");
      setPayments(response.data); // Retrieve all payments, including denied ones
  } catch (error) {
      console.error("Error fetching payments:", error);
  } finally {
      setLoading(false);
  }
};

  useEffect(() => {
    fetchAllPayments();
  }, []);

  useEffect(() => {
    console.log("Green Dates currently saved:", greenDates);

    // If you want to update something on the UI based on greenDates
    if (greenDates.length > 0) {
        console.log("Green Dates present:", greenDates.join(", "));
    }
}, [greenDates]); 

const fetchPaymentDetails = async (paymentId) => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/api/payments/${paymentId}/`);
      if (response.status === 200) {
          setSelectedPayment(response.data); // This ensures you can view denied payments too
      } else {
          alert("Failed to fetch payment details.");
      }
  } catch (error) {
      console.error("Error fetching payment details:", error);
      alert("Something went wrong while fetching payment details.");
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

          if (action === "deny" && data.freed_date) {  
              const deniedDate = data.freed_date;

              setGreenDates(prev => {
                  const updatedDates = prev.filter(date => date !== deniedDate);  // ✅ Remove denied date
                  sessionStorage.setItem("greenDates", JSON.stringify(updatedDates));  // ✅ Save to session storage
                  return updatedDates;
              });

              console.log(`📅 Date ${data.freed_date} has been removed from the calendar.`);
          }
      } else {
          alert(data.error || "Something went wrong.");
      }
  } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to connect to server.");
  }
};

const handleDelete = async (paymentId) => {
  const confirmed = window.confirm("❌ Are you sure you want to DELETE this payment record? This action cannot be undone.");
  if (!confirmed) return;

  try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/payments/${paymentId}/`);
      if (response.status === 200) {
          alert("Payment record deleted successfully.");
          fetchAllPayments();  // Refresh the payments list after deletion
      } else {
          alert("Failed to delete payment record.");
      }
  } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Something went wrong while deleting the payment.");
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
      <h2>📄 View & Manage Payments</h2>

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
                    <button className="view-btn" onClick={() => fetchPaymentDetails(payment.id)}>View</button>
                    <button className="delete-btn" onClick={() => handleDelete(payment.id)}>Delete</button>
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