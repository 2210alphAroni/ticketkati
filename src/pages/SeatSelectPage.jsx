import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { generateSeatMap, PLACES } from '../utils/data';
import toast from 'react-hot-toast';
import './SeatSelectPage.css';

const SeatSelectPage = () => {
  const { selectedBus, searchParams, selectedSeats, toggleSeat, getTotalAmount } = useBooking();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(selectedBus?.schedule?.[0] || '');

  const seatMap = useMemo(() => selectedBus ? generateSeatMap(selectedBus.totalSeats) : [], [selectedBus]);

  const fromPlace = PLACES.find(p => p.id === searchParams.from);
  const toPlace = PLACES.find(p => p.id === searchParams.to);

  if (!selectedBus) {
    navigate('/search');
    return null;
  }

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    if (!selectedSeats.includes(seat.number) && selectedSeats.length >= 6) {
      toast.error('Max 6 seats per booking');
      return;
    }
    toggleSeat(seat.number);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select a departure time');
      return;
    }
    navigate('/payment');
  };

  // Render seats in rows of 4 (2+aisle+2)
  const rows = [];
  for (let i = 0; i < seatMap.length; i += 4) {
    rows.push(seatMap.slice(i, i + 4));
  }

  return (
    <div className="seat-page">
      <div className="seat-page__header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/search')}>← Back</button>
          <div className="seat-page__bus-info">
            <h1 className="seat-page__bus-name">{selectedBus.name}</h1>
            <div className="seat-page__route">
              {fromPlace?.name} → {toPlace?.name} · {searchParams.date}
            </div>
          </div>
        </div>
      </div>

      <div className="container seat-page__body">
        <div className="seat-page__main">
          {/* Departure time picker */}
          <div className="card seat-page__card">
            <h3 className="seat-card__title">Select Departure Time</h3>
            <div className="time-grid">
              {selectedBus.schedule.map(t => (
                <button
                  key={t}
                  className={`time-btn ${selectedTime === t ? 'active' : ''}`}
                  onClick={() => setSelectedTime(t)}
                >
                  🕐 {t}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Map */}
          <div className="card seat-page__card">
            <h3 className="seat-card__title">Select Seats</h3>

            {/* Legend */}
            <div className="seat-legend">
              <span className="seat-legend__item"><span className="seat-dot seat-dot--available"></span> Available</span>
              <span className="seat-legend__item"><span className="seat-dot seat-dot--selected"></span> Selected</span>
              <span className="seat-legend__item"><span className="seat-dot seat-dot--booked"></span> Booked</span>
            </div>

            {/* Bus visual */}
            <div className="bus-diagram">
              <div className="bus-diagram__front">
                <span className="bus-diagram__steering">🚗</span>
                <span className="bus-diagram__driver">Driver</span>
              </div>

              <div className="bus-diagram__seats">
                {rows.map((row, ri) => (
                  <div key={ri} className="seat-row">
                    <span className="seat-row__num">{ri + 1}</span>
                    <div className="seat-row__left">
                      {row.slice(0, 2).map(seat => (
                        <button
                          key={seat.id}
                          className={`seat ${seat.status === 'booked' ? 'seat--booked' : selectedSeats.includes(seat.number) ? 'seat--selected' : 'seat--available'}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'booked'}
                          title={`Seat ${seat.number}`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <div className="seat-row__aisle"></div>
                    <div className="seat-row__right">
                      {row.slice(2, 4).map(seat => (
                        <button
                          key={seat.id}
                          className={`seat ${seat.status === 'booked' ? 'seat--booked' : selectedSeats.includes(seat.number) ? 'seat--selected' : 'seat--available'}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'booked'}
                          title={`Seat ${seat.number}`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bus-diagram__back">🏁 Rear</div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="seat-summary">
          <div className="card seat-summary__card">
            <h3 className="seat-card__title">Booking Summary</h3>

            <div className="summary-item">
              <span>Bus</span>
              <span>{selectedBus.name}</span>
            </div>
            <div className="summary-item">
              <span>Route</span>
              <span>{fromPlace?.name} → {toPlace?.name}</span>
            </div>
            <div className="summary-item">
              <span>Date</span>
              <span>{searchParams.date}</span>
            </div>
            <div className="summary-item">
              <span>Departure</span>
              <span>{selectedTime || 'Not selected'}</span>
            </div>
            <div className="summary-item">
              <span>Type</span>
              <span><span className={`badge badge-${selectedBus.type === 'AC' ? 'green' : 'red'}`}>{selectedBus.type}</span></span>
            </div>

            <div className="divider" />

            <div className="summary-item">
              <span>Selected Seats</span>
              <span className="summary-seats">
                {selectedSeats.length > 0 ? selectedSeats.map(s => <span key={s} className="summary-seat-tag">{s}</span>) : <span className="text-muted">None</span>}
              </span>
            </div>

            <div className="summary-item">
              <span>Price per Seat</span>
              <span>৳{selectedBus.perSeatPrice.toLocaleString()}</span>
            </div>

            <div className="summary-item summary-total">
              <span>Total</span>
              <span className="summary-total__amount">৳{getTotalAmount().toLocaleString()}</span>
            </div>

            <button
              className="btn btn-primary seat-proceed-btn"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Payment →
            </button>

            <div className="seat-note">
              ✅ Free cancellation up to 2 hours before departure
            </div>
          </div>

          {/* Amenities */}
          <div className="card seat-summary__card" style={{marginTop: 16}}>
            <h3 className="seat-card__title">Amenities</h3>
            <div className="amenities-list">
              {selectedBus.amenities.map(a => (
                <div key={a} className="amenity-item">✓ {a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectPage;
