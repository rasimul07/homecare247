'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/context/BookingContext';
import { PhoneCall, UserCheck2, Home, ActivitySquare, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const { t } = useLanguage();
  const { openBooking } = useBooking();

  const steps = [
    {
      num: '01',
      titleKey: 'how_step1_title',
      descKey: 'how_step1_desc',
      icon: <PhoneCall className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      num: '02',
      titleKey: 'how_step2_title',
      descKey: 'how_step2_desc',
      icon: <UserCheck2 className="w-6 h-6 text-teal-600" />,
      color: 'from-teal-500 to-teal-600'
    },
    {
      num: '03',
      titleKey: 'how_step3_title',
      descKey: 'how_step3_desc',
      icon: <Home className="w-6 h-6 text-indigo-600" />,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      num: '04',
      titleKey: 'how_step4_title',
      descKey: 'how_step4_desc',
      icon: <ActivitySquare className="w-6 h-6 text-emerald-600" />,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <section className="py-14 sm:py-24 bg-slate-900 text-white relative overflow-hidden w-full max-w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
            Simple 4-Step Patient Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {t('how_heading')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            {t('how_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 relative hover:border-blue-500/60 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-700/80 flex items-center justify-center">
                    {st.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-700 group-hover:text-blue-400 transition">
                    {st.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition">
                  {t(st.titleKey)}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t(st.descKey)}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => openBooking()}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5"
          >
            Start Free Assessment Now
          </button>
        </div>
      </div>
    </section>
  );
}

