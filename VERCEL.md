# Vercel deployment (monorepo)

This repo has **two** Next.js apps. Each needs its **own** Vercel project (or one project with the correct root folder).

## Admin CMS (`admin` project on Vercel)

| Setting | Value |
|--------|--------|
| **Root Directory** | `apps/admin` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave empty — do not set `.next` or `out`)* |
| **Install Command** | `npm install` (default) |

**Production URL:** `admin-….vercel.app` → admin dashboard (login at `/login`).

### Required environment variables

Add these in Vercel → **Settings → Environment Variables**:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `JWT_SECRET_KEY` | `change-me-to-a-long-random-string-32chars-min` |

**Important:** For each variable, check **all three** boxes:

- Production  
- Preview  
- Development  

URLs like `admin-git-main-….vercel.app` are **Preview** deployments. If you only set vars for Production, Preview will show `Internal Server Error` JSON.

After saving env vars, click **Deployments → Redeploy**.

Optional: mail/SMS vars from `apps/admin/.env.example` if you use those features.

## Storefront / shop

| Setting | Value |
|--------|--------|
| **Root Directory** | `apps/storefront` |

Same env vars pattern; see `apps/storefront/.env.example`.

## If you see `404: NOT_FOUND` (Vercel white page)

This is **Vercel’s** error (not your app). The deploy has no Next.js routes.

1. **Root Directory** → `apps/admin` (admin project) or `apps/storefront` (shop).  
   **Not** blank, **not** `agents-convincing-lemming/...`.
2. **Output Directory** → leave **completely empty** (delete `.next`, `out`, or `public` if set).
3. **Install Command** → `npm install --legacy-peer-deps` (or use defaults; `apps/admin/vercel.json` sets this).
4. Test: open `https://YOUR-URL/login` — if that is also 404, settings are still wrong.
5. **Deployments** → only open **Visit** on a **Ready** (green) deployment.
6. Add `DATABASE_URL` + `JWT_SECRET_KEY`, then **Redeploy**.

### Still broken? Recreate the Vercel project

1. **Add New** → Project → same GitHub repo.
2. Set **Root Directory** = `apps/admin` **before** first deploy.
3. Add env vars → Deploy.
4. Use the new project URL (delete the old broken project if you want).
