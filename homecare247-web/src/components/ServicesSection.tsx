'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import { SERVICES, SERVICE_CATEGORIES } from '@/data/services';
import { SpotlightCard } from '@/components/SpotlightCard';
import {
  Stethoscope,
  HeartHandshake,
  Activity,
  ShieldPlus,
  UserCheck,
  PackageCheck,
  FlaskConical,
  Baby,
  ArrowRight,
  ArrowLeft,
  Phone,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';

export function ServicesSection() {
  const { t } = useLanguage();
  const { selectedCity } = useLocation();
  const { openBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState('all');

  // Carousel Slider Refs and State
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-teal-600" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-rose-600" />;
      case 'ShieldPlus':
        return <ShieldPlus className="w-4 h-4 text-indigo-600" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-amber-600" />;
      case 'PackageCheck':
        return <PackageCheck className="w-4 h-4 text-purple-600" />;
      case 'FlaskConical':
        return <FlaskConical className="w-4 h-4 text-cyan-600" />;
      case 'Baby':
        return <Baby className="w-4 h-4 text-pink-600" />;
      default:
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
    }
  };

  // Scroll listener to update progress bar and arrow states
  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setActiveSlideIndex(0);
      return;
    }

    const currentScroll = el.scrollLeft;
    const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
    setScrollProgress(progress);
    setCanScrollLeft(currentScroll > 15);
    setCanScrollRight(currentScroll < maxScroll - 15);

    const cardEl = el.firstElementChild as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 20 : 420;
    const approxIndex = Math.round(currentScroll / cardWidth);
    setActiveSlideIndex(Math.min(filteredServices.length - 1, Math.max(0, approxIndex)));
  }, [filteredServices.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, activeCategory]);

  const scrollSlider = (direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;

    const cardEl = el.firstElementChild as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 20 : 420;
    const amount = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = sliderRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (serviceId: string) => {
    if (hasMovedRef.current) return;
    openBooking(serviceId);
  };

  return (
    <section
      id="services"
      className="py-6 sm:py-8 lg:py-10 bg-slate-50/70 text-slate-900 w-full max-w-full overflow-hidden relative border-y border-slate-200/80 font-sans select-none min-h-[580px] lg:min-h-[640px] lg:max-h-[820px] flex flex-col justify-between"
    >
      {/* Background Ambient Radial Glows (Hospital White & Soft Medical Blue) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[130px] pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-teal-100/40 rounded-full blur-[130px] pointer-events-none -ml-40 -mb-40" />

      {/* Main Contained Wrapper - Fits within standard screen height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col justify-between h-full flex-1">
        
        {/* Compact Header Row: Stacked Title + Filter Pills + Arrow Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 pb-3 border-b border-slate-200/80 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold tracking-wider uppercase mb-1.5 shadow-xs">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Hospital Protocols • 24/7 Standby in {selectedCity.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight uppercase leading-[1.08]">
              Comprehensive Care{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Clinical Impact
              </span>
            </h2>
          </div>

          {/* Right: Category Pills & Navigation Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end overflow-hidden max-w-full">
            {/* Category Filter Pills (Scrollable on mobile) */}
            <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1 max-w-[260px] sm:max-w-[420px] lg:max-w-none">
              {SERVICE_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                        : 'bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span>{t(cat.labelKey)}</span>
                  </button>
                );
              })}
            </div>

            {/* Circular Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                disabled={!canScrollLeft}
                aria-label="Previous service"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'border-slate-300 hover:border-blue-600 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-40'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollSlider('right')}
                disabled={!canScrollRight}
                aria-label="Next service"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? 'border-slate-300 hover:border-blue-600 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-40'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] font-bold text-slate-500 pl-1 shrink-0">
                <span className="text-slate-900 font-extrabold">{String(activeSlideIndex + 1).padStart(2, '0')}</span>
                <span className="text-slate-400 mx-0.5">/</span>
                <span>{String(filteredServices.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            CARD DISPLAY AREA (White Theme: Screen-Height Fitted)
            ======================================================== */}
        <div className="my-auto py-3">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 cursor-grab active:cursor-grabbing w-full"
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleCardClick(service.id)}
                className="w-[85vw] sm:w-[360px] md:w-[390px] lg:w-[420px] shrink-0 snap-start flex flex-col justify-between group select-none"
              >
                <SpotlightCard
                  spotlightColor="rgba(37, 99, 235, 0.08)"
                  className="h-full bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Visual 16:9 Image Header */}
                    {service.imageUrl && (
                      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={service.imageUrl}
                          alt={t(service.titleKey)}
                          fill
                          sizes="(max-width: 768px) 85vw, 420px"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-800 border border-white/20 shadow-sm backdrop-blur-md uppercase tracking-wider">
                            Hospital Protocol
                          </span>
                          {service.badge && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-sm border border-white/20 backdrop-blur-md">
                              {service.badge}
                            </span>
                          )}
                        </div>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-100 flex items-center justify-center p-1.5 shadow-md">
                            {getServiceIcon(service.iconName)}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-blue-700 border border-white/30 backdrop-blur-md shadow-xs">
                            ⏱ ~{selectedCity.avgResponseMinutes}m Dispatch
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Body - White Theme */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight uppercase group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                        {t(service.titleKey)}
                      </h3>
                      <p className="text-[11px] text-blue-600 font-bold mt-0.5 line-clamp-1">
                        {t(service.subtitleKey)}
                      </p>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                        {t(service.descriptionKey)}
                      </p>

                      {/* Pricing + Key Specs Row */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block leading-none">
                            {t('service_starting_at')}
                          </span>
                          <span className="text-lg font-black text-slate-900 tracking-tight">
                            {service.startingPrice}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 text-right max-w-[170px] leading-tight">
                          {service.pricePeriod}
                        </span>
                      </div>

                      {/* 2 Key Clinical Features Pills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {service.keyFeatures.slice(0, 2).map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate max-w-[160px]">{feat}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBooking(service.id);
                      }}
                      className="group/btn inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      <span>{t('service_book_now')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>

                    <a
                      href={`tel:${selectedCity.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-600 text-emerald-600 hover:text-white border border-slate-200 transition-all flex items-center justify-center shrink-0 shadow-xs"
                      title={`Call helpline for ${t(service.titleKey)}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>

        {/* Continuous Horizontal Scroll Progress Track & Helpline Footer */}
        <div className="pt-2 shrink-0">
          <div className="h-[2px] bg-slate-200 relative w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-150 rounded-full"
              style={{ width: `${Math.max(12, scrollProgress)}%` }}
            />
          </div>
          
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="hidden sm:inline">
              ← Drag or swipe horizontally to explore 24/7 care shifts →
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span>Emergency ICU Standby:</span>
              <a
                href={`tel:${selectedCity.emergencyPhone}`}
                className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2"
              >
                {selectedCity.emergencyPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
