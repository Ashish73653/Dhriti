# Phase 1 Summary - Foundation MVP

This document summarizes the complete architecture, file layout, configuration, and operation of **Personal Health OS (Dhriti)** at the end of **Phase 1: Foundation MVP**.

---

## 1. Architecture Explanation

The project is built on **Next.js 14** using the modern **App Router** layout. It prioritizes dark-mode-first aesthetic, type safety, modular feature-based encapsulation, and standard PostgreSQL data layers.

### Architecture Layers:
1. **Routing & Pages (App Layer)**:
   - Next.js page structure with layouts and server-side route components. 
   - Uses route grouping `(auth)` and `(dashboard)` to enforce authentication boundaries.
2. **Business Logic (Features Layer)**:
   - Encapsulated feature domains (`meals`, `weight`, `discipline`) managing business rules, schemas validation (Zod), and database query services.
3. **Data Access (Prisma & Postgres)**:
   - A single, centralized Prisma Client utilizing the `@prisma/adapter-pg` driver adapter for efficient connection pooling.
   - Prisma models mapped to PostgreSQL tables (`users`, `meals`, `weight_logs`, `daily_scores`).
4. **State Management (Zustand)**:
   - Client state management (`useAppStore.ts`) to manage sidebar layouts and responsiveness across navigation containers.
5. **Interactive Core Elements**:
   - Reusable layout frames (`DashboardShell`, `SidebarDrawer`, `TopBar`).
   - SVG and CSS animations (rising wave effects, glowing cards) mapping client metrics in real time.

---

## 2. Complete Folder Structure

```
e:\HealthTracker\
├── prisma\
│   ├── schema.prisma             # PostgreSQL schema mappings
│   └── seed.ts                   # Seed data (65+ North Indian meals and goals)
├── src\
│   ├── app\
│   │   ├── (auth)\               # Authentication routes
│   │   │   ├── login\
│   │   │   └── register\
│   │   ├── (dashboard)\          # Authenticated application core
│   │   │   ├── dashboard\        # Main metrics panel
│   │   │   ├── diet\             # Custom logs
│   │   │   ├── progress\         # BMI evaluation & analytics
│   │   │   ├── settings\         # Metric thresholds configuration
│   │   │   ├── timetable\        # Active diet calendar
│   │   │   └── water\            # Wavy water tracker dashboard
│   │   ├── api\                  # Next.js API endpoints
│   │   ├── globals.css           # Premium Tailwind layers and keyframes
│   │   └── providers.tsx         # NextAuth & Layout providers
│   ├── components\               # Modular frontend modules
│   │   ├── dashboard\            # Grid widgets
│   │   ├── diet\                 # Card loggers
│   │   ├── layout\               # Sidebar, header shell
│   │   ├── progress\             # Recharts canvas
│   │   ├── settings\             # Goal forms
│   │   ├── shared\               # Glowing stat cards
│   │   └── water\                # Liquid wave modules
│   ├── features\                 # Decoupled core logic domains
│   │   ├── discipline\           # Daily discipline score rules engine
│   │   ├── meals\                # Food db search & macro service
│   │   └── weight\               # Scale tracking services
│   ├── lib\                      # Shared helpers (auth, DB, utilities)
│   ├── store\                    # Zustand application stores
│   └── types\                    # Shared TypeScript interfaces
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Dependencies

```json
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.2",
    "@hookform/resolvers": "^5.4.0",
    "@prisma/adapter-pg": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.2.1",
    "dotenv": "^17.4.2",
    "lucide-react": "^1.16.0",
    "next": "14.2.35",
    "next-auth": "^4.24.14",
    "pg": "^8.21.0",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.76.0",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.6.0",
    "zod": "^4.4.3",
    "zustand": "^5.0.13"
  }
```

---

## 4. Operational Commands

### Setup & Installation
```bash
# Clone the repository and install dependencies
npm install
```

### Database Management
```bash
# Setup database schema structures (migrations)
npx prisma migrate dev --name init

# Generate Prisma Client classes
npx prisma generate

# Seed database with preset North Indian meals and configurations
npm run db:seed
```

### Local Run Commands
```bash
# Start Next.js server in development mode
npm run dev

# Create an optimized production bundle
npm run build

# Start the compiled production app server
npm run start
```

---

## 5. Deployment Steps (Vercel + Supabase/Railway)

1. **Database Provisioning (Railway/Supabase)**:
   - Spawn a PostgreSQL instance.
   - Note down the connection string `DATABASE_URL`.
2. **Environment Variables Config (`.env.production`)**:
   - Set the variables:
     ```env
     DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
     NEXTAUTH_SECRET="your-32-character-secret"
     NEXTAUTH_URL="https://your-app-domain.vercel.app"
     ```
3. **Vercel Project Creation**:
   - Link your Git repository.
   - Configure build presets (Framework Preset: **Next.js**).
   - Insert Environment Variables corresponding to production keys.
4. **Trigger Build**:
   - Vercel runs `npm run build`, compiles routing nodes, outputs optimized chunks, and provisions edge endpoints automatically.

---

## 6. Phase 1 Testing Checklist

- [x] **Authentication**: Register new user profiles, encrypt passwords, sign in, maintain session cookies, and redirect unauthenticated routes back to `/login`.
- [x] **Responsive Layouts**: Collapses the Sidebar into a slide drawer on viewport widths < 768px, centers top bars, and handles resize scaling without horizontal layouts breaking.
- [x] **Daily Water Intake**: Tracks drinking progress via preset logger buttons, rises wavy visual SVGs, and resets daily logs back to 0 ml at calendar midnight.
- [x] **Meal logging & Timetable**: Enables searching 65+ seed items, logs portions dynamically, calculates custom food classifications (Green/Yellow/Red), and logs recipes in one-click from the Diet Timetable day tabs.
- [x] **Metabolic Progress Analytics**: Logs weight, calculates BMI, evaluates TDEE deficit projections, and presents Area/Bar/Line charts of metrics over a 30-day window.
- [x] **Settings Adjustment**: Persists heights and weights, calculates BMR, and updates scoring rules parameters dynamically.
