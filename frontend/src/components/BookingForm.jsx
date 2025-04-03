import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.selectedPackage || null;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    event_type: "",
    venue_address: "",
    event_date: null,
    available_time: "",
    contact_number_venue: "",
    pax: selectedPackage ? parseInt(selectedPackage.pax, 10) : 0,
    price: selectedPackage ? parseFloat(selectedPackage.price) : 0,
  });

  const [errors, setErrors] = useState({});
  const [redDates, setRedDates] = useState([]);
  const [greyDates, setGreyDates] = useState([]);
  const [, setBookingId] = useState(null);
  const [greenDates, setGreenDates] = useState(() => {
    const storedGreenDates = JSON.parse(sessionStorage.getItem("greenDates")) || [];
    return storedGreenDates;
});


useEffect(() => {
    const storedGreenDates = JSON.parse(sessionStorage.getItem("greenDates")) || [];
    setGreenDates(storedGreenDates); // Refresh the calendar with latest green dates
}, []);

  useEffect(() => {
    if (!selectedPackage) {
      alert("You must select a package first!");
      navigate("/");
    }
  

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";

      const storedBookingId = sessionStorage.getItem("bookingId");
      if (storedBookingId) {
        axios.delete(`http://127.0.0.1:8000/api/delete-unpaid-booking/${storedBookingId}/`)
          .then(() => console.log("✅ Unpaid booking deleted successfully."))
          .catch((err) => console.error("🚨 Error deleting booking:", err));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedPackage, navigate]);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
        try {
            const { data } = await axios.get("http://127.0.0.1:8000/api/unavailable-dates/");
            
            setRedDates(data.confirmed_dates.map(date => new Date(date + "T00:00:00")));
            setGreyDates(data.admin_unavailable_dates.map(date => new Date(date + "T00:00:00")));
            
            // ✅ Load pending dates properly (without denied dates)
            const pendingDates = data.pending_dates.map(date => new Date(date + "T00:00:00"));
            setGreenDates(pendingDates);

            sessionStorage.setItem("greenDates", JSON.stringify(pendingDates));
        } catch (error) {
            console.error("Error fetching unavailable dates:", error);
        }
    };
    fetchUnavailableDates();
}, []);



  if (!selectedPackage) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    if (date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        
        setFormData(prev => ({ ...prev, event_date: formatted }));

        // ✅ Do NOT mark the date as green here. Just save the selected date in the formData.
    }
};



  const handleTimeChange = (e) => {
    setFormData(prev => ({ ...prev, available_time: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.event_date) newErrors.event_date = "Please select a date.";
    if (!formData.available_time) newErrors.available_time = "Please select an available time.";
    if (!formData.contact_number_venue.trim()) newErrors.contact_number_venue = "Contact number (venue) is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/bookings/", {
            ...formData,
            confirmed: false  // Save as pending
        });

        if (response.status === 201) {
            setBookingId(response.data.id);
            sessionStorage.setItem("bookingId", response.data.id);
            alert("Booking confirmed! Proceed to Payment.");

            // ✅ Only mark the date as green AFTER the booking is confirmed successfully.
            const selectedDate = new Date(formData.event_date + "T00:00:00");
            setGreenDates(prev => [...prev.filter(d => d.toISOString().split("T")[0] !== selectedDate.toISOString().split("T")[0]), selectedDate]);

            navigate("/first/payment", { state: { bookingData: response.data } });
        }
    } catch (error) {
        console.error("Error submitting booking:", error);
        alert("Error: " + JSON.stringify(error.response?.data || "An error occurred"));
    }
};



  
  return (
    <div className="booking-container">
      <div className="booking-form-wrapper">
        <form onSubmit={handleSubmit} className="booking-form">
          <h2 className="booking-title">Book your party with us</h2>

          <div className="booking-section">
            <div className="booking-group">
              <h3 className="booking-section-title">Customer Details</h3>

              <label className="booking-label">First Name*</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="booking-input" />

              <label className="booking-label">Last Name*</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="booking-input" />

              <label className="booking-label">Phone Number*</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="booking-input" />

              <label className="booking-label">Email Address*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="booking-input" />

              <label className="booking-label">Address*</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="booking-input" />
            </div>

            <div className="booking-group">
              <h3 className="booking-section-title">Event Details</h3>

              <label className="booking-label">Event Type*</label>
              <input type="text" name="event_type" value={formData.event_type} onChange={handleChange} required className="booking-input" />

              <label className="booking-label">Venue Address*</label>
              <input type="text" name="venue_address" value={formData.venue_address} onChange={handleChange} required className="booking-input" />

              <label className="booking-label">PAX</label>
              <p className="booking-summary-text">{formData.pax}</p>

              <label className="booking-label">PRICE</label>
              <p className="booking-summary-text">₱{formData.price.toLocaleString()}</p>

              <label className="booking-label">Event Date*</label>
              <DatePicker
                selected={formData.event_date ? new Date(formData.event_date) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                excludeDates={[...redDates, ...greyDates]}
                filterDate={(date) => {
                    const dateString = date.toISOString().split("T")[0];
                    return !(
                        redDates.some(d => d.toISOString().split("T")[0] === dateString) ||
                        greyDates.some(d => d.toISOString().split("T")[0] === dateString) ||
                        greenDates.some(d => d.toISOString().split("T")[0] === dateString)
                    );
                }}
                dayClassName={(date) => {
                    const dateString = date.toISOString().split("T")[0];
                    if (redDates.some(d => d.toISOString().split("T")[0] === dateString)) return "red-date";
                    if (greyDates.some(d => d.toISOString().split("T")[0] === dateString)) return "grey-date";
                    if (greenDates.some(d => d.toISOString().split("T")[0] === dateString)) return "green-date";
                    return null;
                }}
            />



              {errors.event_date && <p className="error-text">{errors.event_date}</p>}

              <label className="booking-label">Contact Number (Venue)*</label>
              <input type="text" name="contact_number_venue" value={formData.contact_number_venue} onChange={handleChange} required className="booking-input" />
              {errors.contact_number_venue && <p className="error-text">{errors.contact_number_venue}</p>}

              <label className="booking-label">Available Time*</label>
              <select name="available_time" value={formData.available_time} onChange={handleTimeChange} required className="booking-select">
                <option value="">Select Time</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
              {errors.available_time && <p className="error-text">{errors.available_time}</p>}
            </div>
          </div>

          <button type="submit" className="booking-submit-button">CONFIRM</button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;