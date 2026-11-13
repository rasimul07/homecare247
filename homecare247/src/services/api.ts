import { ApiResponse, Booking, CityHub, EmergencyRequest, PatientProfile, ServiceItem, Shift, User } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('homecare247_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('homecare247_token', token);
    } else {
      localStorage.removeItem('homecare247_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('homecare247_token');
    }
    return this.token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});

    headers.set('Content-Type', 'application/json');

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = json?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
      }

      // Backend returns ApiResponse: { success: true, statusCode: 200, data: T }
      if (json && typeof json === 'object' && 'data' in json) {
        return json.data as T;
      }

      return json as T;
    } catch (err: any) {
      console.warn(`[API] Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- AUTHENTICATION ---
  async login(email: string, pass: string): Promise<{ accessToken: string; user: User }> {
    const res = await this.request<{ accessToken: string; tokenType: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      }
    );
    this.setToken(res.accessToken);
    return { accessToken: res.accessToken, user: res.user };
  }

  async register(data: { name: string; email: string; password: string; phone?: string; city?: string; address?: string }) {
    const res = await this.request<{ accessToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.accessToken);
    return res;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- PUBLIC CATALOG ---
  async getCities(): Promise<CityHub[]> {
    return this.request<CityHub[]>('/cities');
  }

  async getCityById(id: string): Promise<CityHub> {
    return this.request<CityHub>(`/cities/${id}`);
  }

  async getServices(category?: string, isClinical?: boolean): Promise<ServiceItem[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (typeof isClinical === 'boolean') params.append('isClinical', String(isClinical));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<ServiceItem[]>(`/services${qs}`);
  }

  async createEmergencyRequest(data: { callerPhone: string; patientName?: string; city: string; area?: string; patientCondition?: string }): Promise<EmergencyRequest> {
    return this.request<EmergencyRequest>('/emergency', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- BOOKINGS ---
  async createBooking(data: {
    patientName: string;
    patientAge?: number;
    patientGender?: string;
    contactName: string;
    contactPhone: string;
    cityId: string;
    area: string;
    address?: string;
    serviceId: string;
    shiftDuration: string;
    patientCondition?: string;
  }): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookings(params: Record<string, string> = {}): Promise<Booking[]> {
    const qs = new URLSearchParams(params).toString();
    return this.request<Booking[]>(`/bookings${qs ? `?${qs}` : ''}`);
  }

  async getBookingById(id: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  // --- CUSTOMER PORTAL ---
  async getCustomerDashboard(): Promise<{
    activeBookings: Booking[];
    recentBookings: Booking[];
    patients: PatientProfile[];
    metrics: { totalBookings: number; activeServices: number; completedServices: number };
  }> {
    return this.request('/customer/dashboard');
  }

  async getCustomerPatients(): Promise<PatientProfile[]> {
    return this.request<PatientProfile[]>('/customer/patients');
  }

  async createPatientProfile(data: Partial<PatientProfile>): Promise<PatientProfile> {
    return this.request<PatientProfile>('/customer/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    return this.request<Booking>(`/customer/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async submitComplaint(data: { bookingId?: string; incidentType: string; severity?: string; description: string; patientSafetyAtRisk?: boolean }) {
    return this.request('/customer/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitFeedback(data: { bookingId: string; overallRating: number; staffPunctuality?: number; clinicalCareRating?: number; reviewComments?: string }) {
    return this.request('/customer/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- NURSE & CAREGIVER PORTAL ---
  async getNurseDashboard(): Promise<{
    activeShift: Shift | null;
    upcomingShifts: Shift[];
    pendingJobOffers: any[];
    nurseProfile: any;
    dutyChecklist: string[];
  }> {
    return this.request('/nurse/dashboard');
  }

  async respondToJobOffer(offerId: string, accept: boolean, rejectionReason?: string) {
    return this.request(`/nurse/job-offers/${offerId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ accept, rejectionReason }),
    });
  }

  async setNurseEnRoute(shiftId: string): Promise<Shift> {
    return this.request<Shift>(`/nurse/shifts/${shiftId}/en-route`, {
      method: 'POST',
    });
  }

  async checkInNurse(shiftId: string, data: { latitude?: number; longitude?: number; checkInNotes?: string }): Promise<Shift> {
    return this.request<Shift>(`/nurse/shifts/${shiftId}/check-in`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkOutNurse(shiftId: string, data: { checkOutNotes: string; proceduresCompleted?: string }): Promise<Shift> {
    return this.request<Shift>(`/nurse/shifts/${shiftId}/check-out`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async recordVitals(data: {
    bookingId: string;
    systolicBp?: number;
    diastolicBp?: number;
    pulseBpm?: number;
    spo2Percent?: number;
    temperatureFahrenheit?: number;
    bloodSugarMgDl?: number;
    respiratoryRate?: number;
    nursingActionsDone?: string;
    patientConditionRemarks?: string;
  }) {
    return this.request('/nurse/vitals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNurseAvailability(availabilityStatus: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE') {
    return this.request('/nurse/availability', {
      method: 'PATCH',
      body: JSON.stringify({ availabilityStatus }),
    });
  }

  async reportNurseIncident(data: { bookingId?: string; incidentType: string; severity: string; description: string }) {
    return this.request('/nurse/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNurseShifts(): Promise<Shift[]> {
    return this.request<Shift[]>('/nurse/shifts');
  }

  async getNursePayouts() {
    return this.request('/nurse/payouts');
  }

  // --- DOCTOR PORTAL ---
  async getDoctorDashboard(): Promise<{
    doctorName: string;
    specialization: string;
    activePatientsCount: number;
    totalSupervised: number;
    completedCases: number;
    assignedPatients: any[];
    recentVitalAlerts: any[];
  }> {
    return this.request('/doctor/dashboard');
  }

  async getDoctorPatients(): Promise<Booking[]> {
    return this.request<Booking[]>('/doctor/patients');
  }

  async addClinicalNote(data: {
    bookingId: string;
    patientConditionSummary: string;
    clinicalAssessment: string;
    medicineChanges?: string;
    nurseCarePlan?: string;
    nextReviewDate?: string;
    flagCriticalAlert?: boolean;
    criticalAlertReason?: string;
  }) {
    return this.request('/doctor/clinical-notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getClinicalHistory(bookingId: string): Promise<{
    booking: Booking;
    clinicalRecords: any[];
    doctorNotes: any[];
  }> {
    return this.request(`/doctor/clinical-notes/${bookingId}`);
  }

  // --- ADMIN PORTAL ---
  async getAdminMetrics() {
    return this.request('/admin/metrics');
  }

  async getAdminEmergencyRequests(): Promise<EmergencyRequest[]> {
    return this.request<EmergencyRequest[]>('/admin/emergency-requests');
  }

  async updateEmergencyRequestStatus(id: string, status: string, notes?: string) {
    return this.request(`/admin/emergency-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getAdminShifts(): Promise<Shift[]> {
    return this.request<Shift[]>('/admin/shifts');
  }
}

export const api = new ApiClient();

