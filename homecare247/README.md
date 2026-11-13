# HomeCare247 Mobile Application (Ionic + React + Capacitor Ready)

Hospital-grade clinical home healthcare & nursing hybrid mobile application for iOS and Android, built with **Ionic 9**, **React 19**, **React Router v6**, and integrated with the **HomeCare247 NestJS Backend** (`http://localhost:4000/api`).

---

## 📱 Mobile Architecture & Role Modules

The mobile app includes specialized workspaces and dynamic bottom tab bars tailored to each stakeholder:

### 1. Customer & Family Patient Portal
- **Services Catalog**: Categorized services (Clinical Nursing, ICU at Home, Attendants, Physiotherapy, Stroke Rehab, Cancer Palliative Care) with real-time local standby caregiver counts.
- **My Care Bookings**: Live care tracking, verified nurse card, contact action pills, and reschedule/cancel support.
- **Family Profiles**: Manage bedside medical records, diagnoses, diet plans, and emergency contacts.
- **24/7 Clinical Helpline**: 1-tap call, WhatsApp triage link, and service feedback.

### 2. Nurse & Caregiver Console
- **Roster Availability**: Toggle between `Available`, `On Duty`, and `On Leave` with live backend synchronization.
- **Active Duty Hub**: Bedside duty console with 1-tap *En-Route*, *Clock-In*, and *Clock-Out*.
- **Bedside Clinical Vitals Charting**: NABH-compliant vitals entry (BP, Pulse, SpO2, Temperature, Blood Sugar, Respiratory Rate) with instant abnormal threshold alerts.
- **Job Offers**: Accept or decline incoming home care requests with 1-tap.
- **Incident Escalation**: Immediate critical deterioration alerting to the supervising physician and 24/7 dispatch desk.

### 3. Supervising Doctor Hub
- **Supervisor Dashboard**: Real-time count of active cases, supervised patients, and critical vital alerts.
- **Patient Vitals Timeline**: Review longitudinal bedside vitals logged by nurses with abnormal markers.
- **Digital Prescription & Nursing Orders**: Add clinical progress notes, modify medications, and update bedside care plans.

### 4. Admin Dispatch Command Center
- **Key Metrics Grid**: Live overview of total bookings, active shifts, available nurses, and pending applicant verifications.
- **24/7 Rapid Emergency Triage**: Incoming SOS alerts, patient triage condition, 1-tap caller dialer, and staff dispatch button.

---

## ⚡ 1-Tap Demo Role Switcher

For testing and verification, the Sign-In screen (`/login`) includes 1-tap demo role chips seeded directly against the backend database:

| Role | Demo Email | Demo Password | Default Landing |
| :--- | :--- | :--- | :--- |
| **Family / Customer** | `customer@homecare247.com` | `Customer@HomeCare2026` | `/customer/services` |
| **Nurse / Caregiver** | `priya.nurse@homecare247.com` | `Nurse@HomeCare2026` | `/nurse/duty` |
| **Doctor (MD)** | `dr.arindam@homecare247.com` | `Doctor@HomeCare2026` | `/doctor/dashboard` |
| **Admin Dispatcher** | `admin@homecare247.com` | `Admin@HomeCare2026` | `/admin/dashboard` |

---

## 🛠️ Development & Build Commands

```bash
# Navigate to the mobile app directory
cd "E:\Madical Home Service\homecare247"

# Start Vite dev server on port 3010
npm run dev -- --port 3010 --host

# Run TypeScript type check and production bundle
npm run build
```

---

## 📱 Exporting to Native iOS & Android via Capacitor

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Initialize Capacitor configuration
npx cap init "HomeCare247" "com.homecare247.app" --web-dir dist

# 3. Build production web assets
npm run build

# 4. Add native platforms
npx cap add android
npx cap add ios

# 5. Sync web bundle to native projects
npx cap sync

# 6. Open in Android Studio or Xcode
npx cap open android
npx cap open ios
```
