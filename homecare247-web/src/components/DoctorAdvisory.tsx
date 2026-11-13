'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Award, ShieldCheck, Stethoscope, HeartPulse } from 'lucide-react';

export function DoctorAdvisory() {
  const { t } = useLanguage();

  const doctors = [
    {
      nameKey: 'doc1_name',
      roleKey: 'doc1_role',
      expKey: 'doc1_exp',
      specialty: 'Critical Care & Pulmonology',
      initials: 'DR'
    },
    {
      nameKey: 'doc2_name',
      roleKey: 'doc2_role',
      expKey: 'doc2_exp',
      specialty: 'Geriatric Medicine & Neuro-Care',
      initials: 'AR'
    },
    {
      nameKey: 'doc3_name',
      roleKey: 'doc3_role',
      expKey: 'doc3_exp',
      specialty: 'Infection Control & Nursing Standards',
      initials: 'NB'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>Clinical Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('doc_heading')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('doc_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {doctors.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                {doc.initials}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {t(doc.nameKey)}
              </h3>
              <p className="text-xs font-semibold text-blue-600 mt-1">
                {t(doc.roleKey)}
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium mt-3">
                {doc.specialty}
              </span>
              <p className="text-xs text-slate-500 mt-3 border-t border-slate-100 pt-3 w-full">
                {t(doc.expKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

