-- Create comprehensive colleges table for athlete college search

CREATE TABLE IF NOT EXISTS colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Basic Information
  name TEXT NOT NULL,
  short_name TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  
  -- NCAA Information
  ncaa_division TEXT CHECK (ncaa_division IN ('D1', 'D2', 'D3', 'NAIA', 'NJCAA')),
  conference TEXT,
  has_mens_track BOOLEAN DEFAULT TRUE,
  has_womens_track BOOLEAN DEFAULT TRUE,
  
  -- Location Details
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  region TEXT, -- Northeast, Southeast, Midwest, Southwest, West
  setting TEXT, -- Urban, Suburban, Rural
  
  -- Enrollment & Demographics
  total_enrollment INTEGER,
  undergraduate_enrollment INTEGER,
  male_percentage DECIMAL(5, 2),
  female_percentage DECIMAL(5, 2),
  
  -- Admissions
  acceptance_rate DECIMAL(5, 2),
  avg_sat_score INTEGER,
  avg_act_score INTEGER,
  application_deadline TEXT,
  
  -- Financial
  tuition_in_state INTEGER,
  tuition_out_state INTEGER,
  room_and_board INTEGER,
  avg_financial_aid INTEGER,
  
  -- Academic
  graduation_rate DECIMAL(5, 2),
  retention_rate DECIMAL(5, 2),
  student_faculty_ratio TEXT,
  
  -- Website & Contact
  website_url TEXT,
  athletics_url TEXT,
  track_roster_url TEXT,
  
  -- Data Source & Quality
  data_source TEXT DEFAULT 'IPEDS', -- IPEDS, Manual, Scraped
  data_quality_score INTEGER DEFAULT 50 CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
  last_verified_at TIMESTAMPTZ,
  
  -- Search & Display
  logo_url TEXT,
  description TEXT,
  notable_programs TEXT[], -- Array of popular majors
  
  UNIQUE(name, state)
);

-- Create coach contacts table (linked to colleges)
CREATE TABLE IF NOT EXISTS college_coach_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Coach Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT, -- Head Coach, Assistant Coach, etc.
  gender_coached TEXT CHECK (gender_coached IN ('men', 'women', 'both')),
  
  -- Contact Details
  email TEXT,
  phone TEXT,
  office_location TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  
  -- Data Source
  data_source TEXT DEFAULT 'scraped', -- scraped, manual, coach_profile
  coach_profile_id UUID REFERENCES coach_profiles(profile_id),
  
  UNIQUE(college_id, email)
);

-- Create recruiting standards table
CREATE TABLE IF NOT EXISTS recruiting_standards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Event & Gender
  event TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('men', 'women')),
  
  -- Standards (times in seconds, distances in meters/feet)
  walk_on_standard TEXT,
  scholarship_standard TEXT,
  competitive_standard TEXT,
  
  -- Additional Context
  notes TEXT,
  season_year INTEGER, -- e.g., 2024
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  
  -- Source
  data_source TEXT DEFAULT 'manual', -- manual, coach_updated, scraped
  
  UNIQUE(college_id, event, gender, season_year)
);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_division ON colleges(ncaa_division);
CREATE INDEX IF NOT EXISTS idx_colleges_conference ON colleges(conference);
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_region ON colleges(region);
CREATE INDEX IF NOT EXISTS idx_colleges_acceptance_rate ON colleges(acceptance_rate);
CREATE INDEX IF NOT EXISTS idx_colleges_tuition ON colleges(tuition_out_state);

CREATE INDEX IF NOT EXISTS idx_coach_contacts_college ON college_coach_contacts(college_id);
CREATE INDEX IF NOT EXISTS idx_coach_contacts_verified ON college_coach_contacts(is_verified);

CREATE INDEX IF NOT EXISTS idx_recruiting_standards_college ON recruiting_standards(college_id);
CREATE INDEX IF NOT EXISTS idx_recruiting_standards_event ON recruiting_standards(event);
CREATE INDEX IF NOT EXISTS idx_recruiting_standards_gender ON recruiting_standards(gender);

-- Enable RLS
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_coach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiting_standards ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all authenticated users to read
CREATE POLICY "Anyone can view colleges"
  ON colleges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view coach contacts"
  ON college_coach_contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view recruiting standards"
  ON recruiting_standards FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update colleges
CREATE POLICY "Only admins can modify colleges"
  ON colleges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.profile_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can modify coach contacts"
  ON college_coach_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.profile_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can modify recruiting standards"
  ON recruiting_standards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.profile_id = auth.uid()
    )
  );

-- Add comments
COMMENT ON TABLE colleges IS 'Comprehensive database of colleges with track & field programs';
COMMENT ON TABLE college_coach_contacts IS 'Contact information for college track & field coaches';
COMMENT ON TABLE recruiting_standards IS 'Performance standards for walk-on and scholarship opportunities';

COMMENT ON COLUMN colleges.data_quality_score IS 'Score 0-100 indicating completeness and accuracy of college data';
COMMENT ON COLUMN recruiting_standards.walk_on_standard IS 'Minimum performance to walk on to the team';
COMMENT ON COLUMN recruiting_standards.scholarship_standard IS 'Performance level typically offered athletic scholarship';
COMMENT ON COLUMN recruiting_standards.competitive_standard IS 'Performance level to be competitive on the team';
