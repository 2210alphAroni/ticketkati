import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('ticketkati_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ticketkati_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithToken = { ...userData, token: `mock-token-${Date.now()}` };
    setUser(userWithToken);
    localStorage.setItem('ticketkati_user', JSON.stringify(userWithToken));
  };

  const register = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      token: `mock-token-${Date.now()}`,
    };
    setUser(newUser);
    localStorage.setItem('ticketkati_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ticketkati_user');
    localStorage.removeItem('ticketkati_bookings');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('ticketkati_user', JSON.stringify(updated));
  };

  const getBookings = () => {
    try {
      const bookings = JSON.parse(localStorage.getItem('ticketkati_bookings') || '[]');
      return bookings.filter(b => b.userId === user?.id);
    } catch {
      return [];
    }
  };

  const saveBooking = (booking) => {
    const existing = JSON.parse(localStorage.getItem('ticketkati_bookings') || '[]');
    const newBooking = { ...booking, userId: user?.id };
    const updated = [...existing, newBooking];
    localStorage.setItem('ticketkati_bookings', JSON.stringify(updated));
    return newBooking;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, getBookings, saveBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
