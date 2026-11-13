import { ServiceItem } from '@/types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'skilled-nursing',
    titleKey: 'service_nursing_title',
    subtitleKey: 'service_nursing_sub',
    descriptionKey: 'service_nursing_desc',
    badge: 'Most Requested',
    iconName: 'Stethoscope',
    category: 'nursing',
    startingPrice: '₹899',
    pricePeriod: 'per visit / ₹1,499 per 12hr shift',
    imageUrl: '/images/service-nursing.jpg',
    keyFeatures: [
      'GNM & B.Sc Registered Nurses',
      'Doctor supervised medication charts',
      'Daily vital recording on digital health app',
      'Free replacement within 12 hours guarantee'
    ],
    clinicalProcedures: [
      'Post-Surgical Care & Suture Removal',
      'Wound Dressing & Stage 1-4 Bedsore Care',
      'Ryle\'s Tube Insertion & Enteral Feeding',
      'Urinary Catheterization & Bladder Wash',
      'Tracheostomy Care & Airway Suctioning',
      'IV Infusion, Chemotherapy Port Care & Injections'
    ],
    popularFor: ['Post-hospitalization recovery', 'Bedridden patients', 'Cancer care', 'Stroke recovery']
  },
  {
    id: 'bedside-attendant',
    titleKey: 'service_attendant_title',
    subtitleKey: 'service_attendant_sub',
    descriptionKey: 'service_attendant_desc',
    badge: '12h & 24h Shifts',
    iconName: 'HeartHandshake',
    category: 'elderly',
    startingPrice: '₹750',
    pricePeriod: 'per 12hr shift / ₹1,350 per 24hr',
    imageUrl: '/images/service-elderly.jpg',
    keyFeatures: [
      '100% Police & Background Verified Ayahs / Attendants',
      'Compassionate assistance with daily living (ADLs)',
      'Bathing, sponging, oral hygiene & grooming',
      'Mobility assistance & fall risk prevention'
    ],
    clinicalProcedures: [
      'Diaper change & bedsore prevention turning',
      'Nutritional feeding & oral medication reminders',
      'Wheelchair transfer & assisted walking',
      'Emotional companionship & mental stimulation'
    ],
    popularFor: ['Elderly parents living alone', 'Mobility impaired seniors', 'Post-fracture assistance', 'Palliative care']
  },
  {
    id: 'icu-at-home',
    titleKey: 'service_icu_title',
    subtitleKey: 'service_icu_sub',
    descriptionKey: 'service_icu_desc',
    badge: 'Critical Care Protocol',
    iconName: 'Activity',
    category: 'critical',
    startingPrice: '₹4,999',
    pricePeriod: 'per day (Includes Equipment + ICU Nurse)',
    imageUrl: '/images/service-icu.jpg',
    keyFeatures: [
      'Intensivist (MD Doctor) home visits & tele-monitoring',
      'Full hospital-grade ICU setup delivered in 4 hours',
      'Certified Critical Care Nurses (CCRN certified)',
      'Saves 60% compared to hospital ICU costs'
    ],
    clinicalProcedures: [
      'Invasive & Non-Invasive Mechanical Ventilation',
      'Multi-para Patient Monitoring (ECG, SpO2, NIBP, EtCO2)',
      'Syringe Pumps for inotropic & emergency infusions',
      'Emergency Oxygen support & CPAP/BiPAP management',
      'Continuous arterial line & central line monitoring'
    ],
    popularFor: ['Prolonged ICU weaning', 'Terminal illness care', 'Severe COPD/ARDS', 'End-stage organ care']
  },
  {
    id: 'elderly-dementia-care',
    titleKey: 'service_dementia_title',
    subtitleKey: 'service_dementia_sub',
    descriptionKey: 'service_dementia_desc',
    badge: 'Specialized Geriatric',
    iconName: 'ShieldPlus',
    category: 'elderly',
    startingPrice: '₹1,200',
    pricePeriod: 'per shift',
    imageUrl: '/images/service-dementia.jpg',
    keyFeatures: [
      'Certified Dementia & Alzheimer\'s trained caregivers',
      'Wandering & confusion mitigation protocols',
      'Gentle cognitive stimulation games & music therapy',
      'Regular geriatrician oversight & review'
    ],
    clinicalProcedures: [
      'Behavioral disturbance & agitation de-escalation',
      'Parkinson\'s disease tremors & rigidity management',
      'Nutrition management for dysphagia (swallowing difficulty)',
      'Sleep cycle stabilization & safety alarms'
    ],
    popularFor: ['Alzheimer\'s patients', 'Parkinson\'s support', 'Age-related memory loss', 'Lonely senior citizens']
  },
  {
    id: 'physiotherapy-home',
    titleKey: 'service_physio_title',
    subtitleKey: 'service_physio_sub',
    descriptionKey: 'service_physio_desc',
    badge: 'BPT / MPT Therapists',
    iconName: 'UserCheck',
    category: 'rehab',
    startingPrice: '₹699',
    pricePeriod: 'per session (45-60 mins)',
    imageUrl: '/images/service-physio.jpg',
    keyFeatures: [
      'Post-stroke paralysis neuro-rehabilitation',
      'Joint replacement & orthopedic rehab (Knee/Hip)',
      'Portable electrotherapy (TENS, IFT, Ultrasound)',
      'Customized home exercise program & milestones'
    ],
    clinicalProcedures: [
      'Gait retraining & balance improvement',
      'Chest physiotherapy & bronchial drainage',
      'Spine & lower back pain decompression',
      'Manual therapy & joint mobilization'
    ],
    popularFor: ['Post total knee replacement (TKR)', 'Paralysis recovery', 'Frozen shoulder', 'Bedridden limb stiffness']
  },
  {
    id: 'medical-equipment-rental',
    titleKey: 'service_equipment_title',
    subtitleKey: 'service_equipment_sub',
    descriptionKey: 'service_equipment_desc',
    badge: 'Same-Day 2hr Delivery',
    iconName: 'PackageCheck',
    category: 'equipment',
    startingPrice: '₹149',
    pricePeriod: 'per day / Monthly rental packages available',
    imageUrl: '/images/service-equipment.jpg',
    keyFeatures: [
      '100% Sanitized & Hospital-tested medical machines',
      'Free doorstep installation & biomedical demonstration',
      'Zero downtime: instant machine replacement warranty',
      'Flexible rental or buyback options'
    ],
    clinicalProcedures: [
      'Philips / BMC BiPAP & CPAP Machines',
      '5L & 10L Medical Oxygen Concentrators',
      'Motorized 2-Function & 5-Function ICU Hospital Beds',
      'Anti-Bedsore Ripple Air Mattresses with pumps',
      'Electric Patient Hoyer Lifts & Wheelchairs',
      'Medical Suction Machines & DVT Prevention Pumps'
    ],
    popularFor: ['Home hospitalization setup', 'Respiratory emergency', 'Post-spine surgery bed rest', 'Safe patient transfers']
  },
  {
    id: 'doorstep-lab-tests',
    titleKey: 'service_lab_title',
    subtitleKey: 'service_lab_sub',
    descriptionKey: 'service_lab_desc',
    badge: 'NABL Certified Labs',
    iconName: 'FlaskConical',
    category: 'diagnostics',
    startingPrice: '₹299',
    pricePeriod: 'starting test price (Free home sample pickup)',
    imageUrl: '/images/service-diagnostics.jpg',
    keyFeatures: [
      'Certified phlebotomist painless blood collection at 6 AM',
      'ECG at home with instant cardiologist interpretation',
      'Digital reports delivered on WhatsApp within 6 hours',
      'Free doctor report review & consultation'
    ],
    clinicalProcedures: [
      'Full Body Comprehensive Senior Health Panels',
      'Diabetes Monitoring (HbA1c, Fasting & PP Glucose)',
      'Kidney (KFT), Liver (LFT) & Lipid Profiles',
      '12-Lead Portable Home ECG & Portable X-Ray',
      'Electrolyte & Arterial Blood Gas (ABG) testing'
    ],
    popularFor: ['Elderly routine checkups', 'Bedridden blood monitoring', 'Post-discharge lab followups', 'Preventive wellness']
  },
  {
    id: 'mother-baby-care',
    titleKey: 'service_baby_title',
    subtitleKey: 'service_baby_sub',
    descriptionKey: 'service_baby_desc',
    badge: 'Experienced Jassigns',
    iconName: 'Baby',
    category: 'nursing',
    startingPrice: '₹1,100',
    pricePeriod: 'per 12hr shift',
    imageUrl: '/images/service-baby.jpg',
    keyFeatures: [
      'Experienced pediatric nurses & newborn nannies',
      'Post-cesarean wound care and maternal recovery',
      'Infant bathing, gentle oil massage & umbilical hygiene',
      'Lactation advice & sleep routine development'
    ],
    clinicalProcedures: [
      'Newborn jaundice phototherapy monitoring',
      'Colic relief techniques & burping assistance',
      'Sterilization of feeding equipment & bottles',
      'Postpartum depression screening & comforting support'
    ],
    popularFor: ['First-time mothers', 'Twins / premature babies', 'C-section surgical recovery', 'Working parents support']
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', labelKey: 'cat_all' },
  { id: 'nursing', labelKey: 'cat_nursing' },
  { id: 'elderly', labelKey: 'cat_elderly' },
  { id: 'critical', labelKey: 'cat_critical' },
  { id: 'equipment', labelKey: 'cat_equipment' },
  { id: 'rehab', labelKey: 'cat_rehab' },
  { id: 'diagnostics', labelKey: 'cat_diagnostics' }
];

