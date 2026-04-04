# URL-Shortner
Anonymous URL Shortener
Anonymous URL shortener built with Next.js + TypeScript + Prisma + Postgres.

Features
Shorten any HTTP/HTTPS URL.
Random slug by default (5 chars).
Optional custom slug (a-z, 0-9, -, length 4-32).
Public redirect endpoint (/{slug}).
Public stats endpoint and stats page.
Optional expiry date per link.
Basic IP-based rate limiting for link creation.
Quick Start
Install dependencies:
npm install
Configure environment variables:
cp .env.example .env
Fill DATABASE_URL with your managed Postgres connection string.

Create migration and generate Prisma client:

npx prisma migrate dev --name init
npx prisma generate
Start the app:
npm run dev
API
POST /api/shorten
GET /api/stats/:slug
GET /api/health
GET /:slug (redirect)
POST /api/shorten body
{
  "originalUrl": "https://example.com/my/long/link",
  "customSlug": "optional-slug",
  "expiresAt": "2026-12-01T10:00:00.000Z"
}
Vercel Deployment
Deploy the project on Vercel.
Provision a managed Postgres database (Neon / Prisma Postgres / Supabase via Vercel Marketplace).
Add these environment variables in Vercel:
DATABASE_URL
SHORT_URL_BASE (your production domain, e.g. https://sho.rt)
IP_HASH_SALT
