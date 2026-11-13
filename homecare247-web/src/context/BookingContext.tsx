'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  isBookingOpen: boolean;
  prefilledServiceId: string;
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [prefilledServiceId, setPrefilledServiceId] = useState('skilled-nursing');

  const openBooking = (serviceId?: string) => {
    if (serviceId) {
      setPrefilledServiceId(serviceId);
    }
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        prefilledServiceId,
        openBooking,
        closeBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

