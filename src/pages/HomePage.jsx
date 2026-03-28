import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLACES } from '../utils/data';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';
import './HomePage.css';

const POPULAR_ROUTES = [
  { from: 'dhaka', to: 'chittagong', label: 'Dhaka → Chittagong', price: 350, time: '5h' },
  { from: 'dhaka', to: 'coxsbazar', label: "Dhaka → Cox's Bazar", price: 900, time: '10h' },
  { from: 'dhaka', to: 'sylhet', label: 'Dhaka → Sylhet', price: 500, time: '4h' },
  { from: 'dhaka', to: 'rangpur', label: 'Dhaka → Rangpur', price: 600, time: '7h' },
  { from: 'dhaka', to: 'rajshahi', label: 'Dhaka → Rajshahi', price: 400, time: '5h' },
  { from: 'dhaka', to: 'cumilla', label: 'Dhaka → Cumilla', price: 180, time: '2h' },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Booking', desc: 'Book your seat in under 60 seconds' },
  { icon: '🛡️', title: 'Secure Payment', desc: 'bKash, Nagad, Rocket & more' },
  { icon: '📍', title: 'Live Tracking', desc: 'Track your bus in real time' },
  { icon: '🎫', title: 'Digital Ticket', desc: 'Download PDF ticket instantly' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { updateSearch } = useBooking();
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1,
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) { toast.error('Please select From and To destinations'); return; }
    if (form.from === form.to) { toast.error('From and To cannot be the same'); return; }
    updateSearch(form);
    navigate('/search');
  };

  const swapPlaces = () => {
    setForm(p => ({ ...p, from: p.to, to: p.from }));
  };

  const setRoute = (route) => {
    setForm(p => ({ ...p, from: route.from, to: route.to }));
    updateSearch({ from: route.from, to: route.to, date: form.date });
    navigate('/search');
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__gradient"></div>
          <div className="hero__dots"></div>
        </div>

        <div className="container hero__content">
          <div className="hero__badge animate-fade">
            <span className="hero__badge-dot"></span>
            🇧🇩 Bangladesh's #1 Bus Booking Platform
          </div>

          <h1 className="hero__title animate-fade" style={{animationDelay:'0.1s'}}>
            <span className="hero__title-accent">Ticket</span>Kati
            <br />
            <span className="hero__title-sub">বাসের টিকেট, এখনই কাটুন</span>
          </h1>

          <p className="hero__desc animate-fade" style={{animationDelay:'0.2s'}}>
            Book bus tickets across Bangladesh with ease.<br />
            8 premium bus services. Real-time tracking. Instant PDF tickets.
          </p>

          {/* Search Card */}
          <div className="search-card animate-fade" style={{animationDelay:'0.3s'}}>
            <div className="search-card__header">
              <span>🔍</span> Find Your Bus
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-form__row">
                {/* From */}
                <div className="form-group search-field">
                  <label className="form-label">From</label>
                  <div className="search-select-wrapper">
                    <span className="search-select-icon">🛫</span>
                    <select
                      className="form-input search-select"
                      value={form.from}
                      onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                    >
                      <option value="">Select origin</option>
                      {PLACES.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap */}
                <button type="button" className="swap-btn" onClick={swapPlaces} title="Swap">
                  ⇄
                </button>

                {/* To */}
                <div className="form-group search-field">
                  <label className="form-label">To</label>
                  <div className="search-select-wrapper">
                    <span className="search-select-icon">🛬</span>
                    <select
                      className="form-input search-select"
                      value={form.to}
                      onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                    >
                      <option value="">Select destination</option>
                      {PLACES.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="form-group search-field">
                  <label className="form-label">Journey Date</label>
                  <div className="search-select-wrapper">
                    <span className="search-select-icon">📅</span>
                    <input
                      type="date"
                      className="form-input search-select"
                      value={form.date}
                      min={today}
                      onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Passengers */}
                <div className="form-group search-field search-field--sm">
                  <label className="form-label">Passengers</label>
                  <div className="search-select-wrapper">
                    <span className="search-select-icon">👥</span>
                    <select
                      className="form-input search-select"
                      value={form.passengers}
                      onChange={e => setForm(p => ({ ...p, passengers: parseInt(e.target.value) }))}
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary search-btn">
                  🔍 Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="section popular">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Routes</h2>
            <p className="section-subtitle">Most booked routes across Bangladesh</p>
          </div>
          <div className="routes-grid">
            {POPULAR_ROUTES.map((route, i) => (
              <div key={i} className="route-card" onClick={() => setRoute(route)}>
                <div className="route-card__label">{route.label}</div>
                <div className="route-card__meta">
                  <span className="route-card__time">⏱ {route.time}</span>
                  <span className="route-card__price">From ৳{route.price}</span>
                </div>
                <div className="route-card__arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why TicketKati?</h2>
            <p className="section-subtitle">The smart way to book bus tickets in Bangladesh</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bus Marquee */}
      <section className="section buses-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Bus Partners</h2>
          </div>
          <div className="bus-marquee">
            <div className="bus-marquee__track">
              {['Drutogami', 'Rajib Paribahan', 'Hanif Enterprise', 'Bhuyapuri', 'Sirajganj Travel', 'Lalmonirhat Express', 'Comilla Travel', "Cox's Bazar Sleeper",
                'Drutogami', 'Rajib Paribahan', 'Hanif Enterprise', 'Bhuyapuri', 'Sirajganj Travel', 'Lalmonirhat Express', 'Comilla Travel', "Cox's Bazar Sleeper"].map((b, i) => (
                <span key={i} className="bus-chip">🚌 {b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-card__content">
              <h2>Ready to book your journey?</h2>
              <p>Join 50,000+ travelers who trust TicketKati every day</p>
              <div className="cta-card__btns">
                <button className="btn btn-primary" onClick={() => navigate('/search')}>
                  🔍 Search Buses
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/register')}>
                  ✍️ Create Account
                </button>
              </div>
            </div>
            <div className="cta-card__emoji">🚌</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
