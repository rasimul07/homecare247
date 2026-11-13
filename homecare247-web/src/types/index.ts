export type Language = 'en' | 'hi' | 'bn';

export interface CityData {
  id: string;
  name: string;
  state: string;
  phone: string;
  emergencyPhone: string;
  whatsappPhone: string;
  address: string;
  hubName: string;
  availableStaffCount: number;
  avgResponseMinutes: number;
  popularAreas: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ServiceItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  badge?: string;
  iconName: string;
  category: 'nursing' | 'elderly' | 'critical' | 'equipment' | 'rehab' | 'diagnostics';
  startingPrice: string;
  pricePeriod: string;
  keyFeatures: string[];
  clinicalProcedures?: string[];
  popularFor: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  relationship: string;
  service: string;
  cityId: string;
  cityName: string;
  rating: number;
  comment: string;
  commentHi?: string;
  commentBn?: string;
  date: string;
  verifiedPatient: boolean;
  avatarUrl?: string;
}

export interface FAQItem {
  questionKey: string;
  answerKey: string;
  category: string;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  serviceId: string;
  shiftDuration: string;
  patientCondition: string;
  startDate: string;
  notes?: string;
}

