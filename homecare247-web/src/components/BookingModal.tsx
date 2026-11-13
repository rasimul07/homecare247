'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '@/context/BookingContext';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import { SERVICES } from '@/data/services';
import { CITIES } from '@/data/cities';
import { X, CheckCircle2, ShieldCheck, Clock, Phone } from 'lucide-react';

export function BookingModal() {
  const { isBookingOpen, prefilledServiceId, closeBooking } = useBooking();
  const { selectedCity } = useLocation();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const patientInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    contactName: '',
    phone: '',
    city: selectedCity.id,
    area: '',
    serviceId: prefilledServiceId || 'skilled-nursing',
    shiftDuration: '12d',
    patientCondition: '',
    startDate: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRefNumber, setBookingRefNumber] = useState('');

  // Mount check for safe createPortal execution
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync props and prefilled service
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      startDate: prev.startDate || '2026-11-12',
      serviceId: prefilledServiceId || prev.serviceId,
      city: selectedCity?.id || prev.city,
    }));
  }, [prefilledServiceId, selectedCity]);

  // Zero-CLS Body Scroll Lock and Escape Key Listener
  useEffect(() => {
    if (!isBookingOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBookingOpen]);

  // Autofocus first input on open
  useEffect(() => {
    if (isBookingOpen && !isSubmitted) {
      const timer = setTimeout(() => {
        patientInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isBookingOpen, isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const selectedService = SERVICES.find((s) => s.id === formData.serviceId);
      const res = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName,
          contactName: formData.contactName,
          phone: formData.phone,
          cityId: selectedCity.id,
          cityName: selectedCity.name,
          area: formData.area || selectedCity.popularAreas?.[0] || 'Central Area',
          serviceId: formData.serviceId,
          serviceName: selectedService ? selectedService.id : '24/7 Skilled Nursing',
          shiftDuration: formData.shiftDuration,
          patientCondition: formData.patientCondition || 'Homecare medical assessment',
          startDate: formData.startDate || new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await res.json();
      if (data?.data?.bookingNumber) {
        setBookingRefNumber(data.data.bookingNumber);
      }
    } catch (err) {
      console.warn('Backend request failed or offline, using client fallback', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setBookingRefNumber('');
    closeBooking();
  };

  if (!isBookingOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-modal-backdrop cursor-pointer"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-modal-card cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-teal-600 text-white shrink-0">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Clinical Protocol</span>
            </div>
            <h3 id="booking-modal-title" className="text-lg sm:text-xl font-bold">
              {t('modal_title')}
            </h3>
            <p className="text-xs text-blue-100 mt-0.5 hidden sm:block">{t('modal_sub')}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">{t('modal_success_title')}</h4>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                {t('modal_success_msg')}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
                {bookingRefNumber && (
                  <div className="flex items-center justify-between pb-2 mb-1 border-b border-blue-200/70">
                    <span className="font-bold text-blue-900">Reference Number:</span>
                    <span className="font-black text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {bookingRefNumber}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Selected City:</span>
                  <span className="font-bold text-slate-900 capitalize">{selectedCity.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Service:</span>
                  <span className="font-bold text-blue-700">
                    {SERVICES.find((s) => s.id === formData.serviceId)?.category || 'Healthcare'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Shift:</span>
                  <span className="font-bold text-slate-900">{formData.shiftDuration.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Emergency Support Line:</span>
                  <a href={`tel:${selectedCity.emergencyPhone}`} className="font-bold text-emerald-600">
                    {selectedCity.emergencyPhone}
                  </a>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-blue-500/20"
                >
                  {t('modal_close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('modal_patient_name')} *
                  </label>
                  <input
                    ref={patientInputRef}
                    type="text"
                    required
                    placeholder="e.g. Ratan Sen"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('modal_phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('modal_service')}
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {t(srv.titleKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('modal_shift')}
                  </label>
                  <select
                    value={formData.shiftDuration}
                    onChange={(e) => setFormData({ ...formData, shiftDuration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="12d">{t('quick_shift_12d')}</option>
                    <option value="12n">{t('quick_shift_12n')}</option>
                    <option value="24h">{t('quick_shift_24h')}</option>
                    <option value="visit">{t('quick_shift_visit')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('modal_city')}
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('modal_area')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Salt Lake / Indirapuram"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('modal_condition')}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('modal_condition_ph')}
                  value={formData.patientCondition}
                  onChange={(e) => setFormData({ ...formData, patientCondition: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>We contact you within 10-15 mins with nurse availability & free doctor review.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-blue-500/25 disabled:opacity-50"
              >
                {isSubmitting ? t('quick_btn_submitting') : t('modal_submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
