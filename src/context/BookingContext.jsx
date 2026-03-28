import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    passengers: 1,
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(null);

  const updateSearch = (params) => setSearchParams(prev => ({ ...prev, ...params }));

  const selectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatNum) => {
    setSelectedSeats(prev =>
      prev.includes(seatNum)
        ? prev.filter(s => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const clearBooking = () => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setBooking(null);
  };

  const getTotalAmount = () => {
    if (!selectedBus || selectedSeats.length === 0) return 0;
    return selectedBus.perSeatPrice * selectedSeats.length;
  };

  const createBooking = (paymentInfo) => {
    const b = {
      bookingId: `TK-${Date.now().toString(36).toUpperCase()}`,
      bus: selectedBus,
      from: searchParams.from,
      to: searchParams.to,
      journeyDate: searchParams.date,
      journeyTime: searchParams.time || selectedBus?.schedule?.[0],
      seats: selectedSeats,
      totalAmount: getTotalAmount(),
      payment: paymentInfo,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };
    setBooking(b);
    return b;
  };

  return (
    <BookingContext.Provider value={{
      searchParams, updateSearch,
      selectedBus, selectBus,
      selectedSeats, toggleSeat,
      booking, setBooking, createBooking,
      clearBooking, getTotalAmount,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
