-- TrackRecruit Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Athlete profiles
CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  gpa DECIMAL(3,2) NOT NULL,
  sat_score INTEGER,
  act_score INTEGER,
  height TEXT,
  weight INTEGER,
  phone TEXT,
  instagram TEXT,
  twitter TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach profiles
CREATE TABLE coach_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  university_name TEXT NOT NULL,
  position TEXT NOT NULL,
  phone TEXT,
  office_location TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_profile_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  event TEXT NOT NULL,
  performance TEXT NOT NULL,
  date DATE NOT NULL,
  meet_name TEXT NOT NULL,
  location TEXT NOT NULL,
  is_personal_best BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meet results
CREATE TABLE meet_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_profile_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  meet_name TEXT NOT NULL,
  meet_date DATE NOT NULL,
  location TEXT NOT NULL,
  event TEXT NOT NULL,
  performance TEXT NOT NULL,
  place TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  is_pr BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_profile_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  event TEXT NOT NULL,
  date DATE NOT NULL,
  thumbnail_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlist (coaches tracking athletes)
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_profile_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  athlete_profile_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_profile_id, athlete_profile_id)
);

-- Verification requests
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status verification_status DEFAULT 'pending',
  document_urls TEXT[] NOT NULL,
  school_email TEXT NOT NULL,
  verification_email TEXT,
  notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_athlete_profiles_profile_id ON athlete_profiles(profile_id);
CREATE INDEX idx_athlete_profiles_state ON athlete_profiles(state);
CREATE INDEX idx_athlete_profiles_graduation_year ON athlete_profiles(graduation_year);
CREATE INDEX idx_coach_profiles_profile_id ON coach_profiles(profile_id);
CREATE INDEX idx_personal_records_athlete_id ON personal_records(athlete_profile_id);
CREATE INDEX idx_meet_results_athlete_id ON meet_results(athlete_profile_id);
CREATE INDEX idx_videos_athlete_id ON videos(athlete_profile_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_watchlist_coach ON watchlist(coach_profile_id);
CREATE INDEX idx_watchlist_athlete ON watchlist(athlete_profile_id);
CREATE INDEX idx_verification_status ON verification_requests(status);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE meet_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Athlete profiles policies
CREATE POLICY "Athlete profiles are viewable by everyone"
  ON athlete_profiles FOR SELECT
  USING (true);

CREATE POLICY "Athletes can update own profile"
  ON athlete_profiles FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Coach profiles policies
CREATE POLICY "Coach profiles are viewable by everyone"
  ON coach_profiles FOR SELECT
  USING (true);

CREATE POLICY "Coaches can update own profile"
  ON coach_profiles FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Personal records policies
CREATE POLICY "Personal records are viewable by everyone"
  ON personal_records FOR SELECT
  USING (true);

CREATE POLICY "Athletes can manage own records"
  ON personal_records FOR ALL
  USING (
    athlete_profile_id IN (
      SELECT id FROM athlete_profiles WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Meet results policies
CREATE POLICY "Meet results are viewable by everyone"
  ON meet_results FOR SELECT
  USING (true);

CREATE POLICY "Athletes can manage own meet results"
  ON meet_results FOR ALL
  USING (
    athlete_profile_id IN (
      SELECT id FROM athlete_profiles WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Athletes can manage own videos"
  ON videos FOR ALL
  USING (
    athlete_profile_id IN (
      SELECT id FROM athlete_profiles WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    recipient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  USING (
    recipient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Watchlist policies
CREATE POLICY "Coaches can view their watchlist"
  ON watchlist FOR SELECT
  USING (
    coach_profile_id IN (
      SELECT id FROM coach_profiles WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Coaches can manage their watchlist"
  ON watchlist FOR ALL
  USING (
    coach_profile_id IN (
      SELECT id FROM coach_profiles WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Verification requests policies
CREATE POLICY "Users can view their own verification requests"
  ON verification_requests FOR SELECT
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all verification requests"
  ON verification_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update verification requests"
  ON verification_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_profiles_updated_at
  BEFORE UPDATE ON athlete_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_profiles_updated_at
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'athlete')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
