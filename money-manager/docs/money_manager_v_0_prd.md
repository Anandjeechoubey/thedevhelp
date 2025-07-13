# Product Requirements Document (PRD) - Money Manager v0

## Project Name

**Money Manager**

## Overview

"Money Manager" is a personal finance tracking web application that enables users to log daily expenses, categorize them, and analyze spending habits. The v0 version will focus on core functionality: user authentication, daily expense logging with categories and notes, and responsive UI optimized for mobile.

---

## Goals of v0

- Enable user sign-up and login using email/password
- Allow users to create daily spending logs
- Support fields: Category, Note, Amount, Date, Payment Method
- Fully responsive frontend (desktop/mobile)
- Secure data storage using Supabase PostgreSQL
- Basic dashboard showing recent entries

---

## Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context (for auth), local state for input
- **Form Handling:** React Hook Form + Zod (for schema validation)
- **Authentication:** Supabase Auth

### Backend/API

- **API Routes:** Next.js App Router with `app/api` handlers
- **Database:** Supabase PostgreSQL
- **ORM/Query:** Supabase Client SDK
- **Security:** Supabase Row Level Security (RLS) for multitenancy

---

## Pages Structure

```
/app
├── page.tsx                → Landing Page
├── layout.tsx              → Root Layout
├── login
│   └── page.tsx            → Login Form
├── signup
│   └── page.tsx            → Signup Form
├── dashboard
│   ├── page.tsx            → Overview + Logs List
│   ├── add
│   │   └── page.tsx        → Add Spend Form
│   └── settings
│       └── page.tsx        → Future: Payment Methods etc
```

## API Routes

```
/app/api
├── auth
│   ├── login.ts            → POST (credentials)
│   └── signup.ts           → POST (user details)
├── logs
│   ├── route.ts            → GET (list logs), POST (add log)
│   └── [id]
│       └── route.ts        → DELETE / PUT (delete or update log)
```

---

## Data Models

### Users (Managed by Supabase Auth)

No separate user table unless extending.

### SpendLog

```ts
interface SpendLog {
  id: string;
  user_id: string;
  category: string;      // e.g., Food, Transport, Shopping
  note: string;
  amount: number;        // in currency
  date: string;          // YYYY-MM-DD
  payment_method: string; // e.g., UPI, Card, Cash
  created_at: string;
}
```

---

## High Level Design (HLD)

### Modules

- **Auth Module**: Sign up, Login, AuthGuard (using Supabase Auth)
- **Spend Logger Module**: Form UI, Validation, API Submit
- **Dashboard Module**: List view of logs, simple filters

### Data Flow

- Frontend calls API routes (Next.js edge/server functions)
- API routes interact with Supabase SDK
- Supabase enforces RLS for multi-user safety
- Responses returned as JSON

### Authentication Flow

- Supabase handles email/password auth
- Supabase JWT stored in localStorage or session (via SDK)
- React Context manages auth state client-side

---

## Low Level Design (LLD)

### Add Spend Flow

1. **UI Form**
   - Uses React Hook Form + Zod validation
   - Fields: Category (dropdown), Note (text), Amount (number), Date (datepicker), Payment Method (select)
2. **Form Submit**
   - Sends `POST` request to `/api/logs`
3. **API Route**
   - Validates Supabase session
   - Inserts into `spend_logs` table with `user_id`

### Authentication

- `/signup` and `/login` pages use Supabase SDK
- On success, redirect to `/dashboard`
- Use `onAuthStateChange` to persist session

---

## UI Guidelines

- Use TailwindCSS with mobile-first design
- Keep padding/margins clean
- Use cards for each spend entry
- Use colors to signify category (e.g., red for Food)
- Loading spinners for async operations
- Toast notifications for success/failure (e.g., `react-hot-toast`)

---

## Best Practices & Guidelines

### Frontend

- Prefer App Router over Pages
- Group logic and UI components in `/components`
- Use Zod for runtime and static validation
- Keep auth context clean and SSR-safe

### Backend/API

- Write clean `route.ts` per API resource
- Do not expose Supabase service keys to client
- Use Edge runtime wherever possible for speed

### Supabase

- Enable RLS on `spend_logs`
- Policy:

```sql
CREATE POLICY "Users can access their own logs"
  ON public.spend_logs
  FOR ALL
  USING (auth.uid() = user_id);
```

---

## Future Enhancements (v1 and beyond)

- Budgeting and monthly limits
- Charts/visual analytics
- Export to CSV
- Tagging system for advanced filtering
- PWA support

---

## Summary

Money Manager v0 will lay a solid foundation with:

- Secure user authentication
- Basic expense logging with all critical fields
- Responsive, fast UI with modern UX
- Clean API and DB schema design

This will serve as the MVP to validate product-market fit.

