import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check saved users
      const users = JSON.parse(localStorage.getItem('ticketkati_users') || '[]');
      const found = users.find(u => u.email === form.email && u.password === form.password);

      if (found) {
        login(found);
        toast.success(`Welcome back, ${found.name}! 👋`);
        navigate('/');
      } else {
        // Demo account
        if (form.email === 'demo@ticketkati.com' && form.password === 'demo123') {
          login({ id: 'demo-user', name: 'Demo User', email: form.email, phone: '01700000000' });
          toast.success('Welcome to TicketKati! 🎫');
          navigate('/');
        } else {
          toast.error('Invalid email or password');
          setErrors({ password: 'Invalid credentials. Try demo@ticketkati.com / demo123' });
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-pattern"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card animate-fade">
          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">🎫 Ticket<span>Kati</span></Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to book your bus tickets</p>
          </div>

          {/* Demo hint */}
          <div className="auth-demo-hint">
            <span>🧪</span>
            <span>Demo: <b>demo@ticketkati.com</b> / <b>demo123</b></span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className={`form-input input-with-icon ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-input input-with-icon input-with-toggle ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : '🔐 Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
