# Vercel deployment (monorepo)

This repo has **two** Next.js apps. Create **two** Vercel projects from the same GitHub repo (or one project per app with the correct root folder).

---

## Storefront (customer shop)

| Setting | Value |
|--------|--------|
| **Root Directory** | `apps/storefront` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default; also in `apps/storefront/vercel.json`) |
| **Output Directory** | *(leave empty)* |
| **Install Command** | `npm install --legacy-peer-deps` |

### Environment variables (enable Production + Preview + Development)

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Yes | Long random string |
| `NEXT_PUBLIC_URL` | Yes | e.g. `https://your-store.vercel.app` |

Optional: see `apps/storefront/.env.example` (Google OAuth, mail, SMS, Cloudinary).

---

## Admin CMS

| Setting | Value |
|--------|--------|
| **Root Directory** | `apps/admin` |
| **Framework Preset** | Next.js |
| **Output Directory** | *(leave empty)* |

### Environment variables (enable Production + Preview + Development)

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | Yes |
| `JWT_SECRET_KEY` | Yes |

Optional: `apps/admin/.env.example`

---

## Common issues

### White page `404: NOT_FOUND`

- Wrong **Root Directory** (use `apps/storefront` or `apps/admin`, not repo root).
- **Output Directory** must be empty.
- Open **Visit** on a **Ready** deployment only.

### JSON `Internal Server Error`

- Missing **`JWT_SECRET_KEY`** or vars only set for Production while using a **Preview** URL (`*-git-main-*.vercel.app`).
- Enable env vars for **Preview** and redeploy.

### Build fails on Prisma

- Add **`DATABASE_URL`** before deploy (needed at runtime; dynamic pages no longer require DB at build time).

After changing env vars: **Deployments → Redeploy**.
