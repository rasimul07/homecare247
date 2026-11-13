'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { AlertCircle, Phone, MessageCircle, Activity, Ambulance } from 'lucide-react';

export function EmergencyBanner() {
  const { t } = useLanguage();
  const { selectedCity } = useLocation();
  const { openBooking } = useBooking();

  return (
    <section id="icu-setup" className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-6 px-3.5 sm:px-6 relative overflow-hidden shadow-lg w-full max-w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Headline & details */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-white shadow-inner animate-pulse">
            <Activity className="w-6 h-6" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1 backdrop-blur-sm">
              <Ambulance className="w-3.5 h-3.5" />
              <span>RAPID 4-HOUR ICU SETUP IN {selectedCity.name.toUpperCase()}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {t('emergency_title')}
            </h2>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl mt-0.5">
              {t('emergency_sub')} Ventilators, Multi-para monitors, BiPAP, Oxygen & ICU GNM nurses.
            </p>
          </div>
        </div>

        {/* Right: Emergency Direct Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href={`tel:${selectedCity.emergencyPhone}`}
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4 fill-red-600 text-red-600" />
            <span>{t('emergency_call_now')}</span>
          </a>

          <a
            href={`https://wa.me/${selectedCity.whatsappPhone}?text=URGENT%20ICU%20SUPPORT%20REQUEST%20IN%20${selectedCity.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition border border-emerald-400/40"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('emergency_whatsapp_now')}</span>
          </a>

          <button
            onClick={() => openBooking('icu-at-home')}
            className="w-full md:w-auto px-4 py-3 rounded-xl bg-red-950/40 hover:bg-red-950/60 text-white font-semibold text-xs border border-white/20 transition"
          >
            Book ICU Setup Online
          </button>
        </div>
      </div>
    </section>
  );
}

