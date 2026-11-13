import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { LocationProvider } from '@/context/LocationContext';
import { BookingProvider } from '@/context/BookingContext';
import { CityModal } from '@/components/CityModal';
import { BookingModal } from '@/components/BookingModal';
import { StickyBottomBar } from '@/components/StickyBottomBar';
import { StructuredData } from '@/components/StructuredData';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://homecare247.com'),
  title: {
    default: 'HomeCare 24/7 | 24/7 Home Nursing, Elderly Care & ICU Setup at Home',
    template: '%s | HomeCare 24/7',
  },
  description:
    'NABH compliant 24/7 home nursing care, bedside elderly attendants, ICU setup at home, physiotherapy, and medical equipment rental. 100% police-verified staff with senior MD doctor oversight in Kolkata, Delhi NCR, Mumbai, Bengaluru, and major metros.',
  keywords: [
    'home nursing care',
    'home nursing service kolkata',
    'elderly care at home',
    '24 hours ayah service',
    'ICU setup at home',
    'medical equipment rental',
    'home physiotherapy',
    'tracheostomy care at home',
    'catheterization at home',
    'ryles tube feeding',
    'bedsore dressing at home',
    'caremate homecare',
    '2050 healthcare',
    'patient attendant at home',
    'dementia care at home',
  ],
  authors: [{ name: 'HomeCare 24/7 Clinical Team' }],
  creator: 'HomeCare 24/7 Healthcare Services',
  publisher: 'HomeCare 24/7 Healthcare Services',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://homecare247.com',
    languages: {
      'en-IN': 'https://homecare247.com?lang=en',
      'hi-IN': 'https://homecare247.com?lang=hi',
      'bn-IN': 'https://homecare247.com?lang=bn',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://homecare247.com',
    siteName: 'HomeCare 24/7',
    title: 'HomeCare 24/7 | 24/7 Home Nursing, Elderly Care & ICU at Home',
    description:
      'India’s most trusted 24/7 home nursing and elderly care service. 100% police-verified GNM nurses and bedside caregivers with doctor supervision.',
    images: [
      {
        url: 'https://homecare247.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HomeCare 24/7 Home Nursing and Healthcare Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeCare 24/7 | 24/7 Verified Home Nursing & Elderly Care',
    description:
      'Hospital-standard clinical nursing, ICU setup, and compassionate elderly attendants at home.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          <LocationProvider>
            <BookingProvider>
              <StructuredData />
              {children}
              <CityModal />
              <BookingModal />
              <StickyBottomBar />
            </BookingProvider>
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
