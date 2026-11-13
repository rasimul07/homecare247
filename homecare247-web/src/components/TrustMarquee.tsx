'use client';

import React from 'react';
import { ShieldCheck, HeartPulse, Award, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';

export function TrustMarquee() {
  const items = [
    { icon: ShieldCheck, text: 'NABH Clinical Protocols Compliant', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { icon: Clock, text: '15-Min Rapid Emergency Doorstep Dispatch', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { icon: Award, text: '100% Police Verified & GNM Certified Nurses', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { icon: HeartPulse, text: '4-Hour Emergency ICU Setup at Home', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
    { icon: Stethoscope, text: 'Senior MD Physician Oversight Included', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { icon: CheckCircle2, text: '50,000+ Recoveries in Kolkata, Delhi, Mumbai, Bengaluru', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
    { icon: ShieldCheck, text: 'Zero Hidden Costs • Free Immediate Caregiver Replacement', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  ];

  // Duplicate items for continuous infinite seamless scroll
  const marqueeList = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden bg-white border-y border-slate-200/90 py-3.5 select-none font-sans">
      {/* Left/Right Edge Gradient Mask for seamless soft fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
        {marqueeList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-normal text-slate-700"
            >
              <div className={`w-7 h-7 rounded-xl ${item.bg} border flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="font-sans font-bold text-slate-800">{item.text}</span>
              <span className="text-slate-300 mx-2 text-base">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
