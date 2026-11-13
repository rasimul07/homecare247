# HomeCare247 - Unified Healthcare Platform Backend

A modular, production-grade **NestJS** backend powering the entire **HomeCare247** healthcare ecosystem:
- **Public Landing Page Website** (`homecare247`): Live clinical service catalog, dynamic city hubs, cost calculator, lead/inquiry booking, emergency alerts.
- **Admin Management Portal**: Real-time KPIs, shift scheduling, staff-to-patient allocation, emergency dispatch triage, nurse recruitment & hiring.
- **Doctor Clinical Portal**: Medical supervision, patient case management, clinical notes, medicine adjustments, vital signs review.
- **Nurse & Healthcare Staff Portal**: Shift allocation, bedside check-in / check-out, vital signs recording (BP, Pulse, SpO2, Temp, Sugar), duty reports.
- **Nurse & Staff Career / Resume Hiring Pipeline**: Public resume upload, candidate profile capture, CV preview/download, status workflow (`NEW` → `SHORTLISTED` → `INTERVIEW` → `HIRED`), and 1-click conversion from applicant to active staff user.

---

## 🛠 Tech Stack

- **Framework**: [NestJS 12](https://nestjs.com/) with TypeScript
- **Database & ORM**: [Prisma 6](https://www.prisma.io/) with SQLite (local development) and 1-line switch to PostgreSQL for production
- **Authentication**: JWT with Passport & bcrypt password hashing
- **Role-Based Access Control (RBAC)**: `@Roles(Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF)`
- **Validation**: `class-validator` & `class-transformer` with global pipes
- **File Uploads**: `Multer` with disk storage and secure file type filtering (`.pdf`, `.doc`, `.docx`, images)
- **API Documentation**: Interactive Swagger / OpenAPI UI at `/api/docs`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **npm** or **yarn** or **pnpm**

### 2. Installation
```bash
cd homecare247-backend
npm install --legacy-peer-deps
```

### 3. Database Setup & Seeding
```bash
# Push schema to SQLite database (dev.db)
npx prisma db push

# Seed default test users, services, cities, sample patients, and nurse applicants
npm run seed
```

### 4. Running the Application
```bash
# Development mode with hot-reload
npm run start:dev

# Production build & run
npm run build
npm run start:prod
```

The server starts on **`http://localhost:4000`**.  
Interactive Swagger API documentation: **`http://localhost:4000/api/docs`**.

---

## 🔐 Default Seeded Accounts & Credentials

| Portal / Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| 👑 **Admin Portal** | `admin@homecare247.com` | `Admin@HomeCare2026` | Full system control, shift allocation, hiring pipeline, metrics |
| 👨‍⚕️ **Doctor Portal** | `dr.arindam@homecare247.com` | `Doctor@HomeCare2026` | Supervised patients, clinical notes, treatment guidelines |
| 👩‍⚕️ **Doctor Portal (Palliative)** | `dr.neha@homecare247.com` | `Doctor@HomeCare2026` | Elderly & palliative patients, prescription modifications |
| 👩‍⚕️ **Nurse / Staff Portal** | `priya.nurse@homecare247.com` | `Nurse@HomeCare2026` | Active shifts, check-in/out, bedside vital signs recording |
| 👨‍⚕️ **Nurse / Staff Portal** | `sourav.nurse@homecare247.com` | `Nurse@HomeCare2026` | Post-surgical duty shifts, shift status toggle |

---

## 📡 API Architecture & Endpoints

### 1. Universal Authentication (`/api/auth`)
- `POST /api/auth/login`: Universal login for Admin, Doctor, Nurse, and Staff. Returns JWT token and user profile.
- `GET /api/auth/me`: Returns profile of the authenticated user.
- `POST /api/auth/register`: (Admin only) Register new healthcare staff or doctor accounts.

### 2. Patient Bookings (`/api/bookings`)
- `POST /api/bookings`: **(Public)** Booking inquiry from the landing page modal or calculator.
- `GET /api/bookings`: List bookings (filterable by status, city, nurseId, doctorId, search).
- `GET /api/bookings/:id`: View single booking details, assigned personnel, shifts, and clinical charts.
- `PATCH /api/bookings/:id`: Update booking status, dates, notes, or fee.
- `PATCH /api/bookings/:id/assign`: (Admin only) Assign nurse and/or supervising doctor.
- `GET /api/bookings/summary/status-counts`: (Admin only) Counts by booking status.

### 3. Careers & Nurse Hiring Pipeline (`/api/careers`)
- `POST /api/careers/apply`: **(Public)** Nurses/staff submit application and upload resume (PDF/DOC/DOCX).
- `GET /api/careers/applications`: (Admin only) List applications with filters (`status`, `city`, `roleApplied`, `search`).
- `GET /api/careers/applications/:id`: (Admin only) Application detail with candidate experience and CV.
- `GET /api/careers/resumes/:fileName`: View or download candidate resume file.
- `PATCH /api/careers/applications/:id/status`: (Admin only) Update hiring status (`SHORTLISTED`, `INTERVIEW_SCHEDULED`, `HIRED`, `REJECTED`).
- `POST /api/careers/applications/:id/convert-to-staff`: (Admin only) **1-Click Hire** to convert an applicant into a registered Nurse User account.
- `GET /api/careers/stats`: (Admin only) Recruitment pipeline counts.

### 4. Doctor Portal (`/api/doctor`)
- `GET /api/doctor/dashboard`: Doctor dashboard metrics, active patients, recent vital warnings.
- `GET /api/doctor/patients`: Patients assigned to the authenticated doctor.
- `POST /api/doctor/clinical-notes`: Record medical evaluation, doctor recommendations, and prescription orders.
- `GET /api/doctor/clinical-notes/:bookingId`: Full clinical history and nurse vitals timeline.

### 5. Nurse & Staff Portal (`/api/nurse`)
- `GET /api/nurse/dashboard`: Current duty shift, active patient info, duty checklist.
- `GET /api/nurse/shifts`: All assigned shifts for the logged-in nurse.
- `POST /api/nurse/shifts/:id/check-in`: Clock in at patient's residence.
- `POST /api/nurse/shifts/:id/check-out`: Clock out with shift summary report.
- `POST /api/nurse/vitals`: Bedside recording of BP, pulse, SpO2, temp, blood sugar, and nursing actions.
- `PATCH /api/nurse/availability`: Toggle availability status (`AVAILABLE`, `ON_DUTY`, `ON_LEAVE`).

### 6. Admin Control Tower (`/api/admin`)
- `GET /api/admin/metrics`: Platform KPIs (bookings, active duties, nurse availability, pending applications).
- `POST /api/admin/shifts`: Schedule and allocate shift to nurse/staff for a patient booking.
- `GET /api/admin/shifts`: List all shifts across all cities.
- `GET /api/admin/emergency-requests`: List urgent calls from landing page.
- `PATCH /api/admin/emergency-requests/:id`: Update emergency request status.

### 7. Public Website Services & Cities (`/api/...`)
- `GET /api/services`: List healthcare services, categories, price ranges, and clinical procedures.
- `GET /api/services/:id`: Detailed service specifications.
- `GET /api/cities`: Active city hubs with helplines, WhatsApp links, and response times.
- `POST /api/emergency`: Urgent callback request submitted from the landing emergency banner.

---

## 🗄 Database Model

```mermaid
erDiagram
    User ||--o| DoctorProfile : "has"
    User ||--o| NurseProfile : "has"
    User ||--o{ Shift : "assigned to"
    User ||--o{ ClinicalRecord : "recorded by"
    Booking ||--o{ Shift : "contains"
    Booking ||--o{ ClinicalRecord : "tracks"
    Booking }o--o| User : "assigned nurse"
    Booking }o--o| User : "assigned doctor"
    JobApplication ||--o| User : "can convert to"
```

---

## 🌐 Connecting to `homecare247` Frontend

In the Next.js `homecare247` project, set in `.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

Example frontend fetch for public bookings (`BookingModal.tsx`):
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
const result = await response.json();
```

Example nurse applying with resume (`careers`):
```typescript
const formData = new FormData();
formData.append('fullName', 'Sushmita Mukherjee');
formData.append('email', 'sushmita.nurse@gmail.com');
formData.append('phone', '+91 98311 55443');
formData.append('roleApplied', 'Critical Care ICU Nurse');
formData.append('qualification', 'B.Sc Nursing');
formData.append('experienceYears', '5');
formData.append('currentCity', 'Kolkata');
formData.append('preferredCity', 'Kolkata');
formData.append('resume', resumeFile);

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/apply`, {
  method: 'POST',
  body: formData,
});
```

---

## 📦 Production Deployment (PostgreSQL Switch)

To switch from SQLite to PostgreSQL for production:
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@db.example.com:5432/homecare247?schema=public"
   ```
3. Run:
   ```bash
   npx prisma db push
   npm run seed
   npm run build
   npm run start:prod
   ```

---

## 📄 License
UNLICENSED - Proprietary to HomeCare247.
