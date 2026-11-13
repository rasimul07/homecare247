'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { TESTIMONIALS } from '@/data/testimonials';
import { Star, ShieldCheck, MapPin, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const { language, t } = useLanguage();
  const { selectedCity } = useLocation();
  const [filterCity, setFilterCity] = useState<string>('all');

  const filtered = filterCity === 'all'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((item) => item.cityId === filterCity);

  return (
    <section id="testimonials" className="py-14 sm:py-24 bg-white border-b border-slate-100 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 / 5 Rating from 50,000+ Families</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('test_heading')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('test_sub')}
          </p>

          {/* Quick city filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setFilterCity('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                filterCity === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Cities ({TESTIMONIALS.length})
            </button>
            <button
              onClick={() => setFilterCity(selectedCity.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
                filterCity === selectedCity.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Reviews from {selectedCity.name}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((item) => {
            const commentText = language === 'bn' && item.commentBn
              ? item.commentBn
              : language === 'hi' && item.commentHi
              ? item.commentHi
              : item.comment;

            return (
              <div
                key={item.id}
                className="bg-slate-50/70 rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                  </div>

                  <Quote className="w-7 h-7 text-blue-200 mb-2 group-hover:text-blue-400 transition" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{commentText}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.relationship}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-800">
                      {item.cityName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('test_verified_badge')} • {item.service}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

