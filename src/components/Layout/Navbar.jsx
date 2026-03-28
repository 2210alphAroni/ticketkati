import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🎫</span>
          <span className="navbar__logo-text">
            Ticket<span>Kati</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar__links hide-mobile">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/search" className={`navbar__link ${location.pathname === '/search' ? 'active' : ''}`}>Find Bus</Link>
          {user && (
            <Link to="/my-tickets" className={`navbar__link ${location.pathname === '/my-tickets' ? 'active' : ''}`}>My Tickets</Link>
          )}
        </div>

        {/* Auth / Profile */}
        <div className="navbar__auth hide-mobile">
          {user ? (
            <div className="navbar__user" onClick={() => setDropOpen(!dropOpen)}>
              <div className="navbar__avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span className="navbar__username">{user.name?.split(' ')[0]}</span>
              <span className="navbar__caret">▾</span>
              {dropOpen && (
                <div className="navbar__dropdown">
                  <Link to="/profile" className="navbar__drop-item">👤 Profile</Link>
                  <Link to="/my-tickets" className="navbar__drop-item">🎫 My Tickets</Link>
                  <div className="navbar__drop-divider" />
                  <button className="navbar__drop-item navbar__drop-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-outline navbar__btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary navbar__btn-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="navbar__hamburger hide-desktop" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/" className="navbar__mobile-link">🏠 Home</Link>
          <Link to="/search" className="navbar__mobile-link">🔍 Find Bus</Link>
          {user ? (
            <>
              <Link to="/my-tickets" className="navbar__mobile-link">🎫 My Tickets</Link>
              <Link to="/profile" className="navbar__mobile-link">👤 Profile</Link>
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link">🔐 Login</Link>
              <Link to="/register" className="navbar__mobile-link">✍️ Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
