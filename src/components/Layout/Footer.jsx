import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">🎫 Ticket<span>Kati</span></div>
            <p className="footer__tagline">
              বাংলাদেশের সেরা বাস টিকেট বুকিং সিস্টেম।<br/>
              Trusted by thousands of travelers daily.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social">FB</a>
              <a href="#" className="footer__social">TW</a>
              <a href="#" className="footer__social">IG</a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/search">Find Bus</Link>
            <Link to="/my-tickets">My Tickets</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

          <div className="footer__col">
            <h4>Popular Routes</h4>
            <span>Dhaka → Chittagong</span>
            <span>Dhaka → Cox's Bazar</span>
            <span>Dhaka → Sylhet</span>
            <span>Dhaka → Rangpur</span>
            <span>Dhaka → Rajshahi</span>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <span>📞 Hotline: 16XXX</span>
            <span>✉️ support@ticketkati.com</span>
            <span>⏰ 24/7 Customer Service</span>
            <span>📍 Dhaka, Bangladesh</span>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 TicketKati. All rights reserved. Developed by:<a href="https://roniportfolio.onrender.com" target='_blank'>Nabinur Islam Roni</a></p>
          <div className="footer__payment-logos">
            <span className="footer__pay-badge" style={{background:'#E2136E'}}>bKash</span>
            <span className="footer__pay-badge" style={{background:'#F7941D'}}>Nagad</span>
            <span className="footer__pay-badge" style={{background:'#8B1A8B'}}>Rocket</span>
            <span className="footer__pay-badge" style={{background:'#2563EB'}}>SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
