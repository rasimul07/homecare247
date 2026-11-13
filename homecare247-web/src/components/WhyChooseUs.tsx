'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SpotlightCard } from '@/components/SpotlightCard';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  RefreshCw,
  CreditCard,
  HeartPulse,
  Sparkles
} from 'lucide-react';

export function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    {
      titleKey: 'why_feat1_title',
      descKey: 'why_feat1_desc',
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      titleKey: 'why_feat2_title',
      descKey: 'why_feat2_desc',
      icon: <UserCheck className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50',
      border: 'border-teal-100'
    },
    {
      titleKey: 'why_feat3_title',
      descKey: 'why_feat3_desc',
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      titleKey: 'why_feat4_title',
      descKey: 'why_feat4_desc',
      icon: <RefreshCw className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      titleKey: 'why_feat5_title',
      descKey: 'why_feat5_desc',
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      titleKey: 'why_feat6_title',
      descKey: 'why_feat6_desc',
      icon: <HeartPulse className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-white relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative z-10 w-full">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-sans font-bold tracking-wide mb-3 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Highest Clinical Trust & Safety</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {t('why_heading')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {t('why_sub')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => (
            <RevealOnScroll key={idx} delayMs={idx * 80}>
              <SpotlightCard
                className="h-full p-7 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:shadow-2xl hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-13 h-13 rounded-2xl ${feat.bg} ${feat.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-600 transition">
                  {t(feat.titleKey)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {t(feat.descKey)}
                </p>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
