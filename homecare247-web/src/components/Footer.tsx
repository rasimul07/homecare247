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
    <footer className="bg-slate-950 text-slate-400 text-xs pt-14 pb-28 sm:pb-16 border-t border-slate-900 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 space-y-12 w-full">
        {/* Top brand & badges */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                HomeCare<span className="text-blue-500">247</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {t('footer_tagline')} Clinical governance, certified GNM nurses, bedside attendants, and rapid ICU setup at home.
            </p>

            {/* Accreditations badge row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                NABH Guidelines Compliant
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[11px] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                100% Police Verified
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ISO 9001:2015 Certified
              </span>
            </div>
          </div>

          {/* Core Services Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer_services')}
            </h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="hover:text-blue-400 transition flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <span>{t(s.titleKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Local Hub Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Hub ({selectedCity.name})
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{selectedCity.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${selectedCity.phone}`} className="hover:text-white font-bold text-white">
                  {selectedCity.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24 Hours / 7 Days a Week</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>care@homecare247.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO City Hyperlinks Row */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('footer_cities')} & Local Service Portals
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c)}
                className={`p-2 rounded-xl text-left font-medium transition text-[11px] border ${
                  selectedCity.id === c.id
                    ? 'bg-blue-900/60 text-white border-blue-500'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-200">{c.name}</div>
                <div className="text-[10px] text-slate-500">{c.availableStaffCount} Staff Ready</div>
              </button>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          {t('footer_disclaimer')}
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-[11px]">
          <div>
            &copy; 2026 {t('footer_rights')}
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Terms of Clinical Service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Patient Safety Charter</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Clinical Governance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
