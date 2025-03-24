import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css"; // ✅ Ensure this CSS file exists

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.selectedPackage || null;

  // ✅ Redirect if no package was selected (user refreshed without ordering)
  useEffect(() => {
    if (!selectedPackage) {
      alert("You must select a package first!");
      navigate("/"); // Redirect back to Step 1 (Order Page)
    }
  }, [selectedPackage, navigate]);

  // ✅ If no package, stop rendering (prevents errors)
  if (!selectedPackage) return null;

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
    pax: selectedPackage ? parseInt(selectedPackage.pax, 10) : 0,  // ✅ Convert to integer
    price: selectedPackage ? parseFloat(selectedPackage.price) : 0,  // ✅ Convert to float
  });

  const [errors, setErrors] = useState({});
  const [redDates, setRedDates] = useState([]); // Customer booked (Red)
  const [greyDates, setGreyDates] = useState([]); // Admin blocked (Grey)

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/unavailable-dates/");
        if (response.data) {
          console.log("Customer unavailable dates (Red):", response.data.customer_unavailable_dates);
          console.log("Admin unavailable dates (Grey):", response.data.admin_unavailable_dates);

          // ✅ Convert backend date strings into Date objects
          setRedDates(response.data.customer_unavailable_dates.map(date => new Date(date + "T00:00:00"))); // ✅ Ensures correct day
          setGreyDates(response.data.admin_unavailable_dates.map(date => new Date(date + "T00:00:00"))); // ✅ Fixes next-day shift issue
        }
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      }
    };

    fetchUnavailableDates();
}, []);
  // ✅ Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Update selected event date
  const handleDateChange = (date) => {
    setFormData({ ...formData, event_date: date, available_time: "" });
  };

  // ✅ Validate before submitting
  const validateForm = () => {
    let newErrors = {};

    if (!formData.event_date) {
      newErrors.event_date = "Please select a date.";
    }
    if (!formData.available_time) {
      newErrors.available_time = "Please select an available time.";
    }
    if (!formData.contact_number_venue.trim()) {
      newErrors.contact_number_venue = "Contact number (venue) is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Booking Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails

    const formattedDate = formData.event_date ? formData.event_date.toISOString().split("T")[0] : null;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/bookings/", {
        ...formData,
        event_date: formattedDate, // ✅ Ensure correct date format
      });

      alert("Booking confirmed! Proceed to Payment.");

      // ✅ Start 20-minute countdown for payment
      setTimeout(() => {
        axios.delete("http://127.0.0.1:8000/api/cleanup-expired-bookings/")
          .then(() => console.log("Expired bookings cleaned up"))
          .catch((err) => console.error("Error cleaning up:", err));
      }, 20 * 60 * 1000); // 20 minutes

      // ✅ Redirect to Payment Page
      navigate("/first/payment", { state: { bookingData: response.data } });


    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Error: " + JSON.stringify(error.response?.data || "An error occurred"));
    }
  };
  const handleTimeChange = (e) => {
    setFormData({ ...formData, available_time: e.target.value });
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
              {errors.first_name && <p className="error-text">{errors.first_name}</p>}

              <label className="booking-label">Last Name*</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="booking-input" />
              {errors.last_name && <p className="error-text">{errors.last_name}</p>}

              <label className="booking-label">Phone Number*</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="booking-input" />
              {errors.phone_number && <p className="error-text">{errors.phone_number}</p>}

              <label className="booking-label">Email Address*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="booking-input" />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <label className="booking-label">Address*</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="booking-input" />
            </div>

            <div className="booking-group">
              <h3 className="booking-section-title">Event Details</h3>

              <label className="booking-label">Event Type*</label>
              <input type="text" name="event_type" value={formData.event_type} onChange={handleChange} required className="booking-input"/>

              <label className="booking-label">Venue Address*</label>
              <input type="text" name="venue_address" value={formData.venue_address} onChange={handleChange} required className="booking-input"/>

              <label className="booking-label">PAX</label>
              <p className="booking-summary-text">{formData.pax}</p>

              <label className="booking-label">PRICE</label>
              <p className="booking-summary-text">₱{formData.price.toLocaleString()}</p>

              <label className="booking-label">Event Date*</label>
              <DatePicker
                selected={formData.event_date}
                onChange={(date) => setFormData({ ...formData, event_date: date, available_time: "" })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                className="booking-date-picker"
                excludeDates={[...redDates, ...greyDates]} // Prevents selection of booked & unavailable dates
                filterDate={(date) => {
                  const dateString = date.toISOString().split("T")[0]; // ✅ Convert date format

                  return !(
                    redDates.some(d => d.toISOString().split("T")[0] === dateString) ||
                    greyDates.some(d => d.toISOString().split("T")[0] === dateString)
                  ); // ✅ Fixes off-by-one day error
                }}
                dayClassName={(date) => {
                  const dateString = date.toISOString().split("T")[0];

                  if (redDates.some(d => d.toISOString().split("T")[0] === dateString)) {
                    return "red-date"; // ✅ Customer booked (Red)
                  }

                  if (greyDates.some(d => d.toISOString().split("T")[0] === dateString)) {
                    return "grey-date"; // ✅ Admin unavailable (Grey)
                  }

                  return null;
                }}
              />


              <label className="booking-label">Contact Number (Venue)*</label>
                <input type="text" name="contact_number_venue" value={formData.contact_number_venue} onChange={handleChange} required className="booking-input" />
                {errors.contact_number_venue && <p className="error-text">{errors.contact_number_venue}</p>}

                <label className="booking-label">Available Time*</label>
              <select 
                  name="available_time" 
                  value={formData.available_time} 
                  onChange={handleTimeChange}  // ✅ Fix here by using the newly added function
                  required 
                  className="booking-select"
              >
                  <option value="">Select Time</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
          </div>

          <button type="submit" className="booking-submit-button">CONFIRM</button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;