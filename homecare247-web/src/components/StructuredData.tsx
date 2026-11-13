'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { DEFAULT_CITY } from '@/data/cities';
import { FAQS, FAQ_CONTENT } from '@/data/faqs';
import { SERVICES } from '@/data/services';

export function StructuredData() {
  let selectedCity = DEFAULT_CITY;

  try {
    const loc = useLocation();
    if (loc?.selectedCity) {
      selectedCity = loc.selectedCity;
    }
  } catch {
    // Graceful fallback to DEFAULT_CITY for SSR / prerender
  }

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness', 'EmergencyService'],
    name: `HomeCare 24/7 - Home Nursing, Elderly Care & ICU Setup at Home in ${selectedCity.name}`,
    image: 'https://homecare247.com/og-image.jpg',
    '@id': `https://homecare247.com/#${selectedCity.id}`,
    url: 'https://homecare247.com',
    telephone: selectedCity.emergencyPhone,
    priceRange: '₹₹ - ₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking, Insurance Domiciliary',
    address: {
      '@type': 'PostalAddress',
      streetAddress: selectedCity.address,
      addressLocality: selectedCity.name,
      addressRegion: selectedCity.state,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: selectedCity.coordinates.lat,
      longitude: selectedCity.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '4890',
    },
    medicalSpecialty: [
      'Nursing',
      'Geriatrics',
      'CriticalCare',
      'Physiotherapy',
      'PalliativeCare',
    ],
    availableService: SERVICES.map((s) => ({
      '@type': 'MedicalProcedure',
      name: s.id.replace('-', ' ').toUpperCase(),
      procedureType: 'https://schema.org/PercutaneousProcedure',
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: FAQ_CONTENT[faq.questionKey]?.en?.q || faq.questionKey,
      acceptedAnswer: {
        '@type': 'Answer',
        text: FAQ_CONTENT[faq.questionKey]?.en?.a || faq.answerKey,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
