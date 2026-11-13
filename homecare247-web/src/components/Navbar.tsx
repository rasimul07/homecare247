'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { CITIES } from '@/data/cities';
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
  ArrowRight,
  HeartHandshake,
  UserCheck,
  ShieldPlus,
  PackageCheck,
  FlaskConical,
  Baby,
  Award,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { Language } from '@/types';

type MegaMenuType = 'services' | 'why' | 'cities' | null;

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { selectedCity, setSelectedCity, setIsCityModalOpen, isDetecting } = useLocation();
  const { openBooking } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuType>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (menu: MegaMenuType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 130);
  };

  const handleItemClick = (serviceId?: string) => {
    setActiveMegaMenu(null);
    if (serviceId) {
      openBooking(serviceId);
    }
  };

  // Zero-CLS Body Scroll Lock and Escape Key Listener for Mobile Drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const languages: { code: Language; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'bn', label: 'বাংলা', short: 'BN' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200/90 font-sans">
      {/* Top Announcement & Emergency Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white text-xs py-1.5 sm:py-2 px-2.5 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
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
            {/* Phone */}
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
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-[11px] sm:text-xs font-bold border border-white/15 whitespace-nowrap shrink-0 cursor-pointer"
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
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full font-extrabold transition text-[10px] sm:text-[11px] whitespace-nowrap cursor-pointer ${
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
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8">
        <div className="flex items-center justify-between h-15 sm:h-18 gap-2 xl:gap-3 w-full">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition shrink-0">
              <HeartPulse className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="shrink-0 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg xl:text-xl font-black tracking-tight text-slate-900 leading-none whitespace-nowrap">
                  HomeCare<span className="text-blue-600">247</span>
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide whitespace-nowrap">
                  24/7
                </span>
              </div>
              <p className="hidden 2xl:flex text-[10px] font-semibold text-slate-500 items-center gap-1 mt-0.5 leading-none whitespace-nowrap">
                <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
                <span>Verified Clinical Care</span>
              </p>
            </div>
          </a>

          {/* Desktop Nav Links with Dynamic, Smaller Typography */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 shrink-0">
            {/* 1. Clinical Services (Mega Menu Dropdown on Hover) */}
            <div
              className="relative py-3.5"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#services"
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs 2xl:text-[13px] font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                  activeMegaMenu === 'services'
                    ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav_services')}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeMegaMenu === 'services' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </a>
            </div>

            {/* 2. ICU Setup Alert Link */}
            <a
              href="#icu-setup"
              className="inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs 2xl:text-[13px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="hidden 2xl:inline">{t('nav_icu')}</span>
              <span className="2xl:hidden">ICU</span>
            </a>

            {/* 3. Why Choose Us (Mega Menu Dropdown on Hover) */}
            <div
              className="relative py-3.5"
              onMouseEnter={() => handleMouseEnter('why')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#why-us"
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs 2xl:text-[13px] font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                  activeMegaMenu === 'why'
                    ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav_why_us')}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeMegaMenu === 'why' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </a>
            </div>

            {/* 4. Shift Cost Estimator / Pricing */}
            <a
              href="#calculator"
              className="px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs 2xl:text-[13px] font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition whitespace-nowrap"
            >
              <span className="hidden 2xl:inline">{t('nav_calculator')}</span>
              <span className="2xl:hidden">Pricing</span>
            </a>

            {/* 5. Cities & Hubs (Mega Menu Dropdown on Hover) */}
            <div
              className="relative py-3.5"
              onMouseEnter={() => handleMouseEnter('cities')}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#city-availability"
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs 2xl:text-[13px] font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                  activeMegaMenu === 'cities'
                    ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav_all_cities')}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeMegaMenu === 'cities' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </a>
            </div>

            {/* 6. FAQs (Visible on ultra wide screens) */}
            <a
              href="#faqs"
              className="hidden 2xl:inline-block px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs 2xl:text-[13px] font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition whitespace-nowrap"
            >
              {t('nav_faq')}
            </a>
          </nav>

          {/* Desktop Right CTAs - Dynamic & Compact */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* WhatsApp: Icon-only on laptop screens (< 2xl), full label on 2xl+ */}
            <a
              href={`https://wa.me/${selectedCity.whatsappPhone}?text=Hello%20HomeCare247,%20I%20need%20nursing%20care%20in%20${selectedCity.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 p-1.5 xl:px-2.5 xl:py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition text-[11px] xl:text-xs font-bold whitespace-nowrap shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden 2xl:inline">WhatsApp</span>
            </a>

            {/* Call Helpline: Compact number without +91 */}
            <a
              href={`tel:${selectedCity.phone}`}
              className="inline-flex items-center gap-1 p-1.5 xl:px-2.5 xl:py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 transition text-[11px] xl:text-xs font-bold whitespace-nowrap shrink-0"
              title={`Call 24/7 Helpline: ${selectedCity.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden 2xl:inline">{selectedCity.phone}</span>
              <span className="hidden xl:inline 2xl:hidden">{selectedCity.phone.replace('+91 ', '')}</span>
              <span className="hidden lg:inline xl:hidden font-extrabold">Call</span>
            </a>

            {/* Book Now Button: Always fits, never clipped */}
            <button
              onClick={() => openBooking('skilled-nursing')}
              className="btn-avalanche-primary group/btn inline-flex items-center justify-center gap-1.5 px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg font-black text-xs transition transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <span>Book Care</span>
              <ArrowRight className="w-3 h-3 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Tablet & Mobile Right Actions (< LG screens) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Call icon button */}
            <a
              href={`tel:${selectedCity.phone}`}
              className="p-2 sm:p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition shrink-0"
              title={`Call ${selectedCity.phone}`}
              aria-label={`Call ${selectedCity.phone}`}
            >
              <Phone className="w-4 h-4 text-blue-600" />
            </a>

            {/* Quick Book Button */}
            <button
              onClick={() => openBooking('skilled-nursing')}
              className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition whitespace-nowrap shrink-0"
            >
              <span>{t('nav_book_btn')}</span>
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition shrink-0 flex items-center gap-1.5 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
              <span className="hidden md:inline text-xs font-bold text-slate-700">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MEGA MENU 1: CLINICAL SERVICES (Exact TRON Layout UI)
          ======================================================== */}
      {activeMegaMenu === 'services' && (
        <div
          onMouseEnter={() => handleMouseEnter('services')}
          onMouseLeave={handleMouseLeave}
          className="absolute top-full left-0 right-0 w-full bg-white border-b border-slate-200/90 shadow-2xl z-50 animate-fadeIn font-sans"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 sm:py-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Column 1: NURSING & BEDSIDE CARE (5 cols) */}
              <div className="lg:col-span-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>HOME NURSING & ATTENDANTS</span>
                </div>
                <div className="space-y-1">
                  {/* Item 1 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('skilled-nursing')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-blue-100">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Skilled Nursing Care (GNM / B.Sc)
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Hospital-standard injections, catheterization, IV infusion & wound dressing.
                      </p>
                    </div>
                  </a>

                  {/* Item 2 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('bedside-attendant')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-teal-100">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Bedside Attendant / Ayah Service
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        12h & 24h compassionate hygiene, feeding, sponge bath & patient mobility support.
                      </p>
                    </div>
                  </a>

                  {/* Item 3 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('elderly-dementia-care')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-amber-100">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Elderly Dementia & Parkinson’s Care
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Specialized memory support, stroke recovery, fall prevention & vitals tracking.
                      </p>
                    </div>
                  </a>

                  {/* Item 4 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('mother-baby-care')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-pink-100">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Mother & Newborn Baby Care
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Postnatal maternal recovery, gentle newborn massage & feeding guidance.
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Column 2: CRITICAL CARE & ICU AT HOME (4 cols) */}
              <div className="lg:col-span-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                  <span>CRITICAL CARE & ICU AT HOME</span>
                </div>
                <div className="space-y-1">
                  {/* Item 1 */}
                  <a
                    href="#icu-setup"
                    onClick={() => handleItemClick('icu-at-home')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-rose-100">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        24/7 ICU Setup at Home
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Ventilators, BiPAP, multi-para monitors & certified ICU GNM nurses.
                      </p>
                    </div>
                  </a>

                  {/* Item 2 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('physiotherapy-home')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-indigo-100">
                      <ShieldPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Home Physiotherapy & Rehab
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Post-surgical, orthopedic, paralysis & neurological recovery at home.
                      </p>
                    </div>
                  </a>

                  {/* Item 3 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('medical-equipment-rental')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-purple-100">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Medical Equipment Rental
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Hospital beds, oxygen concentrators, suction machines & DVT pumps.
                      </p>
                    </div>
                  </a>

                  {/* Item 4 */}
                  <a
                    href="#services"
                    onClick={() => handleItemClick('lab-tests-home')}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition border border-cyan-100">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Home Blood Tests & ECG
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Doorstep sample collection with verified NABL accredited digital reports.
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Column 3: CLINICAL ASSURANCE HIGHLIGHT (3 cols) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-blue-50/80 via-white to-teal-50/40 p-5 sm:p-6 rounded-3xl border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold mb-3 border border-blue-200">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Active in {selectedCity.name}</span>
                  </div>
                  <h4 className="text-base font-black text-slate-950 tracking-tight">
                    Immediate Medical Callback Guarantee
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Our Senior Clinical Care Coordinator in <strong>{selectedCity.name}</strong> will assess your family's needs and dispatch staff within ~{selectedCity.avgResponseMinutes} mins.
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>100% Police Verified Staff</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Weekly Senior MD Review</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-blue-100/80">
                  <button
                    onClick={() => handleItemClick('skilled-nursing')}
                    className="btn-avalanche-primary w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Clinical Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MEGA MENU 2: WHY CHOOSE US / PATIENT SAFETY & GOVERNANCE
          ======================================================== */}
      {activeMegaMenu === 'why' && (
        <div
          onMouseEnter={() => handleMouseEnter('why')}
          onMouseLeave={handleMouseLeave}
          className="absolute top-full left-0 right-0 w-full bg-white border-b border-slate-200/90 shadow-2xl z-50 animate-fadeIn font-sans"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 sm:py-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Column 1: CLINICAL GOVERNANCE & SAFETY (6 cols) */}
              <div className="lg:col-span-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>CLINICAL GOVERNANCE & HOSPITAL STANDARDS</span>
                </div>
                <div className="space-y-1">
                  <a
                    href="#why-us"
                    onClick={() => setActiveMegaMenu(null)}
                    className="p-3.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        NABH Protocol Compliance
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Standardized hospital infection prevention, clinical hygiene checklists & surgical sterile dressing care.
                      </p>
                    </div>
                  </a>

                  <a
                    href="#why-us"
                    onClick={() => setActiveMegaMenu(null)}
                    className="p-3.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Senior MD Physician Supervision
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Weekly vitals review, prescription adherence oversight & tele-consultation support.
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Column 2: PATIENT TRUST & GUARANTEES (6 cols) */}
              <div className="lg:col-span-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>PATIENT TRUST & SAFETY GUARANTEES</span>
                </div>
                <div className="space-y-1">
                  <a
                    href="#why-us"
                    onClick={() => setActiveMegaMenu(null)}
                    className="p-3.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        100% Police Verified Caregivers
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        Mandatory Aadhaar biometric, address proof & comprehensive criminal background verification.
                      </p>
                    </div>
                  </a>

                  <a
                    href="#why-us"
                    onClick={() => setActiveMegaMenu(null)}
                    className="p-3.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3.5 group cursor-pointer block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        Free 12-Hour Caregiver Replacement
                      </h4>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">
                        If unsatisfied for any reason, receive an immediate verified replacement with zero extra agency fee.
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MEGA MENU 3: ACTIVE CITIES & HUBS (Exact TRON Layout UI)
          ======================================================== */}
      {activeMegaMenu === 'cities' && (
        <div
          onMouseEnter={() => handleMouseEnter('cities')}
          onMouseLeave={handleMouseLeave}
          className="absolute top-full left-0 right-0 w-full bg-white border-b border-slate-200/90 shadow-2xl z-50 animate-fadeIn font-sans"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 sm:py-9">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ACTIVE 24/7 CLINICAL DISPATCH HUBS ACROSS INDIA
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600">
                ● All Metro Operations Live
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {CITIES.map((c) => {
                const isSelected = selectedCity.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCity(c);
                      setActiveMegaMenu(null);
                    }}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                        : 'bg-white hover:bg-blue-50/70 border-slate-200/80 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {c.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                    </div>
                    <div className={`text-[11px] font-semibold ${isSelected ? 'text-blue-100' : 'text-emerald-700'}`}>
                      {c.availableStaffCount} Staff Standby
                    </div>
                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                      ~{c.avgResponseMinutes}m arrival
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <span>Need services in a suburb or nearby town? We provide customized regional home dispatch.</span>
              <a href={`tel:${selectedCity.phone}`} className="font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Local Coordinator: {selectedCity.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

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
                className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Emergency Direct Call Box */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-red-600 tracking-wider block">
                    Immediate SOS Emergency
                  </span>
                  <a href={`tel:${selectedCity.emergencyPhone}`} className="text-base font-black text-red-700">
                    {selectedCity.emergencyPhone}
                  </a>
                </div>
                <a
                  href={`tel:${selectedCity.emergencyPhone}`}
                  className="p-2.5 bg-red-600 text-white rounded-xl shadow-md"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Mobile Links */}
              <div className="space-y-1">
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  {t('nav_services')}
                </a>
                <a
                  href="#icu-setup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition"
                >
                  {t('nav_icu')}
                </a>
                <a
                  href="#calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  {t('nav_calculator')}
                </a>
                <a
                  href="#why-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  {t('nav_why_us')}
                </a>
                <a
                  href="#city-availability"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  {t('nav_all_cities')}
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  {t('nav_reviews')}
                </a>
                <a
                  href="#faqs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  {t('nav_faq')}
                </a>
              </div>

              {/* Mobile CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBooking('skilled-nursing');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-extrabold rounded-xl text-sm shadow-lg text-center"
                >
                  {t('nav_book_btn')}
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center">
              Active in {selectedCity.name} • NABH Compliant Protocols
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
