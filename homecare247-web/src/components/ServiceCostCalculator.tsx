'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

interface OptionType {
  id: string;
  name: string;
  baseDaily: number;
}

export function ServiceCostCalculator() {
  const { t } = useLanguage();
  const { selectedCity } = useLocation();
  const { openBooking } = useBooking();

  const servicesList: OptionType[] = [
    { id: 'skilled-nursing', name: 'Skilled Nursing Care (GNM / B.Sc)', baseDaily: 1499 },
    { id: 'bedside-attendant', name: 'Bedside Caregiver / Ayah Service', baseDaily: 950 },
    { id: 'icu-at-home', name: 'ICU at Home (Ventilator + ICU Nurse)', baseDaily: 4999 },
    { id: 'elderly-dementia-care', name: 'Elderly Dementia & Parkinson’s Care', baseDaily: 1350 },
    { id: 'physiotherapy-home', name: 'Home Physiotherapy & Rehabilitation', baseDaily: 799 },
    { id: 'medical-equipment-rental', name: 'ICU Hospital Bed + Oxygen Concentrator', baseDaily: 450 },
  ];

  const shiftOptions = [
    { id: '12d', label: '12-Hour Day Shift (8 AM - 8 PM)', multiplier: 1.0 },
    { id: '12n', label: '12-Hour Night Shift (8 PM - 8 AM)', multiplier: 1.05 },
    { id: '24h', label: '24-Hour Live-in Attendant (Round-the-clock)', multiplier: 1.65 },
    { id: 'visit', label: 'Single Visiting Procedure (Injection / Catheter / Dressing)', multiplier: 0.65 },
  ];

  const conditionOptions = [
    { id: 'walk', labelKey: 'calc_cond_walk', extra: 0 },
    { id: 'bedridden', labelKey: 'calc_cond_bedridden', extra: 200 },
    { id: 'critical', labelKey: 'calc_cond_critical', extra: 600 },
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
    <section id="calculator" className="py-12 sm:py-20 lg:py-24 bg-white border-y border-slate-100 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Transparent Estimate</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('calc_heading')}
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            {t('calc_sub')} Based on verified rates in {selectedCity.name}.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/80 shadow-md max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input selections (7 cols) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Step 1: Service */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                  {t('calc_select_service')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {servicesList.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between gap-2 ${
                        selectedService === srv.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="line-clamp-1">{srv.name}</span>
                      {selectedService === srv.id && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Shift */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                  {t('calc_select_duration')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {shiftOptions.map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setSelectedShift(sh.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between gap-2 ${
                        selectedShift === sh.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="line-clamp-1">{sh.label}</span>
                      {selectedShift === sh.id && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Patient Condition */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                  {t('calc_patient_condition')}
                </label>
                <div className="space-y-2">
                  {conditionOptions.map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setSelectedCondition(cond.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between gap-2 ${
                        selectedCondition === cond.id
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{t(cond.labelKey)}</span>
                      {selectedCondition === cond.id && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Calculation Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-7 border border-blue-200 shadow-lg space-y-5 sm:space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('calc_estimated_cost')}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{dailyEstimate.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{t('calc_per_day')}</span>
                </div>
                <div className="mt-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  {t('calc_monthly_est')} <span className="font-extrabold text-emerald-900">₹{monthlyEstimate.toLocaleString('en-IN')} / mo</span>
                </div>
              </div>

              {/* Breakdown features */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Includes Registered Staff in {selectedCity.name}</span>
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

              {/* Book Button */}
              <button
                onClick={() => openBooking(selectedService)}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{t('calc_book_custom')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 italic text-center">
                {t('calc_disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
