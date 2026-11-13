'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { CITIES } from '@/data/cities';
import { SpotlightCard } from '@/components/SpotlightCard';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import {
  MapPin,
  Clock,
  Users,
  Building2,
  Phone,
  CheckCircle2,
  Navigation,
  Sparkles
} from 'lucide-react';

export function CityAvailabilitySection() {
  const { t } = useLanguage();
  const { selectedCity, setSelectedCity, setIsCityModalOpen, detectLocationGPS, isDetecting } = useLocation();

  return (
    <section id="city-availability" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white w-full max-w-full overflow-hidden relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-sans font-bold tracking-wide mb-3 border border-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Hyperlocal Clinical Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {t('city_heading')} <span className="text-shimmer-sweep">{selectedCity.name}</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {t('city_sub')}
            </p>
          </div>
        </RevealOnScroll>

        {/* City Hub Card with Interactive Spotlight */}
        <RevealOnScroll delayMs={100}>
          <SpotlightCard className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl max-w-5xl mx-auto font-sans">
            {/* Top City Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-sans font-bold text-emerald-700 tracking-wide">
                    {t('city_live_status')} Live Operations Active
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                  {selectedCity.hubName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCity.address}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className="btn-avalanche-outline px-4 py-2.5 rounded-xl text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('city_change_button')}</span>
                </button>

                <button
                  onClick={detectLocationGPS}
                  disabled={isDetecting}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                  <span>{isDetecting ? 'Detecting...' : 'Detect GPS'}</span>
                </button>
              </div>
            </div>

            {/* Key Metrics in this city */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-slate-100">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/90 flex items-center gap-4 hover:border-emerald-300 transition group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-950 font-sans">{selectedCity.availableStaffCount}</div>
                  <div className="text-xs text-emerald-700 font-semibold">{t('city_staff_available')}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100/90 flex items-center gap-4 hover:border-blue-300 transition group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-950 font-sans">~{selectedCity.avgResponseMinutes} Mins</div>
                  <div className="text-xs text-blue-700 font-semibold">{t('city_avg_time')}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100/90 flex items-center gap-4 hover:border-amber-300 transition group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <a href={`tel:${selectedCity.phone}`} className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 block font-sans">
                    {selectedCity.phone}
                  </a>
                  <div className="text-xs text-amber-800 font-semibold">{t('city_emergency_num')}</div>
                </div>
              </div>
            </div>

            {/* Local Covered Neighborhoods */}
            <div className="pt-6">
              <h4 className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{t('city_coverage_areas')} ({selectedCity.popularAreas.length} Localities)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {selectedCity.popularAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-2 hover:bg-white hover:border-blue-300 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick city switch bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-500">{t('city_not_your_city')}</span>
              <div className="flex flex-wrap items-center gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCity(c)}
                    className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                      selectedCity.id === c.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </RevealOnScroll>
      </div>
    </section>
  );
}
