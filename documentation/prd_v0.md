# thedevhelp.com – Product Requirements Document (PRD)

**Owner**: Anand  
**Status**: Draft  
**Last Updated**: 2025-07-02  

---

## 🎯 Purpose

Build a modern, minimalist, and performant blogging platform that allows **Anand alone** to publish and manage articles about AI advancements, LLMs, dev tools, and tech trends. It must support **thousands of articles**, with excellent **search/filter/sorting** features, and a **professional aesthetic** aimed at new-age developers.

---

## 🧑‍💻 Target Audience

- AI/ML developers  
- Indie hackers  
- Vibe coders / tinkerers  
- Technical writers  
- Software engineers

---

## 🪜 Scope

### ✅ Must Have

- Author-only CMS (admin dashboard for Anand)
- Public-facing blog with:
  - Article list (pagination or infinite scroll)
  - Article detail page
  - Categories/tags for filtering
  - Full-text search
  - Sorting options (latest, most popular, tags)
- Responsive design (mobile, tablet, desktop)
- Minimal, professional UI
- SEO optimization
- Fast loading times
- Markdown/MDX support
- Newsletter subscription

### 🚧 Nice to Have (Future Scope)

- AI-powered article summaries  
- Related post suggestions  
- Analytics dashboard  
- Commenting system  
- Offline reading (PWA)

---

## 🏗️ Architecture

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (ShadCN optional)
- **Rendering**: SSG + ISR

### Backend / CMS

- **Option 1**: Custom CMS (Next.js + Prisma + PostgreSQL)
- **Option 2**: Headless CMS (Notion / Sanity / Strapi / Contentlayer)
- **Auth**: Admin-only login

### Deployment

- **Hosting**: Vercel  
- **Database**: Supabase / NeonDB / PlanetScale

---

## 🧱 Core Pages

| Page          | Route               | Description                        |
|---------------|---------------------|------------------------------------|
| Home          | `/`                 | Featured + Latest articles         |
| Articles      | `/articles`         | Paginated, searchable list         |
| Article Detail| `/articles/[slug]`  | Full content page                  |
| Tags          | `/tag/[tag]`        | Filtered by tag                    |
| About         | `/about`            | Info about Anand & mission         |
| Admin         | `/admin`            | Login-protected content dashboard  |
| Search        | `/search`           | Global search                      |

---

## 🔍 Key Features

### Article Features

- Title, description, banner image
- Markdown/MDX support
- Meta & OG tags
- Cover image, reading time
- Auto slug generation

### Search & Filter

- Full-text search
- Filter by tags/categories
- Sort by latest, popular, alphabetical

### Admin CMS

- Email/password or GitHub login
- Markdown editor
- Draft/Publish status
- Tag management
- Image uploads

---

## ✨ Design Guidelines

- Modern grayscale + accent color (e.g. violet/blue)
- Fonts: Inter, JetBrains Mono (code)
- Grid/column layout with spacing
- Dark Mode support
- Minimal UX

---

## 🧪 Performance and SEO

- Static generation for articles
- Lazy-loaded images
- OG + Twitter meta
- Sitemap & robots.txt
- Structured Data

---

## 🛠️ Tech Stack Summary

| Layer         | Tech Stack                         |
|---------------|-------------------------------------|
| Frontend      | Next.js 14, Tailwind CSS, MDX       |
| CMS Backend   | Custom / Headless CMS               |
| Auth          | Clerk / Auth.js / Supabase          |
| DB            | Supabase / PostgreSQL               |
| Hosting       | Vercel                              |
| Images        | Cloudinary / UploadThing            |
| Analytics     | Vercel / Plausible / Umami          |

---

## 📌 Milestones

| Milestone                    | ETA         |
|-----------------------------|-------------|
| Finalize Tech Stack         | Day 1       |
| Project Skeleton Setup      | Day 2       |
| Article Pages               | Day 4       |
| Admin CMS MVP               | Day 6       |
| Search + Filter             | Day 8       |
| Dark Mode + Styling         | Day 9       |
| SEO + Meta Setup            | Day 10      |
| MVP Deployment              | Day 12      |

---

## 📃 Licensing & Legal

- Open-source or proprietary (TBD)
- Privacy Policy (optional MVP)
- No ads/trackers (except analytics)

---

## 🚀 Success Metrics

- New post time: < 5 min  
- Lighthouse: 95+ all pages  
- TTFB: < 200ms  
- Load time: < 1s on mobile

---