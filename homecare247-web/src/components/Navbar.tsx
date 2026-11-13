'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import {
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Menu,
  X,
  HeartPulse,
  ShieldCheck,
  ChevronDown,
  Stethoscope,
  Activity,
  Calculator,
  Building2,
  Star,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Language } from '@/types';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { selectedCity, setIsCityModalOpen, isDetecting } = useLocation();
  const { openBooking } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const languages: { code: Language; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'bn', label: 'বাংলা', short: 'BN' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-xs border-b border-slate-100">
      {/* Top Announcement & Emergency Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white text-xs py-1.5 sm:py-2 px-2.5 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 w-full">
          {/* Left: Emergency Alert & City Dispatch */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black tracking-wider uppercase text-[9px] sm:text-[10px] animate-pulse shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              24/7
            </span>
            <span className="hidden md:inline text-slate-300 text-xs font-medium whitespace-nowrap">
              {t('top_fast_dispatch')}{' '}
              <strong className="text-white font-bold underline decoration-blue-400 underline-offset-2 ml-0.5">
                {selectedCity.name}
              </strong>
            </span>
            <span className="md:hidden text-[11px] sm:text-xs font-bold text-slate-200 whitespace-nowrap">
              {selectedCity.name} Hub
            </span>
          </div>

          {/* Right: Helpline + Location + Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 ml-auto shrink-0">
            {/* Phone (Hidden on mobile < sm because Phone is prominently in main navbar & sticky bottom bar) */}
            <a
              href={`tel:${selectedCity.emergencyPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 hover:text-white font-bold text-xs transition px-2.5 py-0.5 rounded-full hover:bg-white/10 whitespace-nowrap shrink-0"
              title="24/7 Emergency Medical Line"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="tracking-tight">{selectedCity.emergencyPhone}</span>
            </a>

            {/* Location Switcher Pill */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-[11px] sm:text-xs font-bold border border-white/15 whitespace-nowrap shrink-0"
              title="Change your city"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-300 shrink-0" />
              <span className="max-w-[55px] sm:max-w-none truncate">
                {isDetecting ? t('nav_location_detecting') : selectedCity.name}
              </span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-75 shrink-0" />
            </button>

            {/* Language Switcher */}
            <div className="inline-flex items-center bg-white/10 rounded-full p-0.5 border border-white/15 text-xs gap-0.5 shrink-0">
              <Globe className="w-3 h-3 ml-1 mr-0.5 text-blue-300 hidden sm:inline shrink-0" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full font-extrabold transition text-[10px] sm:text-[11px] whitespace-nowrap ${
                    language === lang.code
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  aria-label={`Switch to ${lang.label}`}
                >
                  {lang.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3 w-full">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition shrink-0">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="shrink-0 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-none whitespace-nowrap">
                  HomeCare<span className="text-blue-600">247</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide whitespace-nowrap">
                  24/7
                </span>
              </div>
              <p className="hidden sm:flex text-xs font-semibold text-slate-500 items-center gap-1.5 mt-1 leading-none whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Verified Clinical Care at Home</span>
              </p>
            </div>
          </a>

          {/* Desktop Nav Links (Visible only on XL screens >= 1280px to guarantee zero overflow) */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3 shrink-0">
            <a
              href="#services"
              className="px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              {t('nav_services')}
            </a>

            <a
              href="#icu-setup"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition whitespace-nowrap shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span>{t('nav_icu')}</span>
            </a>

            <a
              href="#calculator"
              className="px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              {t('nav_calculator')}
            </a>

            <a
              href="#city-availability"
              className="px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              {t('nav_all_cities')}
            </a>

            <a
              href="#why-us"
              className="px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              {t('nav_why_us')}
            </a>

            <a
              href="#testimonials"
              className="px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              {t('nav_reviews')}
            </a>

            <a
              href="#faqs"
              className="px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              {t('nav_faq')}
            </a>
          </nav>

          {/* Desktop Right CTAs (Visible on XL+ screens) */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${selectedCity.whatsappPhone}?text=Hello%20HomeCare247,%20I%20need%20nursing%20care%20in%20${selectedCity.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition text-xs font-bold whitespace-nowrap shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Call Helpline */}
            <a
              href={`tel:${selectedCity.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 transition text-xs font-bold whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{selectedCity.phone}</span>
            </a>

            {/* Book Now Button */}
            <button
              onClick={() => openBooking('skilled-nursing')}
              className="inline-flex items-center justify-center px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-xs 2xl:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <span>{t('nav_book_btn')}</span>
            </button>
          </div>

          {/* Tablet & Mobile Right Actions (< XL screens: Tablets, Laptops, Phones) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Call icon button */}
            <a
              href={`tel:${selectedCity.phone}`}
              className="p-2 sm:p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition shrink-0"
              title={`Call ${selectedCity.phone}`}
              aria-label={`Call ${selectedCity.phone}`}
            >
              <Phone className="w-4 h-4 text-blue-600" />
            </a>

            {/* Quick Book Button (Visible on screens >= 480px) */}
            <button
              onClick={() => openBooking('skilled-nursing')}
              className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition whitespace-nowrap shrink-0"
            >
              <span>{t('nav_book_btn')}</span>
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition shrink-0 flex items-center gap-1.5"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
              <span className="hidden md:inline text-xs font-bold text-slate-700">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Mobile & Tablet Drawer Menu */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Sheet Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900">
                    HomeCare<span className="text-blue-600">247</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 ml-1.5">
                    24/7
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* City Selection Card */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Selected Hub</span>
                    <span className="text-sm font-extrabold text-slate-900">{selectedCity.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCityModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs hover:bg-blue-50 transition"
                >
                  Change
                </button>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Choose Language / भाषा चुनें / ভাষা নির্বাচন
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        language === l.code
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links with Icons */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-bold text-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <span>{t('nav_services')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>

                <a
                  href="#icu-setup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 text-red-700 font-bold text-sm transition group border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span>{t('nav_icu')}</span>
                      <span className="text-[10px] text-red-600 font-semibold block">4-Hour Urgent Home Setup</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase">
                    Urgent
                  </span>
                </a>

                <a
                  href="#calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-bold text-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <span>{t('nav_calculator')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>

                <a
                  href="#city-availability"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-bold text-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span>{t('city_heading')} {selectedCity.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>

                <a
                  href="#why-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-bold text-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>{t('nav_why_us')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>

                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-bold text-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <span>{t('nav_reviews')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>

                <a
                  href="#faqs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-bold text-sm transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span>{t('nav_faq')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking('skilled-nursing');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl text-center shadow-lg shadow-blue-500/25 transition"
              >
                {t('nav_book_btn')}
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${selectedCity.emergencyPhone}`}
                  className="py-3 px-2 rounded-xl border border-blue-200 bg-white text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-blue-50 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Hotline</span>
                </a>

                <a
                  href={`https://wa.me/${selectedCity.whatsappPhone}?text=Hello%20HomeCare247,%20I%20need%20nursing%20care%20in%20${selectedCity.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-emerald-100 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
