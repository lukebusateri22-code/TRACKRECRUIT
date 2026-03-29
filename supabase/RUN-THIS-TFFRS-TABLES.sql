-- ============================================
-- TFFRS DATA PERSISTENCE TABLES
-- Run this in your Supabase SQL Editor
-- ============================================

-- Drop existing tables if they exist (careful!)
DROP TABLE IF EXISTS tffrs_performances CASCADE;
DROP TABLE IF EXISTS tffrs_teams CASCADE;
DROP TABLE IF EXISTS tffrs_conferences CASCADE;

-- Conferences table
CREATE TABLE tffrs_conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  conference_name TEXT,
  season TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE tffrs_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID REFERENCES tffrs_conferences(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women')),
  total_points INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conference_id, team_name, gender)
);

-- Performances table
CREATE TABLE tffrs_performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES tffrs_teams(id) ON DELETE CASCADE,
  athlete_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL,
  mark TEXT,
  rank INTEGER,
  points INTEGER DEFAULT 0,
  year TEXT,
  meet TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_tffrs_conferences_url ON tffrs_conferences(url);
CREATE INDEX idx_tffrs_teams_conference ON tffrs_teams(conference_id);
CREATE INDEX idx_tffrs_teams_gender ON tffrs_teams(gender);
CREATE INDEX idx_tffrs_performances_team ON tffrs_performances(team_id);
CREATE INDEX idx_tffrs_performances_category ON tffrs_performances(event_category);

-- Enable Row Level Security
ALTER TABLE tffrs_conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tffrs_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tffrs_performances ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to conferences" ON tffrs_conferences
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to teams" ON tffrs_teams
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to performances" ON tffrs_performances
  FOR SELECT USING (true);

-- Create policies for authenticated insert/update
CREATE POLICY "Allow authenticated insert to conferences" ON tffrs_conferences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to conferences" ON tffrs_conferences
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated insert to teams" ON tffrs_teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to performances" ON tffrs_performances
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tffrs_conferences_updated_at
  BEFORE UPDATE ON tffrs_conferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tffrs_teams_updated_at
  BEFORE UPDATE ON tffrs_teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tffrs_performances_updated_at
  BEFORE UPDATE ON tffrs_performances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'TFFRS tables created successfully!' as status;
