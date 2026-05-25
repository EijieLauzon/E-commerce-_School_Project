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

- `DATABASE_URL` — PostgreSQL (Neon, Supabase, Vercel Postgres, etc.)
- `JWT_SECRET_KEY` — any long random string

Optional: mail/SMS/Cloudinary vars from `apps/admin/.env.example` if you use those features.

## Storefront / shop

| Setting | Value |
|--------|--------|
| **Root Directory** | `apps/storefront` |

Same env vars pattern; see `apps/storefront/.env.example`.

## If you see `404: NOT_FOUND` (Vercel white page)

1. **Root Directory** is wrong (most common). Use `apps/admin` or `apps/storefront`, not the repo root and not `agents-convincing-lemming/...`.
2. **Output Directory** must be **empty** for Next.js.
3. Open **Deployments** → latest **Ready** deployment → click **Visit** (not an old URL).
4. Add `DATABASE_URL` and redeploy if the build log shows Prisma errors.
