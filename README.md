# Pennywise — Full-Stack Expense Manager

[![CI Pipeline](https://github.com/coderooz/next-expense-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/coderooz/next-expense-tracker/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-green)](https://mongoosejs.com/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-blue)](https://authjs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)

Pennywise is a full-stack personal finance application built with the Next.js 16 App Router, TypeScript, Tailwind CSS, MongoDB, and Auth.js v5. It allows users to track expenses and income, visualize monthly cash flow, filter transactions by category and date, and export financial data.

---

## Features

- **Authentication**: Email/password registration and login with bcrypt password hashing and JWT sessions via Auth.js (NextAuth v5).
- **Route Protection**: Next.js 16 middleware (`proxy.ts`) protects dashboard and expense routes, redirecting unauthenticated visitors to `/login`.
- **Financial Dashboard**: Summary KPIs (Total Balance, Income, Expenses, Savings Rate), 6-month cash flow charts, and category breakdowns.
- **Transaction Ledger**: Complete CRUD operations for expenses with SWR for client caching and live mutations.
- **Categorization**: 9 spending categories plus Income (`Food & dining`, `Transport`, `Travel`, `Shopping`, `Bills & utilities`, `Entertainment`, `Health`, `Education`, `Other`).
- **Search & Filtering**: Real-time title search, category filter, and date ranges (`All time`, `This month`, `Last 30 days`).
- **Data Export**: Export filtered transactions directly to CSV with RFC 4180 formatting.
- **Dedicated Routes**: Full support for `/expenses`, `/expenses/new`, and `/expenses/[id]/edit` alongside modal-based workflows.
- **Multi-Tenant Isolation**: Every database query and mutation strictly enforces user ownership (`userId: session.user.id`).
- **Responsive Layout**: Designed for desktop, tablet, and mobile with a slide-over navigation drawer.

---

## Tech Stack

- **Framework**: Next.js 16.4.4 (App Router, Turbopack)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose 9.12
- **Authentication**: NextAuth.js / Auth.js v5
- **State Management**: React Context (`AppContext`) + SWR 2.5
- **Form Validation**: Zod 4.6
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js 20+ (v24 recommended)
- A running MongoDB instance (local or MongoDB Atlas connection string)
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/coderooz/next-expense-tracker.git
cd next-expense-tracker
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file by copying the example template:

```bash
cp .env.example .env.local
```

Fill in your configuration:

```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb://localhost:27017/pennywise

# Auth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your_secure_32_character_secret_here

# App URL
AUTH_URL=http://localhost:3000

# Defaults
DEFAULT_CURRENCY=INR
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts development server with Turbopack |
| `npm run build` | Compiles optimized production build |
| `npm run start` | Runs production server |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Checks TypeScript types without emitting files |
| `npm test` | Runs the automated test suite |

---

## API Reference

All `/api/expenses*` endpoints require an active authenticated session.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Create a new user account | No |
| `POST` | `/api/auth/[...nextauth]` | Auth.js credentials login / session callback | No |
| `GET` | `/api/expenses` | List expenses (supports `search`, `category`, `from`, `to`, `type`, `page`, `limit`) | Yes |
| `POST` | `/api/expenses` | Create a new expense | Yes |
| `GET` | `/api/expenses/[id]` | Fetch a single expense by ID (owner check) | Yes |
| `PUT` | `/api/expenses/[id]` | Update an existing expense (owner check) | Yes |
| `DELETE` | `/api/expenses/[id]` | Delete an expense (owner check) | Yes |

---

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Sign-in page
│   │   └── register/page.tsx        # Registration page
│   ├── api/
│   │   ├── auth/[...nextauth]/      # Auth.js route
│   │   ├── register/route.ts        # Account registration
│   │   └── expenses/                # Expenses REST endpoints
│   ├── dashboard/
│   │   ├── layout.tsx               # Dashboard shell with sidebar & topbar
│   │   ├── page.tsx                 # Overview dashboard
│   │   ├── transactions/            # Transactions ledger & filters
│   │   ├── categories/              # Category spending breakdown
│   │   └── reports/                 # Financial reports view
│   ├── expenses/
│   │   ├── page.tsx                 # Dedicated expenses ledger route
│   │   ├── new/page.tsx             # New transaction page
│   │   └── [id]/edit/page.tsx       # Edit transaction page
│   ├── icon.svg                     # Brand favicon / app icon
│   ├── layout.tsx                   # Root HTML & body layout with metadata
│   └── page.tsx                     # Landing page
├── components/
│   ├── layout/                      # Sidebar, Topbar, MobileNavigation, Shell
│   ├── shared/                      # StatCard, CategoryIcon, Toast, EmptyState
│   ├── transactions/                # TransactionTable, Filters, Form, Modal
│   └── ui/                          # Skeletons and UI primitives
├── context/
│   └── AppContext.tsx               # Global state (user, totals, toasts, active modal)
├── features/                        # Domain feature modules (overview, reports, categories)
├── hooks/
│   └── useExpenses.ts               # SWR data fetching and mutation hooks
├── lib/
│   ├── db/mongodb.ts                # Mongoose connection pooling
│   └── validations/                 # Zod validation schemas
├── models/
│   ├── user.model.ts                # User Mongoose model
│   └── expense.model.ts             # Expense Mongoose model
├── proxy.ts                         # Next.js 16 route protection middleware
├── tests/                           # Unit and integration test suites
└── vercel.json                      # Vercel deployment configuration
```

---

## Deployment (Vercel)

1. Push the code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Set the following environment variables in **Project Settings → Environment Variables**:
   - `MONGODB_URI`: MongoDB Atlas connection string (`mongodb+srv://...`)
   - `AUTH_SECRET`: Random 32-character string (`openssl rand -base64 32`)
   - `AUTH_URL`: Your Vercel domain URL (`https://your-app.vercel.app`)
   - `DEFAULT_CURRENCY`: `INR`
4. Click **Deploy**.

---

## License

MIT
