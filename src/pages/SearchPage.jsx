import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSES, PLACES } from '../utils/data';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './SearchPage.css';

const SearchPage = () => {
  const { searchParams, updateSearch, selectBus } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [form, setForm] = useState(searchParams);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (searchParams.from && searchParams.to) {
      setForm(searchParams);
      doSearch(searchParams);
    }
  }, []);

  const doSearch = (params) => {
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      const found = BUSES.filter(bus =>
        bus.routes.includes(params.from) && bus.routes.includes(params.to)
      );
      setResults(found);
      setLoading(false);
      if (found.length > 0) toast.success(`${found.length} buses found!`);
      else toast.error('No buses found for this route');
    }, 700);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) { toast.error('Please select both destinations'); return; }
    if (form.from === form.to) { toast.error('Origin and destination must differ'); return; }
    updateSearch(form);
    doSearch(form);
  };

  const handleBook = (bus) => {
    if (!user) {
      toast.error('Please login to book a ticket');
      navigate('/login');
      return;
    }
    selectBus(bus);
    navigate('/seat-select');
  };

  const getFromName = (id) => PLACES.find(p => p.id === id)?.name || id;

  const filteredResults = results
    .filter(b => filterType === 'all' || b.type.toLowerCase().includes(filterType.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return a.perSeatPrice - b.perSeatPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="search-page">
      <div className="search-page__header">
        <div className="container">
          <h1 className="search-page__title">🔍 Find Your Bus</h1>

          {/* Inline Search Bar */}
          <form onSubmit={handleSearch} className="inline-search">
            <div className="inline-search__fields">
              <div className="form-group">
                <label className="form-label">From</label>
                <select className="form-input" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}>
                  <option value="">Origin</option>
                  {PLACES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="swap-icon" onClick={() => setForm(p => ({ ...p, from: p.to, to: p.from }))}>⇄</div>
              <div className="form-group">
                <label className="form-label">To</label>
                <select className="form-input" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}>
                  <option value="">Destination</option>
                  {PLACES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={form.date} min={today} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="container search-page__body">
        {/* Filters */}
        {searched && !loading && (
          <div className="search-filters">
            <div className="filter-group">
              <span className="filter-label">Bus Type:</span>
              {['all', 'AC', 'Non-AC', 'Sleeper'].map(t => (
                <button key={t} className={`filter-btn ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="filter-group">
              <span className="filter-label">Sort by:</span>
              <select className="form-input filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {loading && (
          <div className="search-loading">
            <div className="loading-bus">🚌</div>
            <p>Searching for buses...</p>
          </div>
        )}

        {!loading && searched && (
          <div className="results-header">
            {filteredResults.length > 0
              ? <span className="results-count">{filteredResults.length} bus{filteredResults.length > 1 ? 'es' : ''} found {form.from && form.to ? `· ${getFromName(form.from)} → ${getFromName(form.to)}` : ''} · {form.date}</span>
              : <span className="results-empty">No buses found. Try a different route.</span>}
          </div>
        )}

        {!loading && filteredResults.map(bus => (
          <BusCard key={bus.id} bus={bus} searchParams={form} onBook={() => handleBook(bus)} />
        ))}

        {!searched && (
          <div className="search-hint">
            <div className="search-hint__icon">🚌</div>
            <h3>Search for your journey</h3>
            <p>Select your origin, destination and travel date above to find available buses</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BusCard = ({ bus, searchParams, onBook }) => {
  const [showTracker, setShowTracker] = useState(false);
  const fromPlace = PLACES.find(p => p.id === searchParams.from);
  const toPlace = PLACES.find(p => p.id === searchParams.to);

  return (
    <div className="bus-card animate-fade">
      <div className="bus-card__left">
        <div className="bus-card__logo" style={{ background: bus.color + '20', border: `1px solid ${bus.color}40` }}>
          <span style={{ fontSize: 24 }}>🚌</span>
        </div>
        <div>
          <h3 className="bus-card__name">{bus.name}</h3>
          <p className="bus-card__nameBn">{bus.nameBn}</p>
          <div className="bus-card__badges">
            <span className={`badge badge-${bus.type === 'AC' ? 'green' : bus.type === 'Sleeper' ? 'gold' : 'red'}`}>
              {bus.type}
            </span>
            <span className="bus-card__rating">⭐ {bus.rating}</span>
          </div>
        </div>
      </div>

      <div className="bus-card__route">
        <div className="bus-card__place">
          <span className="bus-card__city">{fromPlace?.name || searchParams.from}</span>
          <span className="bus-card__terminal">{fromPlace?.terminal}</span>
        </div>
        <div className="bus-card__arrow-line">
          <div className="bus-card__line"></div>
          <span className="bus-card__bus-icon">🚌</span>
          <div className="bus-card__line"></div>
        </div>
        <div className="bus-card__place bus-card__place--right">
          <span className="bus-card__city">{toPlace?.name || searchParams.to}</span>
          <span className="bus-card__terminal">{toPlace?.terminal}</span>
        </div>
      </div>

      <div className="bus-card__schedules">
        <span className="bus-card__sched-label">Departures:</span>
        <div className="bus-card__times">
          {bus.schedule.slice(0, 4).map(t => (
            <span key={t} className="bus-card__time">{t}</span>
          ))}
          {bus.schedule.length > 4 && <span className="bus-card__time-more">+{bus.schedule.length - 4}</span>}
        </div>
      </div>

      <div className="bus-card__amenities">
        {bus.amenities.slice(0, 3).map(a => <span key={a} className="tag">{a}</span>)}
        {bus.amenities.length > 3 && <span className="tag">+{bus.amenities.length - 3}</span>}
      </div>

      <div className="bus-card__right">
        <div className="bus-card__price">৳{bus.perSeatPrice.toLocaleString()}</div>
        <div className="bus-card__per">per seat</div>
        <div className="bus-card__seats">{bus.totalSeats} seats available</div>
        <button className="btn btn-primary bus-card__book" onClick={onBook}>Book Now →</button>
        <button className="bus-card__track" onClick={() => setShowTracker(!showTracker)}>
          📍 {showTracker ? 'Hide' : 'Track Live'}
        </button>
      </div>

      {showTracker && <BusTracker bus={bus} />}
    </div>
  );
};

const BusTracker = ({ bus }) => {
  const [progress, setProgress] = useState(Math.floor(Math.random() * 60) + 10);
  const statuses = ['On Time', 'Slightly Delayed', 'At Terminal', 'En Route'];
  const [status] = useState(statuses[Math.floor(Math.random() * statuses.length)]);

  useEffect(() => {
    const int = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 2, 95));
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="bus-tracker">
      <div className="bus-tracker__header">
        <span>📍 Live Tracking — {bus.name}</span>
        <span className={`badge badge-${status === 'On Time' ? 'green' : 'gold'}`}>{status}</span>
      </div>
      <div className="bus-tracker__bar">
        <div className="bus-tracker__progress" style={{ width: `${progress}%` }}>
          <span className="bus-tracker__bus">🚌</span>
        </div>
      </div>
      <div className="bus-tracker__labels">
        <span>Origin</span>
        <span>{Math.round(progress)}% of journey completed</span>
        <span>Destination</span>
      </div>
      <div className="bus-tracker__info">
        <span>🕐 Last updated: just now</span>
        <span>📶 GPS Signal: Strong</span>
        <span>👥 Passengers: {Math.floor(Math.random() * 20) + 15}/{bus.totalSeats}</span>
      </div>
    </div>
  );
};

export default SearchPage;
