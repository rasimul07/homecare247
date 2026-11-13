'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { SpotlightCard } from '@/components/SpotlightCard';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { CounterNumber } from '@/components/CounterNumber';
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

interface OptionType {
  id: string;
  name: string;
  baseDaily: number;
  badge?: string;
}

export function ServiceCostCalculator() {
  const { t } = useLanguage();
  const { selectedCity } = useLocation();
  const { openBooking } = useBooking();

  const servicesList: OptionType[] = [
    { id: 'skilled-nursing', name: 'Skilled Nursing Care (GNM / B.Sc)', baseDaily: 1499, badge: 'Most Popular' },
    { id: 'bedside-attendant', name: 'Bedside Caregiver / Ayah Service', baseDaily: 950 },
    { id: 'icu-at-home', name: 'ICU at Home (Ventilator + ICU Nurse)', baseDaily: 4999, badge: 'Critical Care' },
    { id: 'elderly-dementia-care', name: 'Elderly Dementia & Parkinson’s Care', baseDaily: 1350 },
    { id: 'physiotherapy-home', name: 'Home Physiotherapy & Rehabilitation', baseDaily: 799 },
    { id: 'medical-equipment-rental', name: 'ICU Hospital Bed + Oxygen Concentrator', baseDaily: 450 },
  ];

  const shiftOptions = [
    { id: '12d', label: '12-Hour Day Shift (8 AM - 8 PM)', sub: 'Daytime monitoring & medication', multiplier: 1.0 },
    { id: '12n', label: '12-Hour Night Shift (8 PM - 8 AM)', sub: 'Overnight vitals & emergency support', multiplier: 1.05 },
    { id: '24h', label: '24-Hour Live-in Attendant (Round-the-clock)', sub: 'Continuous full-day bedside presence', multiplier: 1.65 },
    { id: 'visit', label: 'Single Visiting Procedure (Injection / Catheter / Dressing)', sub: 'Per-visit clinical intervention', multiplier: 0.65 },
  ];

  const conditionOptions = [
    { id: 'walk', labelKey: 'calc_cond_walk', desc: 'Patient can walk with minimal assistance', extra: 0 },
    { id: 'bedridden', labelKey: 'calc_cond_bedridden', desc: 'Bedbound, diaper change & mobility support required', extra: 200 },
    { id: 'critical', labelKey: 'calc_cond_critical', desc: 'Tracheostomy / Ryles tube / Catheter / Oxygen dependency', extra: 600 },
  ];

  const [selectedService, setSelectedService] = useState<string>('skilled-nursing');
  const [selectedShift, setSelectedShift] = useState<string>('12d');
  const [selectedCondition, setSelectedCondition] = useState<string>('walk');

  // Calculation
  const serviceObj = servicesList.find((s) => s.id === selectedService) || servicesList[0];
  const shiftObj = shiftOptions.find((s) => s.id === selectedShift) || shiftOptions[0];
  const conditionObj = conditionOptions.find((c) => c.id === selectedCondition) || conditionOptions[0];

  const dailyEstimate = Math.round(serviceObj.baseDaily * shiftObj.multiplier + conditionObj.extra);
  const monthlyEstimate = Math.round(dailyEstimate * 30 * 0.9); // 10% monthly discount

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-white border-y border-slate-200/80 w-full max-w-full overflow-hidden relative font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-900 text-xs font-bold tracking-wide mb-3 border border-teal-200/90 shadow-xs">
              <Calculator className="w-3.5 h-3.5 text-teal-700" />
              <span>Transparent & Standardized Healthcare Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              {t('calc_heading')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              {t('calc_sub')} Zero hidden agency fees, official GST invoices, and pre-negotiated clinical rates in {selectedCity.name}.
            </p>
          </div>
        </RevealOnScroll>

        <div className="max-w-5xl mx-auto">
          <SpotlightCard className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/90 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left Column: Interactive 3-Step Selectors (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Step 1: Select Service */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center">
                      1
                    </span>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {t('calc_select_service')}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {servicesList.map((srv) => {
                      const isSelected = selectedService === srv.id;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => setSelectedService(srv.id)}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-600/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <span className="line-clamp-1">{srv.name}</span>
                            {srv.badge && (
                              <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-md mt-1 ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                              }`}>
                                {srv.badge}
                              </span>
                            )}
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Shift Duration */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">
                      2
                    </span>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {t('calc_select_duration')}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {shiftOptions.map((sh) => {
                      const isSelected = selectedShift === sh.id;
                      return (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => setSelectedShift(sh.id)}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20 ring-2 ring-teal-600/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <span className="block line-clamp-1">{sh.label}</span>
                            <span className={`block text-[10px] font-normal mt-0.5 ${
                              isSelected ? 'text-teal-100' : 'text-slate-500'
                            }`}>
                              {sh.sub}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Patient Condition */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {t('calc_patient_condition')}
                    </label>
                  </div>
                  <div className="space-y-2">
                    {conditionOptions.map((cond) => {
                      const isSelected = selectedCondition === cond.id;
                      return (
                        <button
                          key={cond.id}
                          type="button"
                          onClick={() => setSelectedCondition(cond.id)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="block text-xs font-bold">{t(cond.labelKey)}</span>
                            <span className={`block text-[10px] font-normal mt-0.5 ${
                              isSelected ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                              {cond.desc}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: High-Trust Price Output & Clinical Summary (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-blue-200 shadow-xl flex flex-col justify-between">
                <div>
                  {/* Top card banner */}
                  <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 uppercase tracking-wide">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      <span>Custom Clinical Estimate</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {selectedCity.name} Hub
                    </span>
                  </div>

                  {/* Pricing Output */}
                  <div className="py-4 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 block">
                      {t('calc_estimated_cost')}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                        ₹{dailyEstimate.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{t('calc_per_day')}</span>
                    </div>

                    {/* Monthly Discount Badge */}
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs text-emerald-900 font-bold">
                          {t('calc_monthly_est')}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-800 whitespace-nowrap">
                        ₹{monthlyEstimate.toLocaleString('en-IN')} / mo
                      </span>
                    </div>
                  </div>

                  {/* Guaranteed Clinical Inclusions */}
                  <div className="py-4 space-y-2.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>100% Police Verified & GNM Certified Staff</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Senior MD Doctor Weekly Review & Vitals Chart</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Free Staff Replacement Guarantee within 12 Hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Official GST Tax Invoices for Insurance Claims</span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA with Avalanche Fill-Pill Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openBooking(selectedService)}
                    className="btn-avalanche-primary group/btn w-full py-4 rounded-xl text-white font-black text-sm shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span>{t('calc_book_custom')}</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                  </button>

                  <p className="text-[11px] text-slate-400 text-center mt-2.5 leading-relaxed">
                    Our Senior Care Coordinator in <strong>{selectedCity.name}</strong> will contact you within 10 minutes to verify vitals.
                  </p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
