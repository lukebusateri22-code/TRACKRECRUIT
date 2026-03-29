-- School Unlock System (NCAA Football Style)
-- This creates tables for school recruiting standards and athlete progress

-- Table for schools and their recruiting standards
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  division TEXT NOT NULL CHECK (division IN ('D1', 'D2', 'D3', 'NAIA', 'JUCO')),
  conference TEXT,
  location TEXT,
  state TEXT,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for recruiting standards per school per event
CREATE TABLE IF NOT EXISTS recruiting_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  standard_type TEXT NOT NULL CHECK (standard_type IN ('walk-on', 'scholarship', 'elite')),
  performance TEXT NOT NULL, -- e.g., "4:15.0" for 1600m
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, event, gender, standard_type)
);

-- Table for unlocked schools (when athlete meets standards)
CREATE TABLE IF NOT EXISTS unlocked_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_profile_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  standard_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  pr_id UUID REFERENCES personal_records(id) ON DELETE SET NULL,
  UNIQUE(athlete_profile_id, school_id, event, standard_type)
);

-- Table for athlete's Top 10 favorite schools
CREATE TABLE IF NOT EXISTS favorite_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_profile_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  rank INTEGER CHECK (rank >= 1 AND rank <= 10),
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_profile_id, school_id),
  UNIQUE(athlete_profile_id, rank)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recruiting_standards_school ON recruiting_standards(school_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_standards_event ON recruiting_standards(event);
CREATE INDEX IF NOT EXISTS idx_unlocked_schools_athlete ON unlocked_schools(athlete_profile_id);
CREATE INDEX IF NOT EXISTS idx_favorite_schools_athlete ON favorite_schools(athlete_profile_id);

-- RLS Policies
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiting_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_schools ENABLE ROW LEVEL SECURITY;

-- Everyone can view schools and standards
CREATE POLICY "Schools are viewable by everyone" ON schools FOR SELECT USING (true);
CREATE POLICY "Recruiting standards are viewable by everyone" ON recruiting_standards FOR SELECT USING (true);

-- Athletes can view their own unlocked schools
CREATE POLICY "Athletes can view their unlocked schools" ON unlocked_schools 
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM profiles p 
    JOIN athlete_profiles ap ON p.id = ap.profile_id 
    WHERE ap.id = unlocked_schools.athlete_profile_id
  ));

-- Athletes can insert their own unlocked schools
CREATE POLICY "Athletes can unlock schools" ON unlocked_schools 
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles p 
    JOIN athlete_profiles ap ON p.id = ap.profile_id 
    WHERE ap.id = unlocked_schools.athlete_profile_id
  ));

-- Athletes can manage their favorite schools
CREATE POLICY "Athletes can view their favorites" ON favorite_schools 
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM profiles p 
    JOIN athlete_profiles ap ON p.id = ap.profile_id 
    WHERE ap.id = favorite_schools.athlete_profile_id
  ));

CREATE POLICY "Athletes can add favorites" ON favorite_schools 
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM profiles p 
    JOIN athlete_profiles ap ON p.id = ap.profile_id 
    WHERE ap.id = favorite_schools.athlete_profile_id
  ));

CREATE POLICY "Athletes can update their favorites" ON favorite_schools 
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM profiles p 
    JOIN athlete_profiles ap ON p.id = ap.profile_id 
    WHERE ap.id = favorite_schools.athlete_profile_id
  ));

CREATE POLICY "Athletes can delete their favorites" ON favorite_schools 
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM profiles p 
    JOIN athlete_profiles ap ON p.id = ap.profile_id 
    WHERE ap.id = favorite_schools.athlete_profile_id
  ));

-- Function to check if a performance unlocks schools
CREATE OR REPLACE FUNCTION check_school_unlocks(
  p_athlete_profile_id UUID,
  p_event TEXT,
  p_performance TEXT,
  p_pr_id UUID
)
RETURNS TABLE(school_id UUID, school_name TEXT, standard_type TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    rs.standard_type
  FROM schools s
  JOIN recruiting_standards rs ON s.id = rs.school_id
  WHERE rs.event = p_event
    AND rs.performance >= p_performance -- This is simplified, needs proper time comparison
    AND NOT EXISTS (
      SELECT 1 FROM unlocked_schools us
      WHERE us.athlete_profile_id = p_athlete_profile_id
        AND us.school_id = s.id
        AND us.event = p_event
        AND us.standard_type = rs.standard_type
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
