# CompIntel — Compensation Intelligence Platform

> India's compensation intelligence platform. Know your worth. Negotiate with data.

CompIntel is a production-grade, full-stack compensation intelligence platform inspired by Levels.fyi. It helps users understand compensation across companies using **levels, roles, locations**, and **compensation structures**.

**Core Philosophy: Levels matter more than job titles.**

---

## ✨ Features

### 🔍 Salary Explorer
- Search and filter 400+ compensation entries
- Multi-select filters: Company, Role, Level, Location
- Server-side pagination and sorting
- TanStack Table with responsive design

### 🏢 Company Insights
- 15 companies with detailed profiles
- Compensation distribution charts
- Level progression analysis
- Role-based breakdowns
- Average TC, Max TC, and data point counts

### ⚖️ Comparison Tool
- Compare 2–3 compensation packages side-by-side
- Stacked bar chart visualization
- Highlighted winners for each metric
- Save comparisons to dashboard

### 🧮 Compensation Simulator
- Estimate compensation for any Company × Level × Location
- Confidence scoring based on data availability
- Percentile distribution (P25, P50, P75)
- Breakdown charts

### 📊 Dashboard
- Saved companies
- Saved comparisons
- Quick action navigation

### 🔐 Authentication
- Email/password auth with NextAuth v5
- JWT session strategy
- Protected routes (Dashboard, Profile)
- Registration with duplicate detection

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | TailwindCSS v4, shadcn/ui |
| **Data Tables** | TanStack Table |
| **Charts** | Recharts |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Auth** | NextAuth v5 (Credentials) |
| **Validation** | Zod |
| **Deployment** | Vercel + Neon |

---

## 🗄 Database Design

```
┌─────────┐     ┌──────────┐     ┌───────┐     ┌──────────┐
│  User   │     │ Company  │     │ Role  │     │  Level   │
├─────────┤     ├──────────┤     ├───────┤     ├──────────┤
│ id      │     │ id       │     │ id    │     │ id       │
│ email   │     │ name     │     │ title │     │ name     │
│ name    │     │ normal.  │     │ norm. │     │ rank     │
│ passHash│     │ industry │     │ cat.  │     └──────────┘
└─────────┘     │ desc.    │     └───────┘
                └──────────┘           ┌──────────┐
                                       │ Location │
          ┌────────────────────────┐   ├──────────┤
          │  CompensationEntry     │   │ id       │
          ├────────────────────────┤   │ city     │
          │ id                     │   │ state    │
          │ companyId → Company    │   │ country  │
          │ roleId → Role          │   └──────────┘
          │ levelId → Level        │
          │ locationId → Location  │
          │ baseSalary             │
          │ bonus (default: 0)     │
          │ stock (default: 0)     │
          │ TC = base+bonus+stock  │  ← Computed, never stored
          │ submittedById → User?  │
          └────────────────────────┘

┌─────────────────┐   ┌──────────────────┐
│  SavedCompany   │   │ SavedComparison  │
├─────────────────┤   ├──────────────────┤
│ userId → User   │   │ userId → User    │
│ companyId → Co. │   │ title            │
│ unique(u,c)     │   │ entryIds (JSON)  │
└─────────────────┘   └──────────────────┘
```

### Design Decisions

- **TC is never stored** — always computed as `base + bonus + stock`
- **Normalized company names** — `normalizedName` field ensures "Google LLC", "GOOGLE", "google" all resolve to "Google"
- **Missing values** — bonus and stock default to 0 if not provided
- **Duplicate detection** — prevents identical entries (same company/role/level/location with similar base)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) account)

### 1. Clone and Install

```bash
cd CompIntel
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL and auth secret:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/compintel?sslmode=require"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
npm run db:push    # Push schema to database
npm run db:seed    # Seed with sample data
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Account
- Email: `demo@compintel.in`
- Password: `demo1234`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/               # NextAuth + registration
│   │   ├── compensation/       # Salary data, compare, simulate
│   │   ├── companies/          # Company listing & detail
│   │   ├── filters/            # Filter options
│   │   └── saved/              # Saved companies & comparisons
│   ├── login/                  # Auth pages
│   ├── register/
│   ├── salaries/               # Salary Explorer
│   ├── companies/              # Company directory & detail
│   ├── compare/                # Comparison tool
│   ├── simulator/              # Compensation simulator
│   ├── dashboard/              # User dashboard
│   ├── profile/                # User profile
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/                 # Header, Footer
│   └── ui/                     # shadcn/ui + custom components
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── prisma.ts               # Prisma client singleton
│   ├── utils.ts                # Utility functions
│   ├── validations.ts          # Zod schemas
│   └── normalization.ts        # Company name normalization
├── types/                      # TypeScript type definitions
└── middleware.ts                # Route protection
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/filters` | Filter options (companies, roles, levels, locations) |
| GET | `/api/compensation` | List entries with filters, pagination, sorting |
| GET | `/api/companies` | List all companies with stats |
| GET | `/api/companies/[id]` | Company detail with charts data |
| POST | `/api/compensation/compare` | Compare 2-3 entries |
| POST | `/api/compensation/simulate` | Simulate compensation |
| POST | `/api/auth/register` | Register new user |
| GET/POST/DELETE | `/api/saved/companies` | Manage saved companies |
| GET/POST/DELETE | `/api/saved/comparisons` | Manage saved comparisons |

All endpoints support:
- ✅ Zod validation
- ✅ Error handling with meaningful messages
- ✅ Pagination
- ✅ Filtering

---

## 🎨 Design

- **Dark-mode first** — Professional dark theme with indigo accents
- **Inter font** — Clean, modern typography
- **shadcn/ui** — Consistent, accessible components
- **Recharts** — Data visualization (bar, pie, line charts)
- **Responsive** — Mobile-first responsive design
- **Minimal** — Data-first, no unnecessary visual clutter

---

## ⚖️ Architecture Tradeoffs

| Decision | Reasoning |
|---|---|
| **Credentials auth only** | Simpler for MVP; OAuth can be added later |
| **TC computed, not stored** | Single source of truth; avoids data inconsistency |
| **JSON for SavedComparison entries** | Flexible; avoids complex join table for simple use case |
| **Server-side filtering** | Scalable; works with large datasets |
| **TC range filter post-query** | TC is computed, can't filter in SQL; acceptable at current scale |
| **TailwindCSS v4** | Latest version with better performance and simpler config |
| **Dark mode only** | Consistent design; light mode can be added with next-themes |

---

## 🚧 Future Improvements

- [ ] Google/GitHub OAuth
- [ ] Light/dark theme toggle
- [ ] Salary data submission by users
- [ ] Email verification
- [ ] Advanced analytics dashboard
- [ ] Export data to CSV
- [ ] Salary negotiation insights
- [ ] Company reviews integration
- [ ] Mobile app (React Native)
- [ ] Admin panel for data moderation
- [ ] Rate limiting on API routes
- [ ] Redis caching for frequent queries

---

## 📜 License

MIT

---

## 💰 Currency

All compensation values are in **Indian Rupees (₹ / INR)**.
