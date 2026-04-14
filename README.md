# Katalon Studio — Keywords & Advanced Quiz

An interactive onboarding quiz covering Katalon Studio Keywords and Advanced topics. Built with Next.js, deployable to Vercel with Upstash Redis for result persistence.

## Features

- 31 questions across 6 categories: Configuration, Locators, Test Creation, Debugging, Test Data, Test Execution
- 4 question types: Multiple Choice, Fill in the Blank, Spot the Bug, Drag to Order
- 75% pass mark
- Admin dashboard (password: `KatalonTrue`) with:
  - Live results tracking
  - Category performance breakdown
  - CSV export
  - Clear all results

## Deployment (Vercel + Upstash Redis)

1. Import this repository at [vercel.com/new](https://vercel.com/new)
2. In your Vercel project → **Storage** tab → **Connect Database** → select the **upstash-kj-tracking** Upstash Redis database
3. Vercel will auto-inject `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars
4. Deploy — done!

> **Note:** The quiz works without a database connected — results just won't persist until Upstash is linked.

## Local Development

Create a `.env.local` with your Upstash credentials:

```
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

Then run:

```bash
npm install
npm run dev
```

Visit http://localhost:3000
