'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Stethoscope } from 'lucide-react';

export function DoctorAdvisory() {
  const { t } = useLanguage();

  const doctors = [
    {
      nameKey: 'doc1_name',
      roleKey: 'doc1_role',
      expKey: 'doc1_exp',
      specialty: 'Critical Care & Pulmonology',
      initials: 'DR',
      image: '/images/dr-debabrata-roy.jpg'
    },
    {
      nameKey: 'doc2_name',
      roleKey: 'doc2_role',
      expKey: 'doc2_exp',
      specialty: 'Geriatric Medicine & Neuro-Care',
      initials: 'AR',
      image: '/images/dr-ananya-roychowdhury.jpg'
    },
    {
      nameKey: 'doc3_name',
      roleKey: 'doc3_role',
      expKey: 'doc3_exp',
      specialty: 'Infection Control & Nursing Standards',
      initials: 'NB',
      image: '/images/sister-nirmala-bose.jpg'
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
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-blue-500/10 mb-4 ring-2 ring-blue-500/30">
                <Image
                  src={doc.image}
                  alt={t(doc.nameKey)}
                  fill
                  className="object-cover object-top group-hover:scale-108 transition-transform duration-500"
                  sizes="112px"
                />
                <div
                  className="absolute bottom-0.5 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow"
                  title="Verified Clinical Leadership"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                {t(doc.nameKey)}
              </h3>
              <p className="text-xs font-semibold text-blue-600 mt-1">
                {t(doc.roleKey)}
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold mt-3 border border-blue-100">
                {doc.specialty}
              </span>
              <p className="text-xs text-slate-500 mt-3 border-t border-slate-100 pt-3 w-full leading-relaxed">
                {t(doc.expKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

