import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 3) e.name = 'Full name must be at least 3 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone || !/^01[3-9]\d{8}$/.test(form.phone)) e.phone = 'Valid BD phone (01XXXXXXXXX) required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      // Check if email already registered
      const users = JSON.parse(localStorage.getItem('ticketkati_users') || '[]');
      if (users.find(u => u.email === form.email)) {
        setErrors({ email: 'This email is already registered' });
        setLoading(false);
        return;
      }

      const newUser = { ...form, id: `user-${Date.now()}`, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('ticketkati_users', JSON.stringify(users));

      register(form);
      toast.success(`Account created! Welcome, ${form.name}! 🎉`);
      navigate('/');
      setLoading(false);
    }, 900);
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-pattern"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card animate-fade" style={{maxWidth: 460}}>
          <div className="auth-header">
            <Link to="/" className="auth-logo">🎫 Ticket<span>Kati</span></Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join thousands of travelers using TicketKati</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className={`form-input input-with-icon ${errors.name ? 'input-error' : ''}`}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className={`form-input input-with-icon ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  className={`form-input input-with-icon ${errors.phone ? 'input-error' : ''}`}
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={set('phone')}
                  maxLength={11}
                />
              </div>
              {errors.phone && <span className="auth-error">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-input input-with-icon input-with-toggle ${errors.password ? 'input-error' : ''}`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={set('password')}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-input input-with-icon input-with-toggle ${errors.confirm ? 'input-error' : ''}`}
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={set('confirm')}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirm && <span className="auth-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : '✍️ Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
