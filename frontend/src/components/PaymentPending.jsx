import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentPending.css";



const PaymentPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  useEffect(() => {
    if (!bookingData || !bookingData.id) {
      alert("No booking data found. Redirecting to home.");
      navigate("/");
    }
  }, [bookingData, navigate]);

  return (
    <div className="pending-container">
      <h2>⏳ Your Payment is Now in Process</h2>
      <p>
        We will email you back today regarding the status of your payment.
        For now, just sit back and relax.
      </p>
      <p>
        For more information, feel free to contact us:
        <br />
        📞 Tel: <strong>0945-776-588</strong>
        <br />
        📱 Cell: <strong>0909-630-0880</strong>
        <br />
        💬 Facebook:{" "}
        <a href="https://m.me/yourpage" target="_blank" rel="noreferrer">
          m.me/yourpage
        </a>
      </p>
      <button onClick={() => navigate("/landing-page")}>Back to Home</button>
    </div>
  );
};

export default PaymentPending;