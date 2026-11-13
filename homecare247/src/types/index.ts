export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'CAREGIVER' | 'STAFF' | 'CUSTOMER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION';

export type WorkerCategory = 'REGISTERED_NURSE' | 'PATIENT_ATTENDANT' | 'AYA_CAREGIVER' | 'PHYSIOTHERAPIST';

export type BookingStatus =
  | 'REQUEST_RECEIVED'
  | 'UNDER_REVIEW'
  | 'CONFIRMED'
  | 'STAFF_ASSIGNED'
  | 'STAFF_EN_ROUTE'
  | 'SERVICE_STARTED'
  | 'SERVICE_COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type ShiftStatus =
  | 'SCHEDULED'
  | 'EN_ROUTE'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'MISSED'
  | 'CANCELLED';

export type JobOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface DoctorProfile {
  id: string;
  registrationNumber?: string;
  specialization: string;
  experienceYears: number;
  hospitalAffiliation?: string;
  degrees: string;
  city: string;
}

export interface NurseProfile {
  id: string;
  licenseNumber?: string;
  qualification: string;
  experienceYears: number;
  skills: string;
  permittedClinicalTasks?: string;
  city: string;
  availabilityStatus: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE';
  rating?: number;
  totalShiftsCompleted?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  city?: string;
  address?: string;
  pinCode?: string;
  doctorProfile?: DoctorProfile;
  nurseProfile?: NurseProfile;
}

export interface CityHub {
  id: string;
  name: string;
  state: string;
  phone: string;
  emergencyPhone: string;
  whatsappPhone: string;
  availableStaffCount: number;
  avgResponseMinutes: number;
  popularAreas: string[];
}

export interface ServiceItem {
  id: string;
  titleKey: string;
  name?: string;
  category: string;
  isClinical: boolean;
  startingPrice: string;
  pricePeriod: string;
  description: string;
  badge?: string;
  iconName: string;
  keyFeatures: string[];
  clinicalProcedures?: string[];
}

export interface PatientProfile {
  id: string;
  customerId: string;
  name: string;
  age: number;
  gender: string;
  relationshipToCustomer: string;
  diagnosis?: string;
  mobilityStatus?: string;
  dietPlan?: string;
  city: string;
  address: string;
  pinCode?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface ClinicalRecord {
  id: string;
  bookingId: string;
  recordedByUserId?: string;
  recordedByName?: string;
  recordedByRole?: string;
  systolicBp?: number;
  diastolicBp?: number;
  pulseBpm?: number;
  spo2Percent?: number;
  temperatureFahrenheit?: number;
  bloodSugarMgDl?: number;
  respiratoryRate?: number;
  nursingActionsDone?: string;
  doctorRecommendations?: string;
  patientConditionRemarks?: string;
  alertFlag?: boolean;
  alertReason?: string;
  recordedAt: string;
}

export interface Shift {
  id: string;
  bookingId: string;
  userId: string;
  workerName?: string;
  workerPhone?: string;
  patientName?: string;
  patientAddress?: string;
  patientPhone?: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  shiftType: string;
  status: ShiftStatus;
  checkInTime?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkOutTime?: string;
  checkOutNotes?: string;
  dailyRate?: number;
}

export interface JobOffer {
  id: string;
  bookingId: string;
  userId: string;
  status: JobOfferStatus;
  offeredAt: string;
  respondedAt?: string;
  rejectionReason?: string;
  booking?: {
    patientName: string;
    area: string;
    cityId: string;
    shiftDuration: string;
    serviceId: string;
    patientCondition?: string;
    startDate: string;
  };
}

export interface Booking {
  id: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  contactName: string;
  contactPhone: string;
  cityId: string;
  area: string;
  address?: string;
  pinCode?: string;
  serviceId: string;
  shiftDuration: string;
  patientCondition?: string;
  status: BookingStatus;
  isClinical: boolean;
  estimatedDailyRate?: number;
  totalDays?: number;
  advancePaid?: number;
  assignedNurseId?: string;
  assignedNurse?: User;
  assignedDoctorId?: string;
  assignedDoctor?: User;
  shifts?: Shift[];
  clinicalRecords?: ClinicalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyRequest {
  id: string;
  callerPhone: string;
  patientName?: string;
  patientCondition?: string;
  city: string;
  area?: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED' | 'CANCELLED';
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  timestamp?: string;
}

