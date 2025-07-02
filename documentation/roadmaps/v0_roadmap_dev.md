# thedevhelp.com – V0 Dev Roadmap

**Audience**: Developer Team  
**Goal**: Ship V0 of the blogging platform with a CMS using Next.js 14

---

## 🧱 Tech Stack (Strict)

| Layer         | Technology                   |
|---------------|-------------------------------|
| Framework     | Next.js 14 (App Router)       |
| Language      | TypeScript                    |
| Styling       | Tailwind CSS                  |
| Markdown      | gray-matter + next-mdx-remote |
| Auth          | Middleware-based Basic Auth   |
| DB            | PostgreSQL (hosted on Supabase)|
| ORM           | Prisma                        |
| Image Upload  | UploadThing                   |
| Deployment    | Vercel                        |
| Analytics     | Vercel Web Analytics          |
| CMS           | Custom `/admin` dashboard     |

---

## 🗂️ Folder Structure

```
/app
  /admin
    /upload
    /edit/[slug]
  /articles
    /[slug]
  /tag/[tag]
  /search
  layout.tsx
  page.tsx

/lib
  auth.ts
  db.ts
  mdx.ts

/prisma
  schema.prisma

/public/uploads

/styles
  globals.css

/middleware.ts
```

---

## 🔐 Authentication

- Only one admin (Anand)
- Use middleware to guard all `/admin` routes
- Store credentials in `.env`:
  ```env
  ADMIN_EMAIL=admin@thedevhelp.com
  ADMIN_PASSWORD=supersecurepassword
  ```
- `middleware.ts` checks for Basic Auth headers

---

## 🧱 Database Setup (PostgreSQL via Supabase)

### 1. Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String?
  content     String
  tags        String[]
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  views       Int      @default(0)
}
```

### 2. Setup Instructions

```bash
npx prisma init
# Update .env with DATABASE_URL from Supabase
npx prisma db push
```

---

## 🧪 Core Features

### 1. Landing/Home Page (`/`)
- Render top 3 featured articles (highest views)
- Show latest articles (paginated)
- Responsive layout, dark mode

### 2. Article Detail Page (`/articles/[slug]`)
- Fetch MDX content from DB (use `content` column)
- Parse with `next-mdx-remote`
- Display meta (title, tags, read time, views)
- Increment view count (via API call)

### 3. Admin Panel (`/admin`)
- Email/password Basic Auth protected
- Upload `.md` file
- Extract frontmatter using `gray-matter`
- Save to DB (`content`, `title`, `tags`, etc.)
- List, edit, delete, publish/unpublish articles

### 4. Search (`/search`) + Tags (`/tag/[tag]`)
- Full-text search (title + content)
- Filter by tags
- Sort by latest or most viewed

### 5. Image Upload
- UploadThing setup with drag & drop UI in Admin
- Images stored in `/public/uploads` or UploadThing cloud
- Paste image URL in `.md` content

### 6. View Counter
- On article render, fire `POST /api/views/{slug}`
- Server route will increment `views` field in DB

---

## 🔧 Development Setup

```bash
git clone https://github.com/yourorg/thedevhelp.com.git
cd thedevhelp.com

pnpm install
pnpm dev

# For DB
cp .env.example .env
npx prisma generate
```

---

## ⚙️ Deployment

- Push to GitHub
- Connect Vercel project
- Add Supabase `DATABASE_URL` and admin credentials to Vercel environment variables
- Enable Image Optimization, ISR, and Analytics

---

## ✅ Checklist

- [ ] Next.js 14 + Tailwind setup
- [ ] Prisma + Supabase DB
- [ ] Basic Auth middleware
- [ ] Admin panel w/ `.md` upload + DB write
- [ ] Article list + detail pages
- [ ] Search + tag filtering
- [ ] Views counter API
- [ ] Image upload + preview
- [ ] Dark mode + animations