# Katalon Studio — Keywords & Advanced Quiz

An interactive onboarding quiz covering Katalon Studio Keywords and Advanced topics. Built with Next.js and deployable to Vercel.

## Features

- 31 questions across 6 categories: Configuration, Locators, Test Creation, Debugging, Test Data, Test Execution
- 4 question types: Multiple Choice, Fill in the Blank, Spot the Bug, Drag to Order
- 75% pass mark
- Admin dashboard (password: `KatalonTrue`) with:
  - Live results tracking
  - Category performance breakdown
  - CSV export
  - Clear all results

## Deployment (Vercel)

1. Import this repository in [Vercel](https://vercel.com)
2. Add a **Vercel KV** (Redis) store from the Storage tab in your project
3. Vercel will auto-inject `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars
4. Deploy!

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000
