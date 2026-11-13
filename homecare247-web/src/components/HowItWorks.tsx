'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/context/BookingContext';
import { SpotlightCard } from '@/components/SpotlightCard';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { PhoneCall, UserCheck2, Home, ActivitySquare, ArrowRight, Sparkles } from 'lucide-react';

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
    <section className="py-16 sm:py-24 bg-white text-slate-900 relative overflow-hidden w-full max-w-full border-y border-slate-200/80 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-50/60 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Simple 4-Step Clinical Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
              {t('how_heading')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
              {t('how_sub')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => (
            <RevealOnScroll key={idx} delayMs={idx * 90}>
              <SpotlightCard
                spotlightColor="rgba(37, 99, 235, 0.08)"
                className="h-full bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 relative hover:border-blue-400 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                      {st.icon}
                    </div>
                    <span className="text-3xl font-black text-slate-300 group-hover:text-blue-600 transition font-sans">
                      {st.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {t(st.titleKey)}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t(st.descKey)}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-14 text-center">
          <RevealOnScroll delayMs={200}>
            <button
              onClick={() => openBooking()}
              className="btn-avalanche-primary group/btn inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm sm:text-base cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <span>Start Free Assessment Now</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1.5 transition-transform duration-300" />
            </button>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
