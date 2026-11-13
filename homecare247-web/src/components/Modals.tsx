'use client';

import dynamic from 'next/dynamic';
import { useBooking } from '@/context/BookingContext';
import { useLocation } from '@/context/LocationContext';

const BookingModal = dynamic(
  () => import('@/components/BookingModal').then((mod) => mod.BookingModal),
  { ssr: false }
);

const CityModal = dynamic(
  () => import('@/components/CityModal').then((mod) => mod.CityModal),
  { ssr: false }
);

/**
 * Modals container with on-demand dynamic chunk splitting.
 * Modals are code-split and loaded asynchronously without blocking
 * the initial First Contentful Paint (FCP) or Total Blocking Time (TBT).
 */
export function Modals() {
  const { isBookingOpen } = useBooking();
  const { isCityModalOpen } = useLocation();

  return (
    <>
      {isCityModalOpen && <CityModal />}
      {isBookingOpen && <BookingModal />}
    </>
  );
}
