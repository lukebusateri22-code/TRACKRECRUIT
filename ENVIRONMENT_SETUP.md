# Environment Variables Setup Guide

## Required Environment Variables

### 1. Supabase Configuration (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. TFRRS Scraper Configuration (Required)
```
SCRAPER_URL=http://localhost:8080
```

## Setup Instructions

### Local Development
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials
3. Set SCRAPER_URL to `http://localhost:8080` (for local Flask scraper)

### Vercel Deployment
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the variables above
3. For production SCRAPER_URL, deploy Flask scraper first (Render/Railway)
4. Redeploy after adding variables

## Database Setup
1. Go to Supabase Dashboard → SQL Editor
2. Run the script: `supabase/RUN-THIS-TFFRS-TABLES.sql`
3. This creates: `tffrs_conferences`, `tffrs_teams`, `tffrs_performances`

## Common Issues

### 500 Error on TFFRS Proxy
- Check SCRAPER_URL is correct
- Ensure Flask scraper is running (port 8080)
- Verify environment variables in Vercel

### Conference Page Not Loading
- Run SQL setup script first
- Check Supabase connection
- Verify environment variables

### 404 Errors for Athletes
- These are demo links that don't exist yet
- Safe to ignore for now
