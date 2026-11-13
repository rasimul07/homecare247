'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQS, FAQ_CONTENT } from '@/data/faqs';
import { ChevronDown, HelpCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { SpotlightCard } from '@/components/SpotlightCard';

export function FaqSection() {
  const { language, t } = useLanguage();
  const { selectedCity } = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80 w-full max-w-full overflow-hidden relative font-sans">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 w-full relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold tracking-wide mb-3 border border-blue-200 shadow-xs">
              <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
              <span>Transparent Medical Guidance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              {t('faq_heading')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              {t('faq_sub')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const content = FAQ_CONTENT[faq.questionKey]?.[language] ||
              FAQ_CONTENT[faq.questionKey]?.en || {
                q: faq.questionKey,
                a: faq.answerKey,
              };

            const isOpen = openIndex === idx;

            return (
              <RevealOnScroll key={idx} delayMs={idx * 40}>
                <div
                  className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden ${
                    isOpen ? 'border-blue-300 shadow-md ring-1 ring-blue-500/10' : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full p-5 sm:p-6 text-left font-bold text-sm sm:text-base text-slate-950 flex items-center justify-between gap-4 hover:text-blue-600 transition cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{content.q}</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 animate-fadeIn">
                      <p>{content.a}</p>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Contact help card */}
        <RevealOnScroll delayMs={200}>
          <SpotlightCard className="mt-12 p-6 sm:p-8 rounded-3xl bg-blue-50/80 border border-blue-200/90 text-center flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Free Clinical Consultation</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                Have a specific clinical setup or rare medical condition?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Speak directly with our Chief Nursing Officer in {selectedCity.name} for free care planning advice.
              </p>
            </div>
            <a
              href={`tel:${selectedCity.phone}`}
              className="btn-avalanche-primary px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-slate-900/10 flex items-center gap-2 shrink-0 cursor-pointer text-white"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call {selectedCity.phone}</span>
            </a>
          </SpotlightCard>
        </RevealOnScroll>
      </div>
    </section>
  );
}
