'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { ServicesSection } from '@/components/ServicesSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';

// Code-split below-the-fold interactive sections for optimized FCP, TBT & Core Web Vitals
const ServiceCostCalculator = dynamic(
  () => import('@/components/ServiceCostCalculator').then((mod) => mod.ServiceCostCalculator)
);
const CityAvailabilitySection = dynamic(
  () => import('@/components/CityAvailabilitySection').then((mod) => mod.CityAvailabilitySection)
);
const DoctorAdvisory = dynamic(
  () => import('@/components/DoctorAdvisory').then((mod) => mod.DoctorAdvisory)
);
const TestimonialsSection = dynamic(
  () => import('@/components/TestimonialsSection').then((mod) => mod.TestimonialsSection)
);
const FaqSection = dynamic(
  () => import('@/components/FaqSection').then((mod) => mod.FaqSection)
);

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0 w-full max-w-full overflow-x-hidden">
        <Hero />
        <EmergencyBanner />
        <ServicesSection />
        <ServiceCostCalculator />
        <CityAvailabilitySection />
        <WhyChooseUs />
        <HowItWorks />
        <DoctorAdvisory />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
