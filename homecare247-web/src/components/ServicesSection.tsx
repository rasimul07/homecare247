'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { SERVICES, SERVICE_CATEGORIES } from '@/data/services';
import {
  Stethoscope,
  HeartHandshake,
  Activity,
  ShieldPlus,
  UserCheck,
  PackageCheck,
  FlaskConical,
  Baby,
  CheckCircle2,
  ArrowRight,
  Phone,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export function ServicesSection() {
  const { t } = useLanguage();
  const { selectedCity } = useLocation();
  const { openBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedProcedures, setExpandedProcedures] = useState<Record<string, boolean>>({});

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory);

  const toggleProcedures = (id: string) => {
    setExpandedProcedures((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-teal-600" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-rose-600" />;
      case 'ShieldPlus':
        return <ShieldPlus className="w-6 h-6 text-indigo-600" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-amber-600" />;
      case 'PackageCheck':
        return <PackageCheck className="w-6 h-6 text-purple-600" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-cyan-600" />;
      case 'Baby':
        return <Baby className="w-6 h-6 text-pink-600" />;
      default:
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="services" className="py-12 sm:py-20 lg:py-24 bg-slate-50/60 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Excellence at Home</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('services_heading')}
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            {t('services_sub')} Available 24/7 across {selectedCity.name}.
          </p>

          {/* Category Filter Pills (Swipable on mobile, wrapped on desktop) */}
          <div className="mt-5 sm:mt-8 overflow-x-auto no-scrollbar flex items-center sm:flex-wrap sm:justify-center gap-2 pb-2 px-1 w-full max-w-full">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredServices.map((service) => {
            const isExpanded = !!expandedProcedures[service.id];
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Card Top */}
                <div className="p-5 sm:p-7">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100/90 flex items-center justify-center p-2.5 group-hover:scale-105 transition shrink-0">
                      {getServiceIcon(service.iconName)}
                    </div>
                    {service.badge && (
                      <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    {t(service.subtitleKey)}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {t(service.descriptionKey)}
                  </p>

                  {/* Pricing Badge */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">{t('service_starting_at')}</span>
                      <span className="text-lg font-black text-slate-900">{service.startingPrice}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 text-right max-w-[150px]">
                      {service.pricePeriod}
                    </span>
                  </div>

                  {/* Key Features Checklist */}
                  <div className="mt-4 space-y-2">
                    {service.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Clinical Procedures List */}
                  {service.clinicalProcedures && service.clinicalProcedures.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => toggleProcedures(service.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full py-1"
                      >
                        <span>{t('service_view_details')}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-blue-200 animate-fadeIn text-[11px] text-slate-600">
                          {service.clinicalProcedures.map((proc, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              <span>{proc}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom CTA */}
                <div className="p-5 sm:p-7 pt-0 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <button
                    onClick={() => openBooking(service.id)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm text-center transition shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>{t('service_book_now')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`tel:${selectedCity.phone}`}
                    className="p-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                    title={`Call for ${t(service.titleKey)}`}
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
