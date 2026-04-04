# Anonymous URL Shortener

Anonymous URL shortener built with `Next.js + TypeScript + Prisma + Postgres`.

## Features

- Shorten any HTTP/HTTPS URL.
- Random slug by default (5 chars).
- Optional custom slug (`a-z`, `0-9`, `-`, length `4-32`).
- Public redirect endpoint (`/{slug}`).
- Public stats endpoint and stats page.
- Optional expiry date per link.
- Basic IP-based rate limiting for link creation.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Fill `DATABASE_URL` with your managed Postgres connection string.

4. Create migration and generate Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start the app:

```bash
npm run dev
```

## API

- `POST /api/shorten`
- `GET /api/stats/:slug`
- `GET /api/health`
- `GET /:slug` (redirect)

### POST /api/shorten body

```json
{
  "originalUrl": "https://example.com/my/long/link",
  "customSlug": "optional-slug",
  "expiresAt": "2026-12-01T10:00:00.000Z"
}
```

## Vercel Deployment

1. Deploy the project on Vercel.
2. Provision a managed Postgres database (Neon / Prisma Postgres / Supabase via Vercel Marketplace).
3. Add these environment variables in Vercel:

- `DATABASE_URL`
- `SHORT_URL_BASE` (your production domain, e.g. `https://sho.rt`)
- `IP_HASH_SALT`
