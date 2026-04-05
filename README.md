<img width="1920" height="1080" alt="Screenshot 2026-04-05 133606" src="https://github.com/user-attachments/assets/bf1a2ef9-f5e9-4691-b1b0-cb11b427770c" />
<img width="1920" height="1080" alt="Screenshot 2026-04-05 132642" src="https://github.com/user-attachments/assets/f2ee49dd-56d8-4781-a32b-35f484da6927" />
<img width="1920" height="1080" alt="Screenshot 2026-04-05 132525" src="https://github.com/user-attachments/assets/bcd395d1-1bf4-4b0f-98e4-4dba8b6c8b1b" />
# URL Shortner

A fast anonymous URL shortener built with **Next.js + TypeScript + Prisma + PostgreSQL (Neon)**.

## Live Demo
- App: https://u5go-1628.vercel.app

## Features
- Anonymous link shortening (no login)
- Random short slug generation (5 chars)
- Optional custom slug
- Redirect by slug
- Public stats endpoint/page
- Optional expiry date
- Basic rate limiting
- Deployed on Vercel

## Tech Stack
- Next.js (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Vercel

## Project Structure
- `url-shortener/` → main app folder

## Run Locally

```bash
cd url-shortener
npm install
Create .env:
DATABASE_URL="your_neon_postgres_url"
SHORT_URL_BASE="http://localhost:3000"
IP_HASH_SALT="your-random-secret"

Run migrations + start:

npx prisma migrate dev --name init
npm run dev
Open: http://localhost:3000

API Routes
POST /api/shorten
GET /api/stats/:slug
GET /api/health
GET /:slug (redirect)
Deploy
Set these env vars in Vercel:

DATABASE_URL
SHORT_URL_BASE
IP_HASH_SALT
