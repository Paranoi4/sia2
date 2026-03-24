import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './CourtBooking.css';

const CourtBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Generate time slots from 6:00 AM to 10:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      const time = hour < 12 ? `${hour}:00 AM` : hour === 12 ? `12:00 PM` : `${hour - 12}:00 PM`;
      const endHour = hour + 1;
      const endTime = endHour < 12 ? `${endHour}:00 AM` : endHour === 12 ? `12:00 PM` : `${endHour - 12}:00 PM`;
      slots.push(`${time} - ${endTime}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const courts = ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5', 'Court 6', 'Court 7', 'Court 8'];

  // Mock data for slot availability
  const getSlotStatus = (court, timeIndex) => {
    const random = Math.random();
    if (timeIndex >= 13 && timeIndex <= 15) return 'open-play'; // 7-9 PM open play
    if (random < 0.3) return 'booked';
    if (random < 0.4) return 'waiting';
    return 'available';
  };

  const handleSlotClick = (court, time, status) => {
    if (status === 'available') {
      setSelectedSlot(`${court}-${time}`);
    }
  };

  const handleBookNow = () => {
    if (selectedSlot) {
      navigate('/first/booking');
    } else {
      alert('Please select an available time slot first!');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="court-booking">
      {/* Header */}
      <header className="court-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={logo} alt="Bevanda Logo" className="header-logo" />
            <span className="brand-name">Bevanda</span>
          </div>
          <nav className="header-nav">
            <button onClick={() => navigate('/landing-page')}>Home</button>
            <button onClick={() => navigate('/admin')}>Admin</button>
            <button>About</button>
            <button>Contact</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="booking-container">
        <div className="booking-sidebar">
          <h2 className="booking-title">Grab a Court</h2>
          <p className="booking-subtitle">Choose when you want to play</p>
          
          <div className="date-picker-section">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="date-input"
            />
            <div className="selected-date">
              {formatDate(selectedDate)}
            </div>
          </div>

          <div className="legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="legend-color waiting"></div>
              <span>Waiting List</span>
            </div>
            <div className="legend-item">
              <div className="legend-color booked"></div>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-color open-play"></div>
              <span>Open Play</span>
            </div>
          </div>

          {selectedSlot && (
            <button className="book-now-btn" onClick={handleBookNow}>
              Book Selected Slot
            </button>
          )}
        </div>

        <div className="courts-grid-container">
          <div className="courts-grid">
            {/* Time column header */}
            <div className="time-header">Time</div>
            
            {/* Court headers */}
            {courts.map(court => (
              <div key={court} className="court-header-cell">
                {court}
              </div>
            ))}

            {/* Time slots and court availability */}
            {timeSlots.map((time, timeIndex) => (
              <React.Fragment key={time}>
                <div className="time-slot">{time}</div>
                {courts.map(court => {
                  const status = getSlotStatus(court, timeIndex);
                  const slotId = `${court}-${time}`;
                  const isSelected = selectedSlot === slotId;
                  
                  return (
                    <div
                      key={slotId}
                      className={`court-slot ${status} ${isSelected ? 'selected-slot' : ''}`}
                      onClick={() => handleSlotClick(court, time, status)}
                    >
                      {status === 'open-play' && (
                        <span className="open-play-text">OPEN PLAY</span>
                      )}
                      {status === 'waiting' && (
                        <span className="waiting-text">Join Waitlist</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtBooking;