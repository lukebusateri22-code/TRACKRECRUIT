# Supabase Setup Guide for TrackRecruit

This guide will help you set up Supabase as the backend database for TrackRecruit.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Enter project details:
   - **Name**: TrackRecruit
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"

## 2. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 3. Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL**
   - **anon/public key**

## 4. Create Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 6. Database Schema

### Athletes Table
```sql
CREATE TABLE athletes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  high_school TEXT,
  graduation_year INTEGER,
  city TEXT,
  state TEXT,
  height TEXT,
  weight TEXT,
  gpa DECIMAL(3,2),
  sat INTEGER,
  act INTEGER,
  bio TEXT,
  instagram TEXT,
  twitter TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Personal Records Table
```sql
CREATE TABLE personal_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  time_or_distance TEXT NOT NULL,
  date DATE NOT NULL,
  meet_name TEXT,
  location TEXT,
  is_pr BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Meet Results Table
```sql
CREATE TABLE meet_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  meet_name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  event TEXT NOT NULL,
  result TEXT NOT NULL,
  placement INTEGER,
  points INTEGER,
  is_pr BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Schools Table
```sql
CREATE TABLE schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  division TEXT,
  conference TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  logo_url TEXT,
  tuition DECIMAL(10,2),
  team_size INTEGER,
  application_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### School Requirements Table
```sql
CREATE TABLE school_requirements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  min_time_or_distance TEXT NOT NULL,
  min_gpa DECIMAL(3,2),
  min_sat INTEGER,
  min_act INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Recruiting Timeline Table
```sql
CREATE TABLE recruiting_timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  type TEXT NOT NULL, -- 'visit', 'offer', 'deadline', 'commitment'
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  status TEXT, -- 'pending', 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Scholarship Offers Table
```sql
CREATE TABLE scholarship_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  percentage INTEGER NOT NULL,
  annual_amount DECIMAL(10,2),
  status TEXT DEFAULT 'active', -- 'active', 'accepted', 'declined', 'expired'
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Athlete Connections Table
```sql
CREATE TABLE athlete_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  connected_athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(athlete_id, connected_athlete_id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  school_id UUID REFERENCES schools(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Goals Table
```sql
CREATE TABLE goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_value TEXT,
  target_value TEXT NOT NULL,
  deadline DATE,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Videos Table
```sql
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  event TEXT,
  date DATE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

## 7. Set Up Row Level Security (RLS)

Enable RLS on all tables:

```sql
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE meet_results ENABLE ROW LEVEL SECURITY;
-- Repeat for all tables
```

Create policies:

```sql
-- Athletes can read their own data
CREATE POLICY "Athletes can view own profile"
  ON athletes FOR SELECT
  USING (auth.uid() = user_id);

-- Athletes can update their own data
CREATE POLICY "Athletes can update own profile"
  ON athletes FOR UPDATE
  USING (auth.uid() = user_id);

-- Public can view athlete profiles (for coaches)
CREATE POLICY "Public can view athlete profiles"
  ON athletes FOR SELECT
  USING (true);
```

## 8. Set Up Authentication

Supabase provides built-in authentication. Enable email/password auth:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

## 9. Storage for Photos/Videos

1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - `profile-photos`
   - `race-videos`
3. Set up policies for upload/download

## 10. Example Usage in Next.js

### Fetch athlete data:
```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('athletes')
  .select('*')
  .eq('id', athleteId)
  .single()
```

### Insert meet result:
```typescript
const { data, error } = await supabase
  .from('meet_results')
  .insert({
    athlete_id: athleteId,
    meet_name: 'State Championship',
    event: '400m',
    result: '48.2',
    placement: 1,
    is_pr: true
  })
```

### Real-time subscriptions:
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message:', payload)
    }
  )
  .subscribe()
```

## 11. Next Steps

1. Replace mock data in pages with Supabase queries
2. Implement authentication flow
3. Add file upload for photos/videos
4. Set up real-time features for messaging
5. Create API routes for complex operations

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
