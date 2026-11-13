# HomeCare247 Full-Stack Monorepo

Hospital-Grade Clinical Home Healthcare & Bedside Nursing Platform.

This monorepo orchestrates the **Ionic Mobile App**, **NestJS Clinical API**, and **Next.js Web Portal** via standard **npm workspaces** and **concurrently**.

---

## 🏗️ Monorepo Architecture

```
E:\Madical Home Service\
├── package.json               # Root Workspace Orchestration
├── README.md                  # Monorepo Guide
│
├── homecare247/               # 📱 Ionic 9 + React 19 Mobile Application
│   ├── src/                   # Role consoles (Customer, Nurse, Doctor, Admin)
│   └── package.json           # Workspace: "homecare247"
│
├── homecare247-backend/       # ⚙️ NestJS 12 + Prisma 6 + SQLite REST API
│   ├── src/                   # Auth, bookings, shifts, vitals, clinical governance
│   └── package.json           # Workspace: "homecare247-backend"
│
└── homecare247-web/           # 🌐 Next.js 16 + Tailwind CSS Web Portal
    ├── src/                   # SEO landing page, coverage cities, i18n
    └── package.json           # Workspace: "homecare247-web"
```

---

## ⚡ Quick Start

### 1. Start Mobile App + Backend Simultaneously
Runs both the NestJS server (`http://localhost:4000`) and the Ionic Mobile App (`http://localhost:3010`) in a single terminal with colored process prefixes:
```bash
npm run dev
```

### 2. Start All 3 Services (Backend + Mobile + Web)
```bash
npm run dev:all
```

### 3. Individual Service Development
```bash
# Start Backend API only
npm run dev:backend

# Start Mobile App only
npm run dev:mobile

# Start Web Landing Page only
npm run dev:web
```

---

## 📦 Building Projects

```bash
# Build all workspaces
npm run build

# Build individual services
npm run build:mobile
npm run build:backend
npm run build:web
```

---

## 🩺 Database Operations
```bash
# Seed the backend SQLite database with demo accounts (Admin, Doctor, Nurse, Customer)
npm run seed
```

# homecare247
