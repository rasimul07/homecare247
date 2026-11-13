'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/context/BookingContext';
import { Phone, MessageCircle, CalendarPlus, MapPin } from 'lucide-react';

export function StickyBottomBar() {
  const { selectedCity, setIsCityModalOpen } = useLocation();
  const { t } = useLanguage();
  const { openBooking } = useBooking();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 sm:px-3 pt-2 pb-safe sm:hidden shadow-2xl flex items-center justify-between gap-1.5 max-w-full">
      {/* Call button */}
      <a
        href={`tel:${selectedCity.emergencyPhone}`}
        className="flex-1 py-2.5 px-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-red-500/25 active:scale-95 transition min-w-0"
      >
        <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
        <span className="truncate">{t('bar_call')}</span>
      </a>

      {/* WhatsApp button */}
      <a
        href={`https://wa.me/${selectedCity.whatsappPhone}?text=Hello%20HomeCare247,%20I%20need%20nursing%20care%20in%20${selectedCity.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-emerald-500/25 active:scale-95 transition min-w-0"
      >
        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{t('bar_whatsapp')}</span>
      </a>

      {/* Book Caregiver */}
      <button
        onClick={() => openBooking()}
        className="flex-1 py-2.5 px-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-blue-500/25 active:scale-95 transition min-w-0"
      >
        <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{t('bar_book')}</span>
      </button>

      {/* City Switcher Mini Button */}
      <button
        onClick={() => setIsCityModalOpen(true)}
        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center transition shrink-0 active:scale-95 border border-slate-200"
        aria-label="Change city"
        title={`Current City: ${selectedCity.name}`}
      >
        <MapPin className="w-3.5 h-3.5 text-blue-600" />
      </button>
    </div>
  );
}
