import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import SeatSelectPage from './pages/SeatSelectPage';
import PaymentPage from './pages/PaymentPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';

// Global styles
import './assets/styles/global.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// App Layout
const AppLayout = ({ children }) => (
  <div className="app">
    <Navbar />
    <main className="main-content page-enter">
      {children}
    </main>
    <Footer />
  </div>
);

const AppRoutes = () => (
  <Router>
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/seat-select" element={
          <ProtectedRoute><SeatSelectPage /></ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute><PaymentPage /></ProtectedRoute>
        } />
        <Route path="/my-tickets" element={
          <ProtectedRoute><MyTicketsPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  </Router>
);

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E1E1E',
              color: '#F0EDE8',
              border: '1px solid #2A2A2A',
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22B55F', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#E8242A', secondary: '#fff' },
            },
          }}
        />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
