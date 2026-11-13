'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { CITIES } from '@/data/cities';
import {
  MapPin,
  Clock,
  Users,
  Building2,
  Phone,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export function CityAvailabilitySection() {
  const { t } = useLanguage();
  const { selectedCity, setSelectedCity, setIsCityModalOpen, detectLocationGPS, isDetecting } = useLocation();

  return (
    <section id="city-availability" className="py-14 sm:py-24 bg-gradient-to-b from-slate-50 to-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Hyperlocal Medical Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('city_heading')} <span className="text-blue-600">{selectedCity.name}</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('city_sub')}
          </p>
        </div>

        {/* City Hub Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl max-w-5xl mx-auto">
          {/* Top City Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {t('city_live_status')} Live Operations Active
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {selectedCity.hubName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCity.address}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('city_change_button')}</span>
              </button>

              <button
                onClick={detectLocationGPS}
                disabled={isDetecting}
                className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Detecting...' : 'Detect GPS'}</span>
              </button>
            </div>
          </div>

          {/* Key Metrics in this city */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-slate-100">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-900">{selectedCity.availableStaffCount}</div>
                <div className="text-xs text-emerald-700 font-medium">{t('city_staff_available')}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-900">~{selectedCity.avgResponseMinutes} Mins</div>
                <div className="text-xs text-blue-700 font-medium">{t('city_avg_time')}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <a href={`tel:${selectedCity.phone}`} className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 block">
                  {selectedCity.phone}
                </a>
                <div className="text-xs text-amber-800 font-medium">{t('city_emergency_num')}</div>
              </div>
            </div>
          </div>

          {/* Local Covered Neighborhoods */}
          <div className="pt-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{t('city_coverage_areas')}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {selectedCity.popularAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2"
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
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    selectedCity.id === c.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

