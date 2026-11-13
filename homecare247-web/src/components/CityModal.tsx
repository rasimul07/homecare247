'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import { CITIES } from '@/data/cities';
import { MapPin, X, Navigation, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';

export function CityModal() {
  const { selectedCity, setSelectedCity, isCityModalOpen, setIsCityModalOpen, detectLocationGPS, isDetecting } = useLocation();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isCityModalOpen) return null;

  const filteredCities = CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.popularAreas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-teal-50/50 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('nav_select_city')}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Choose Your Healthcare Location</h3>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">We customize active caregivers, response time, and local helpline by city.</p>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto Detect GPS button & search */}
        <div className="p-3.5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search city or area (e.g. Kolkata, Salt Lake, Delhi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={async () => {
                await detectLocationGPS();
                setIsCityModalOpen(false);
              }}
              disabled={isDetecting}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm rounded-xl border border-blue-200 transition shrink-0 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isDetecting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isDetecting ? 'Detecting...' : 'Use My GPS'}</span>
              <span className="sm:hidden">GPS</span>
            </button>
          </div>
        </div>

        {/* City List */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-2 sm:space-y-3 divide-y divide-slate-100">
          {filteredCities.map((city) => {
            const isSelected = selectedCity.id === city.id;
            return (
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCity(city);
                  setIsCityModalOpen(false);
                }}
                className={`pt-3 first:pt-0 cursor-pointer p-3.5 rounded-2xl transition flex items-start justify-between gap-3 group ${
                  isSelected
                    ? 'bg-blue-50/80 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {city.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {city.state}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50/80 px-2 py-0.5 rounded text-[11px]">
                      <Users className="w-3 h-3 text-emerald-600" />
                      {city.availableStaffCount} Staff on Standby
                    </span>
                    <span className="inline-flex items-center gap-1 text-blue-700 font-bold bg-blue-50/80 px-2 py-0.5 rounded text-[11px]">
                      <Clock className="w-3 h-3 text-blue-600" />
                      ~{city.avgResponseMinutes} Mins Response
                    </span>
                  </div>

                  {/* Coverage */}
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1">
                    <span className="font-semibold text-slate-700">Hub: </span>
                    {city.address}
                  </p>
                </div>

                <div className="shrink-0 flex items-center self-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center transition">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 text-center shrink-0">
          <p className="text-xs text-slate-600">
            Emergency 24/7 Helpline:{' '}
            <a href={`tel:${selectedCity.emergencyPhone}`} className="font-extrabold text-blue-600 hover:underline">
              {selectedCity.emergencyPhone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
