# Supabase Backend Setup Guide

## Step 1: Install Dependencies

Run in terminal:
```bash
npm install
```

## Step 2: Create Supabase Project

1. Go to supabase.com
2. Sign in and create new project
3. Name: TrackRecruit
4. Choose region and set database password

## Step 3: Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of /supabase/schema.sql
3. Paste and run in SQL Editor
4. This creates all tables, policies, and triggers

## Step 4: Get API Keys

In Supabase Settings > API, copy:
- Project URL
- anon public key
- service_role key (keep secret)

## Step 5: Configure Environment

1. Copy .env.local.example to .env.local
2. Add your Supabase URL and keys
3. Never commit .env.local to git

## Step 6: Enable Authentication

In Supabase Authentication settings:
1. Enable Email provider
2. Disable email confirmation for development
3. Set Site URL to http://localhost:3000

## Step 7: Set Up Storage

In Supabase Storage:
1. Create bucket: athlete-videos
2. Create bucket: profile-photos
3. Set both to public
4. Configure upload size limits

## Next Steps

Run npm run dev and test authentication flow
