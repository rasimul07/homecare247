import { CityData } from '@/types';

export const CITIES: CityData[] = [
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    phone: '+91 98300 24701',
    emergencyPhone: '+91 98300 24799',
    whatsappPhone: '919830024701',
    address: 'AA-119, Street No 69, Action Area 1, Newtown, Kolkata, WB 700163',
    hubName: 'Kolkata Central Healthcare Hub & Medical Depot',
    availableStaffCount: 38,
    avgResponseMinutes: 30,
    popularAreas: [
      'Salt Lake (Sector 1-5)',
      'Newtown & Rajarhat',
      'South Kolkata (Ballygunge, Alipore, Gariahat)',
      'Garia & Tollygunge',
      'Jadavpur & Behala',
      'Howrah & Shibpur',
      'North Kolkata (Shyambazar, Dum Dum)',
      'EM Bypass & Ruby'
    ],
    coordinates: {
      lat: 22.5726,
      lng: 88.3639
    }
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi / NCR',
    phone: '+91 98100 24702',
    emergencyPhone: '+91 98100 24799',
    whatsappPhone: '919810024702',
    address: 'Plot 44, Institutional Area, Sector 32, Gurugram & South Ext II, New Delhi',
    hubName: 'Delhi NCR Clinical Operations & ICU Center',
    availableStaffCount: 52,
    avgResponseMinutes: 35,
    popularAreas: [
      'South Delhi (Greater Kailash, Saket, Hauz Khas)',
      'Gurugram (Cyber City, Golf Course Rd, Sec 56)',
      'Noida (Sector 18, 50, 62, 137)',
      'Dwarka & Janakpuri',
      'Rohini & Pitampura',
      'Ghaziabad & Indirapuram',
      'Faridabad'
    ],
    coordinates: {
      lat: 28.6139,
      lng: 77.2090
    }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 98200 24703',
    emergencyPhone: '+91 98200 24799',
    whatsappPhone: '919820024703',
    address: 'Unit 302, Lotus Grandeur, Andheri West, Mumbai, MH 400053',
    hubName: 'Mumbai Metropolitan Care Services Hub',
    availableStaffCount: 46,
    avgResponseMinutes: 40,
    popularAreas: [
      'Andheri (East & West)',
      'Bandra, Khar & Santacruz',
      'Powai & Hiranandani',
      'South Mumbai (Worli, Colaba, Marine Lines)',
      'Thane West & Ghodbunder Rd',
      'Navi Mumbai (Vashi, Nerul, Kharghar)',
      'Borivali & Kandivali'
    ],
    coordinates: {
      lat: 19.0760,
      lng: 72.8777
    }
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91 98450 24704',
    emergencyPhone: '+91 98450 24799',
    whatsappPhone: '919845024704',
    address: '77/A, 100 Feet Road, 4th Block, Koramangala, Bengaluru, KA 560034',
    hubName: 'Bengaluru Tech Corridor & Patient Care Command Hub',
    availableStaffCount: 42,
    avgResponseMinutes: 30,
    popularAreas: [
      'Koramangala & HSR Layout',
      'Indiranagar & Domlur',
      'Whitefield & ITPL',
      'Jayanagar & JP Nagar',
      'Electronic City (Phase 1 & 2)',
      'Hebbal & Yelahanka',
      'Malleshwaram & Rajajinagar'
    ],
    coordinates: {
      lat: 12.9716,
      lng: 77.5946
    }
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    phone: '+91 98490 24705',
    emergencyPhone: '+91 98490 24799',
    whatsappPhone: '919849024705',
    address: 'Rd Number 36, Jubilee Hills, Hyderabad, TS 500033',
    hubName: 'Hyderabad Cyberabad & Central Care Hub',
    availableStaffCount: 34,
    avgResponseMinutes: 35,
    popularAreas: [
      'Banjara Hills & Jubilee Hills',
      'Gachibowli & Financial District',
      'Madhapur & Hitec City',
      'Kukatpally & Miyapur',
      'Secunderabad & Begumpet',
      'Kondapur & Manikonda'
    ],
    coordinates: {
      lat: 17.3850,
      lng: 78.4867
    }
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    phone: '+91 98230 24706',
    emergencyPhone: '+91 98230 24799',
    whatsappPhone: '919823024706',
    address: 'Ferguson College Road, Shivaji Nagar, Pune, MH 411004',
    hubName: 'Pune Healthcare & Senior Living Support Hub',
    availableStaffCount: 29,
    avgResponseMinutes: 35,
    popularAreas: [
      'Kothrud & Karve Nagar',
      'Baner, Balewadi & Aundh',
      'Viman Nagar & Kalyani Nagar',
      'Wakad & Hinjawadi',
      'Hadapsar & Magarpatta',
      'Kondhwa & Wanowrie'
    ],
    coordinates: {
      lat: 18.5204,
      lng: 73.8567
    }
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 98400 24707',
    emergencyPhone: '+91 98400 24799',
    whatsappPhone: '919840024707',
    address: '1st Cross Street, Kasturibai Nagar, Adyar, Chennai, TN 600020',
    hubName: 'Chennai Coastal & Metropolitan Care Hub',
    availableStaffCount: 31,
    avgResponseMinutes: 35,
    popularAreas: [
      'Adyar & Besant Nagar',
      'Anna Nagar & Kilpauk',
      'T. Nagar & Mylapore',
      'OMR (Perungudi, Thoraipakkam, Sholinganallur)',
      'Velachery & Guindy',
      'Tambaram & Chromepet'
    ],
    coordinates: {
      lat: 13.0827,
      lng: 80.2707
    }
  }
];

export const DEFAULT_CITY = CITIES[0]; // Kolkata as default matching reference sites

export function getCityById(id: string): CityData {
  const found = CITIES.find((c) => c.id.toLowerCase() === id.toLowerCase());
  return found || DEFAULT_CITY;
}

export function findClosestCity(lat: number, lng: number): CityData {
  let closestCity = DEFAULT_CITY;
  let minDistance = Number.MAX_VALUE;

  for (const city of CITIES) {
    const dLat = city.coordinates.lat - lat;
    const dLng = city.coordinates.lng - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city;
    }
  }

  return closestCity;
}

