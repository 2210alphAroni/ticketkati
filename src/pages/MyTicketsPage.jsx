import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateTicketPDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import './MyTicketsPage.css';

const MyTicketsPage = () => {
  const { user, getBookings } = useAuth();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const bookings = getBookings();

  const handleDownload = async (booking) => {
    setDownloading(booking.bookingId);
    try {
      generateTicketPDF({
        user,
        bus: booking.bus,
        fromPlace: booking.fromPlace || { name: booking.from },
        toPlace: booking.toPlace || { name: booking.to },
        journeyDate: booking.journeyDate,
        journeyTime: booking.journeyTime,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
        paymentMethod: booking.payment?.method || booking.paymentMethod,
        transactionId: booking.payment?.transactionId || booking.transactionId,
        bookingId: booking.bookingId,
        bookedAt: booking.bookedAt,
      });
      toast.success('Ticket downloaded! 🎫');
    } catch (err) {
      toast.error('Failed to generate ticket PDF');
      console.error(err);
    }
    setDownloading(null);
  };

  return (
    <div className="tickets-page">
      <div className="tickets-page__header">
        <div className="container">
          <h1 className="tickets-page__title">🎫 My Tickets</h1>
          <p className="tickets-page__sub">Welcome, {user.name}</p>
        </div>
      </div>

      <div className="container tickets-page__body">
        {bookings.length === 0 ? (
          <div className="tickets-empty">
            <div className="tickets-empty__icon">🎫</div>
            <h3>No tickets yet</h3>
            <p>Book your first bus ticket and it will appear here</p>
            <button className="btn btn-primary" onClick={() => navigate('/search')}>
              🔍 Find a Bus
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {bookings.reverse().map((booking) => (
              <TicketCard
                key={booking.bookingId}
                booking={booking}
                onDownload={() => handleDownload(booking)}
                downloading={downloading === booking.bookingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TicketCard = ({ booking, onDownload, downloading }) => {
  const [expanded, setExpanded] = useState(false);
  const fromName = booking.fromPlace?.name || booking.from || '—';
  const toName = booking.toPlace?.name || booking.to || '—';
  const methodName = booking.payment?.method?.name || booking.paymentMethod?.name || 'Unknown';

  const date = new Date(booking.bookedAt);
  const formattedDate = date.toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className={`ticket-card ${expanded ? 'expanded' : ''}`}>
      {/* Ticket Header */}
      <div className="ticket-card__top">
        <div className="ticket-card__bus-info">
          <div className="ticket-card__bus-name">{booking.bus?.name}</div>
          <div className="ticket-card__bus-type">
            <span className={`badge badge-${booking.bus?.type === 'AC' ? 'green' : booking.bus?.type === 'Sleeper' ? 'gold' : 'red'}`}>
              {booking.bus?.type}
            </span>
          </div>
        </div>

        <div className="ticket-card__route">
          <div className="ticket-route__city">{fromName}</div>
          <div className="ticket-route__arrow">🚌 ───────→</div>
          <div className="ticket-route__city">{toName}</div>
        </div>

        <div className="ticket-card__meta">
          <div className="ticket-meta__item">
            <span>📅</span>
            <span>{booking.journeyDate}</span>
          </div>
          <div className="ticket-meta__item">
            <span>🕐</span>
            <span>{booking.journeyTime || '—'}</span>
          </div>
          <div className="ticket-meta__item">
            <span>💺</span>
            <span>Seats: {booking.seats?.join(', ')}</span>
          </div>
        </div>

        <div className="ticket-card__amount">
          <div className="ticket-amount">৳{booking.totalAmount?.toLocaleString()}</div>
          <span className="badge badge-green">✓ Confirmed</span>
        </div>

        <div className="ticket-card__actions">
          <button
            className="btn btn-primary ticket-dl-btn"
            onClick={onDownload}
            disabled={downloading}
          >
            {downloading ? <span className="spinner" /> : '📥 Download PDF'}
          </button>
          <button className="ticket-expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲ Less' : '▼ Details'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="ticket-card__details animate-fade">
          <div className="divider" style={{margin: '0 0 16px'}} />
          <div className="ticket-details-grid">
            <div className="ticket-detail">
              <span className="ticket-detail__label">Booking ID</span>
              <span className="ticket-detail__value mono">{booking.bookingId}</span>
            </div>
            <div className="ticket-detail">
              <span className="ticket-detail__label">Transaction ID</span>
              <span className="ticket-detail__value mono">{booking.payment?.transactionId || '—'}</span>
            </div>
            <div className="ticket-detail">
              <span className="ticket-detail__label">Payment Method</span>
              <span className="ticket-detail__value">{methodName}</span>
            </div>
            <div className="ticket-detail">
              <span className="ticket-detail__label">Booked On</span>
              <span className="ticket-detail__value">{formattedDate}</span>
            </div>
            <div className="ticket-detail">
              <span className="ticket-detail__label">Number of Seats</span>
              <span className="ticket-detail__value">{booking.seats?.length}</span>
            </div>
            <div className="ticket-detail">
              <span className="ticket-detail__label">Bus Type</span>
              <span className="ticket-detail__value">{booking.bus?.type}</span>
            </div>
          </div>
          <div className="ticket-detail" style={{marginTop: 12}}>
            <span className="ticket-detail__label">Amenities</span>
            <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:4}}>
              {booking.bus?.amenities?.map(a => <span key={a} className="tag">{a}</span>)}
            </div>
          </div>
        </div>
      )}

      {/* Perforated divider */}
      <div className="ticket-perforations">
        {Array.from({length: 20}).map((_,i) => <span key={i} className="perf-dot" />)}
      </div>
    </div>
  );
};

export default MyTicketsPage;
