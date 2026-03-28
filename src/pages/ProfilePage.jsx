import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });

  if (!user) { navigate('/login'); return null; }

  const bookings = JSON.parse(localStorage.getItem('ticketkati_bookings') || '[]').filter(b => b.userId === user.id);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    updateUser(form);
    toast.success('Profile updated!');
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div className="container">
          <h1 className="profile-page__title">👤 My Profile</h1>
        </div>
      </div>

      <div className="container profile-page__body">
        {/* Profile Card */}
        <div className="card profile-card">
          <div className="profile-card__avatar">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="profile-card__info">
            <h2 className="profile-card__name">{user.name}</h2>
            <p className="profile-card__email">{user.email}</p>
            <p className="profile-card__phone">📱 {user.phone || 'No phone added'}</p>
            <p className="profile-card__joined">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-BD') : 'N/A'}</p>
          </div>
          <div className="profile-card__stats">
            <div className="profile-stat">
              <div className="profile-stat__value">{bookings.length}</div>
              <div className="profile-stat__label">Total Bookings</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat__value">৳{bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0).toLocaleString()}</div>
              <div className="profile-stat__label">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card profile-edit-card">
          <div className="profile-edit__header">
            <h3>Personal Information</h3>
            {!editing && <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
              </div>
              <div className="profile-form__btns">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="profile-info-item"><span>Name</span><strong>{user.name}</strong></div>
              <div className="profile-info-item"><span>Email</span><strong>{user.email}</strong></div>
              <div className="profile-info-item"><span>Phone</span><strong>{user.phone || '—'}</strong></div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card profile-actions-card">
          <h3>Quick Actions</h3>
          <div className="profile-actions">
            <button className="profile-action-btn" onClick={() => navigate('/my-tickets')}>
              <span>🎫</span>
              <span>View My Tickets</span>
              <span>→</span>
            </button>
            <button className="profile-action-btn" onClick={() => navigate('/search')}>
              <span>🔍</span>
              <span>Book New Ticket</span>
              <span>→</span>
            </button>
            <button className="profile-action-btn profile-action-btn--danger" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
