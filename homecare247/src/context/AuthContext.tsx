import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { CityHub, Role, User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedCity: CityHub;
  cities: CityHub[];
  login: (email: string, pass: string) => Promise<User>;
  quickLogin: (targetRole: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'CUSTOMER') => Promise<User>;
  logout: () => void;
  setSelectedCity: (city: CityHub) => void;
  refreshUser: () => Promise<void>;
}

const DEFAULT_CITY: CityHub = {
  id: 'kolkata',
  name: 'Kolkata',
  state: 'West Bengal',
  phone: '+91 33 2470 1100',
  emergencyPhone: '+91 98300 24701',
  whatsappPhone: '919830024701',
  availableStaffCount: 42,
  avgResponseMinutes: 30,
  popularAreas: ['Salt Lake', 'New Town', 'Ballygunge', 'Alipore', 'Behala', 'Howrah'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cities, setCities] = useState<CityHub[]>([DEFAULT_CITY]);
  const [selectedCity, setSelectedCityState] = useState<CityHub>(DEFAULT_CITY);

  // Initialize from storage & fetch current profile
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getToken();
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (e) {
          console.warn('Saved session expired, logging out');
          api.logout();
          setToken(null);
          setUser(null);
        }
      }

      // Fetch cities
      try {
        const fetchedCities = await api.getCities();
        if (fetchedCities && fetchedCities.length > 0) {
          setCities(fetchedCities);
          const savedCityId = localStorage.getItem('homecare247_selected_city');
          const found = fetchedCities.find((c) => c.id === savedCityId);
          if (found) {
            setSelectedCityState(found);
          } else {
            setSelectedCityState(fetchedCities[0]);
          }
        }
      } catch (e) {
        console.warn('Could not fetch cities, using default', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setSelectedCity = (city: CityHub) => {
    setSelectedCityState(city);
    localStorage.setItem('homecare247_selected_city', city.id);
  };

  const login = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const { accessToken, user: loggedInUser } = await api.login(email, pass);
      setToken(accessToken);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (targetRole: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'CUSTOMER'): Promise<User> => {
    const credentials = {
      ADMIN: { email: 'admin@homecare247.com', pass: 'Admin@HomeCare2026' },
      DOCTOR: { email: 'dr.arindam@homecare247.com', pass: 'Doctor@HomeCare2026' },
      NURSE: { email: 'priya.nurse@homecare247.com', pass: 'Nurse@HomeCare2026' },
      CUSTOMER: { email: 'customer@homecare247.com', pass: 'Customer@HomeCare2026' },
    };

    const cred = credentials[targetRole];
    return login(cred.email, cred.pass);
  };

  const logout = () => {
    api.logout();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.getMe();
      setUser(profile);
    } catch (e) {
      console.warn('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        selectedCity,
        cities,
        login,
        quickLogin,
        logout,
        setSelectedCity,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
