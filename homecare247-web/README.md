# HomeCare 24/7 Web (homecare247-web) 🏥

A modern, high-converting, and SEO-optimized **Next.js** landing page for 24/7 Home Healthcare, Home Nursing, Elderly Care, and ICU Setup at Home.

Built with references to leading clinical homecare platforms:
- **2050 Healthcare** ([2050healthcare.com](https://www.2050healthcare.com/kolkata-homenursingcare))
- **Caremate Homecare** ([carematehomecare.com](https://carematehomecare.com/home-care-services/))
- **One Stop Healthcare** ([onestophealthcare.in](https://onestophealthcare.in/))

---

## 🚀 Key Features

### 1. 🔍 Comprehensive SEO & Discoverability
- **JSON-LD Structured Data**:
  - `MedicalBusiness` & `LocalBusiness` Schema (phone numbers, addresses, price range, geo coordinates, 24/7 hours).
  - `FAQPage` Schema for Google Rich Snippets.
  - `AggregateRating` (4.9/5 stars, 4,800+ reviews).
  - `MedicalProcedure` for each clinical service.
- **Dynamic XML Sitemap** (`/sitemap.xml`) with priority tagging for all coverage cities and service anchors.
- **Robots.txt** (`/robots.txt`).
- **OpenGraph & Twitter Card Meta Tags** with multi-lingual alternates (`hreflang` for `en`, `hi`, `bn`).
- **Semantic HTML5 Architecture** for optimal accessibility and crawlability.

### 2. 🌐 Multi-Language Support (i18n)
- **Instant Client-Side Language Switcher** in the top navigation bar.
- Supported languages:
  - 🇬🇧 **English** (`en`)
  - 🇮🇳 **Hindi (हिन्दी)** (`hi`)
  - 🇮🇳 **Bengali (বাংলা)** (`bn`) (especially targeted for Kolkata & Eastern India metro references)
- Persistent language preference saved in `localStorage`.
- Extensible translation dictionary architecture (`src/data/translations.ts`).

### 3. 📍 Auto-Detect Location & Dynamic City Availability
- **Automatic IP-Based Geolocation** on first load with smooth fallback.
- **Browser Geolocation API (GPS)** ("Use My GPS" button) to find the closest metropolitan care hub.
- **Manual City Selector Modal** with fast search across major hubs:
  - **Kolkata** (Salt Lake, Newtown, South Kolkata, Garia, Howrah)
  - **Delhi NCR** (South Delhi, Gurugram, Noida, Dwarka)
  - **Mumbai MMR** (Andheri, Bandra, Powai, Navi Mumbai, Thane)
  - **Bengaluru** (Koramangala, Indiranagar, Whitefield, HSR Layout)
  - **Hyderabad** (Jubilee Hills, Gachibowli, Madhapur)
  - **Pune** (Kothrud, Baner, Viman Nagar, Wakad)
  - **Chennai** (Adyar, Anna Nagar, T. Nagar, OMR)
- **Dynamic Localized Content Based on Location**:
  - Real-time staff on standby badge (e.g. *"38 Verified Staff on Standby in Kolkata"*).
  - Average arrival response time (~30 minutes).
  - Local physical hub address & local manager contact phone.
  - Local coverage neighborhoods checklist.
  - Localized patient testimonials & Google reviews.

### 4. 🩺 Clinical Services Portfolio
1. **Skilled Home Nursing Care**: Post-operative care, IV infusion, Ryle's Tube feeding, Catheterization, Tracheostomy suctioning, Stage 1-4 bedsore dressing.
2. **Bedside Caregivers & Attendants**: 12h/24h compassionate elder care, bathing, mobility, personal hygiene, and companionship.
3. **Complete ICU Setup at Home**: Hospital-grade ventilators, BiPAP/CPAP, cardiac multi-para monitors, suction, and certified ICU nurses (CCRN).
4. **Geriatric & Dementia Care**: Alzheimer's care, fall prevention, Parkinson's tremor assistance, and gentle cognitive stimulation.
5. **Home Physiotherapy & Stroke Rehab**: Neuro-rehab, post-TKR joint recovery, portable electrotherapy (TENS/IFT).
6. **Medical Equipment Rental & Sale**: Motorized ICU beds, 5L/10L oxygen concentrators, wheelchairs, ripple air mattresses.
7. **Doorstep Diagnostics & Lab Tests**: Early-morning blood collection, 12-lead home ECG, digital reports within 6 hours.
8. **Mother & Newborn Baby Care**: Post-C-section recovery, lactation counseling, infant hygiene.

### 5. 🧮 Interactive Service Cost & Shift Calculator
- Allows families to calculate transparent daily and monthly estimates.
- Select by Service, Shift Duration (12h Day / 12h Night / 24h Live-in / Visiting), and Patient Condition (ambulatory, bedridden, critical).
- Direct "Confirm Booking at this Estimate" button that opens the booking modal prefilled.

### 6. 🛡️ Trust & Safety Architecture
- 4-Tier verification: Aadhaar biometrics, police verification, reference checks, health screening.
- Senior Doctor (MD) Clinical Governance & weekly reviews.
- 12-Hour Free Caregiver Replacement Guarantee.
- Transparent fixed pricing with zero hidden agency charges.

### 7. 📱 High-Conversion Mobile Bottom Bar
- Sticky 1-tap **Direct Emergency Call** (`tel:`).
- 1-tap **WhatsApp Emergency Chat** with pre-filled localized text.
- 1-tap **Book Caregiver** modal trigger.

---

## 💻 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```
homecare247/
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind CSS & global theme
│   │   ├── layout.tsx               # Root layout, SEO metadata, Viewport, Providers
│   │   ├── page.tsx                 # Home landing page composition
│   │   ├── robots.ts                # SEO robots.txt generator
│   │   └── sitemap.ts               # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── BookingModal.tsx         # Multi-step clinical booking modal
│   │   ├── CityAvailabilitySection.tsx # Real-time local hub & staff standby
│   │   ├── CityModal.tsx            # City switcher with GPS auto-detection
│   │   ├── DoctorAdvisory.tsx       # MD clinical leadership panel
│   │   ├── EmergencyBanner.tsx      # 24/7 urgent ICU & ambulance banner
│   │   ├── FaqSection.tsx           # Interactive FAQ accordion with schema
│   │   ├── Footer.tsx               # SEO city directories, internal links, disclaimers
│   │   ├── Hero.tsx                 # Dynamic localized hero & quick quote form
│   │   ├── HowItWorks.tsx           # 4-step patient onboarding workflow
│   │   ├── Navbar.tsx               # Top emergency bar + navigation + language toggle
│   │   ├── ServiceCostCalculator.tsx# Interactive transparent pricing calculator
│   │   ├── ServicesSection.tsx      # Comprehensive medical services with categories
│   │   ├── StickyBottomBar.tsx      # Mobile sticky call, WhatsApp, and booking
│   │   ├── StructuredData.tsx       # JSON-LD Schema (MedicalBusiness, FAQPage)
│   │   ├── TestimonialsSection.tsx  # Filterable verified patient stories
│   │   └── WhyChooseUs.tsx          # 4-tier verification & USPs
│   ├── context/
│   │   ├── BookingContext.tsx       # Global booking modal trigger state
│   │   ├── LanguageContext.tsx      # Multilingual state (en, hi, bn) + t() helper
│   │   └── LocationContext.tsx      # IP auto-detection & active city state
│   ├── data/
│   │   ├── cities.ts                # Cities, phone numbers, hubs, coordinates
│   │   ├── faqs.ts                  # Multilingual FAQs & answers
│   │   ├── services.ts              # Medical services, procedures, pricing
│   │   ├── testimonials.ts          # Authentic family reviews by city & service
│   │   └── translations.ts          # Multilingual dictionary (EN, HI, BN)
│   └── types/
│       └── index.ts                 # TypeScript types and interfaces
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the assigned port) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```
# homecare247-web
