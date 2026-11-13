'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { SERVICES } from '@/data/services';
import {
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export function Hero() {
  const { t } = useLanguage();
  const { selectedCity, setIsCityModalOpen } = useLocation();
  const { openBooking } = useBooking();

  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    serviceId: 'skilled-nursing',
    shift: '12d',
    area: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 700);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-6 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100 w-full max-w-full">
      {/* Decorative background blurs strictly bounded */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-10 w-64 sm:w-96 h-64 sm:h-96 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Headline, Trust Signals & Highlights (7 cols) */}
          <div className="lg:col-span-7">
            {/* Top compliance badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 text-xs font-bold tracking-wide backdrop-blur-sm mb-4 sm:mb-5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{t('hero_badge')}</span>
            </div>

            {/* Main Headline customized by City */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.14] mb-4 sm:mb-5">
              {t('hero_title_prefix')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-blue-700">
                {t('hero_title_highlight')}
              </span>{' '}
              <span className="inline-block">
                {t('hero_title_in')} {selectedCity.name}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-6 sm:mb-8 font-normal">
              {t('hero_subtitle')}
            </p>

            {/* Dynamic Local Availability Badge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 mb-6 sm:mb-8">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-3.5 w-3.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedCity.availableStaffCount} Registered Staff on Standby in {selectedCity.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Avg response: ~{selectedCity.avgResponseMinutes} mins to your doorstep
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCityModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 shrink-0 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl border border-blue-200 transition self-end sm:self-auto"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Change City</span>
              </button>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={() => openBooking('skilled-nursing')}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-blue-500/25 hover:shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                {t('hero_cta_book')}
              </button>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5">
                <a
                  href={`tel:${selectedCity.emergencyPhone}`}
                  className="px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{selectedCity.emergencyPhone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedCity.whatsappPhone}?text=Hi%20HomeCare247,%20I%20am%20looking%20for%20home%20nursing%20care%20in%20${selectedCity.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-sm flex items-center justify-center gap-2 transition"
                  title="WhatsApp Consultation"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* AI Generated Real Hero Image Showcase */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl mb-6 sm:mb-8 group bg-slate-900">
              <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full overflow-hidden">
                <Image
                  src="/images/hero-homecare.jpg"
                  alt="Compassionate HomeCare 24/7 nurse caring for senior patient at home"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 700px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                {/* Floating Glassmorphic Badges */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>24/7 Home Visits Active in {selectedCity.name}</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NABH & Police Verified</span>
                  </div>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-3 text-white">
                  <div>
                    <p className="text-xs sm:text-base font-extrabold tracking-tight drop-shadow">
                      Compassionate Clinical Care in the Comfort of Your Home
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-200 font-medium drop-shadow mt-0.5">
                      Empowering families with hospital-standard nursing, ICU & geriatric recovery
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-black shrink-0 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9 / 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Three key trust bullet badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-200/80 text-xs sm:text-sm font-bold text-slate-700 mb-6 sm:mb-8">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('hero_badge_verified')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{t('hero_badge_doctor')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{t('hero_badge_replace')}</span>
              </div>
            </div>

            {/* Live Trust Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('hero_trust_stat_1')}</div>
                <div className="text-xs text-slate-500 font-semibold mt-1">{t('hero_trust_label_1')}</div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">{t('hero_trust_stat_2')}</div>
                <div className="text-xs text-slate-500 font-semibold mt-1">{t('hero_trust_label_2')}</div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight flex items-center gap-1">
                  <span>{t('hero_trust_stat_3')}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">{t('hero_trust_label_3')}</div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">{t('hero_trust_stat_4')}</div>
                <div className="text-xs text-slate-500 font-semibold mt-1">{t('hero_trust_label_4')}</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Quick Booking / Quote Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 overflow-hidden">
              {/* Card top gradient bar */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500" />

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2.5 border border-blue-200">
                  <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                  <span>Immediate Medical Callback</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t('quick_quote_title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {t('quick_quote_sub')}
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Thank you, {quickForm.name || 'Friend'}!</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Our Senior Clinical Care Coordinator in <strong>{selectedCity.name}</strong> has received your request. We will call you within 10 minutes at <strong>{quickForm.phone}</strong>.
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                    Need immediate assistance right now? Call{' '}
                    <a href={`tel:${selectedCity.emergencyPhone}`} className="text-blue-600 font-bold underline">
                      {selectedCity.emergencyPhone}
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setQuickForm({ name: '', phone: '', serviceId: 'skilled-nursing', shift: '12d', area: '' });
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline pt-2 inline-block"
                  >
                    Submit another requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  {/* Service selection */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('quick_label_service')}
                    </label>
                    <select
                      value={quickForm.serviceId}
                      onChange={(e) => setQuickForm({ ...quickForm, serviceId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {t(s.titleKey)} ({s.startingPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shift Duration */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('quick_label_shift')}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setQuickForm({ ...quickForm, shift: '12d' })}
                        className={`p-2.5 rounded-xl border text-left font-bold transition ${
                          quickForm.shift === '12d'
                            ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        ☀️ 12h Day Shift
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickForm({ ...quickForm, shift: '24h' })}
                        className={`p-2.5 rounded-xl border text-left font-bold transition ${
                          quickForm.shift === '24h'
                            ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        🌙 24h Live-in Shift
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('quick_label_name')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('quick_placeholder_name')}
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('quick_label_phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder={t('quick_placeholder_phone')}
                      value={quickForm.phone}
                      onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>

                  {/* City & Locality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t('quick_label_city')}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCityModalOpen(true)}
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between text-left hover:bg-slate-100 transition"
                      >
                        <span className="truncate">{selectedCity.name}</span>
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t('quick_label_area')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('quick_placeholder_area')}
                        value={quickForm.area}
                        onChange={(e) => setQuickForm({ ...quickForm, area: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-black rounded-xl text-base shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-2"
                  >
                    {formLoading ? t('quick_btn_submitting') : t('quick_btn_submit')}
                  </button>

                  <p className="text-xs text-slate-500 text-center font-medium pt-1">
                    {t('quick_privacy')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
