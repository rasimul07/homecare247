'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQS, FAQ_CONTENT } from '@/data/faqs';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

export function FaqSection() {
  const { language, t } = useLanguage();
  const { selectedCity } = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-14 sm:py-24 bg-slate-50/60 border-b border-slate-100 w-full max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('faq_heading')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('faq_sub')}
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const content = FAQ_CONTENT[faq.questionKey]?.[language] ||
              FAQ_CONTENT[faq.questionKey]?.en || {
                q: faq.questionKey,
                a: faq.answerKey,
              };

            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:text-blue-600 transition"
                  aria-expanded={isOpen}
                >
                  <span>{content.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-100 text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                    <p>{content.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact help card */}
        <div className="mt-10 p-6 rounded-3xl bg-blue-50 border border-blue-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-slate-900">Have a specific medical requirement or rare condition?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Speak with our Chief Nursing Officer in {selectedCity.name} for free advice.</p>
          </div>
          <a
            href={`tel:${selectedCity.phone}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call {selectedCity.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

