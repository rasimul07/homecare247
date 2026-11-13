'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { ServicesSection } from '@/components/ServicesSection';
import { ServiceCostCalculator } from '@/components/ServiceCostCalculator';
import { CityAvailabilitySection } from '@/components/CityAvailabilitySection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { HowItWorks } from '@/components/HowItWorks';
import { DoctorAdvisory } from '@/components/DoctorAdvisory';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';

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
