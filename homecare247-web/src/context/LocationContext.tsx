'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CityData } from '@/types';
import { DEFAULT_CITY, findClosestCity, getCityById } from '@/data/cities';

interface LocationContextType {
  selectedCity: CityData;
  setSelectedCity: (city: CityData) => void;
  isDetecting: boolean;
  detectedLocality: string | null;
  detectLocationGPS: () => Promise<void>;
  isCityModalOpen: boolean;
  setIsCityModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<CityData>(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [detectedLocality, setDetectedLocality] = useState<string | null>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  // Load saved city or auto-detect on mount
  useEffect(() => {
    let isMounted = true;

    async function initLocation() {
      // 1. Check local storage first
      try {
        const savedCityId = localStorage.getItem('homecare247_city');
        if (savedCityId) {
          const matched = getCityById(savedCityId);
          if (matched && isMounted) {
            setSelectedCityState(matched);
            setIsDetecting(false);
            return;
          }
        }
      } catch {
        // localStorage unavailable
      }

      // 2. Auto-detect via free IP-based geolocation
      try {
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const cityName = (data.city || '').toLowerCase();
          const region = (data.region || '').toLowerCase();

          if (isMounted) {
            setDetectedLocality(data.city || data.region || null);
          }

          // Check if city name or region matches any of our major cities
          if (cityName.includes('kolkata') || region.includes('bengal') || cityName.includes('howrah')) {
            setSelectedCityState(getCityById('kolkata'));
          } else if (cityName.includes('delhi') || cityName.includes('noida') || cityName.includes('gurgaon') || cityName.includes('gurugram') || cityName.includes('ghaziabad')) {
            setSelectedCityState(getCityById('delhi-ncr'));
          } else if (cityName.includes('mumbai') || cityName.includes('thane') || cityName.includes('navi mumbai')) {
            setSelectedCityState(getCityById('mumbai'));
          } else if (cityName.includes('bangalore') || cityName.includes('bengaluru')) {
            setSelectedCityState(getCityById('bengaluru'));
          } else if (cityName.includes('hyderabad') || cityName.includes('secunderabad')) {
            setSelectedCityState(getCityById('hyderabad'));
          } else if (cityName.includes('pune')) {
            setSelectedCityState(getCityById('pune'));
          } else if (cityName.includes('chennai') || cityName.includes('madras')) {
            setSelectedCityState(getCityById('chennai'));
          } else if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            const closest = findClosestCity(data.latitude, data.longitude);
            if (isMounted) setSelectedCityState(closest);
          }
        }
      } catch {
        // Fallback gracefully to default city (Kolkata)
      } finally {
        if (isMounted) setIsDetecting(false);
      }
    }

    initLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const setSelectedCity = (city: CityData) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem('homecare247_city', city.id);
    } catch {
      // Ignore
    }
  };

  const detectLocationGPS = async (): Promise<void> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const closest = findClosestCity(latitude, longitude);
        setSelectedCity(closest);
        setDetectedLocality(`GPS: Near ${closest.name}`);
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
        alert('Could not access your location. Please choose your city manually.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        isDetecting,
        detectedLocality,
        detectLocationGPS,
        isCityModalOpen,
        setIsCityModalOpen
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

