'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { CITIES } from '@/data/cities';
import { SERVICES } from '@/data/services';
import {
  HeartPulse,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const { selectedCity, setSelectedCity } = useLocation();

  return (
    <footer className="bg-slate-50 text-slate-600 text-xs pt-14 pb-28 sm:pb-16 border-t border-slate-200/90 w-full max-w-full overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full">
        {/* Top brand & badges */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                HomeCare<span className="text-blue-600">247</span>
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md">
              {t('footer_tagline')} Clinical governance, certified GNM nurses, bedside attendants, and rapid ICU setup at home.
            </p>

            {/* Accreditations badge row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                NABH Guidelines Compliant
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 shadow-xs">
                <Award className="w-3.5 h-3.5 text-teal-600" />
                100% Police Verified
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ISO 9001:2015 Certified
              </span>
            </div>
          </div>

          {/* Core Services Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('footer_services')}
            </h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="hover:text-blue-600 transition flex items-center gap-1.5 text-slate-600 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>{t(s.titleKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Local Hub Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Hub ({selectedCity.name})
            </h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{selectedCity.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`tel:${selectedCity.phone}`} className="hover:text-blue-600 font-bold text-slate-900">
                  {selectedCity.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>24 Hours / 7 Days a Week Standby</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <span>care@homecare247.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO City Hyperlinks Row */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('footer_cities')} & Local Service Portals
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c)}
                className={`p-2.5 rounded-xl text-left font-medium transition text-[11px] border cursor-pointer ${
                  selectedCity.id === c.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-xs'
                }`}
              >
                <div className={`font-bold ${selectedCity.id === c.id ? 'text-white' : 'text-slate-900'}`}>{c.name}</div>
                <div className={`text-[10px] ${selectedCity.id === c.id ? 'text-blue-100' : 'text-slate-500'}`}>{c.availableStaffCount} Staff Ready</div>
              </button>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-[11px] text-slate-500 leading-relaxed shadow-xs">
          {t('footer_disclaimer')}
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
          <div>
            &copy; 2026 {t('footer_rights')}
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition">Terms of Clinical Service</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition">Patient Safety Charter</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition">Clinical Governance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
