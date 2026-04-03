-- Add new fields to athlete_profiles table for enhanced onboarding

-- Add MileSplit and PR verification fields
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS milesplit_link TEXT,
ADD COLUMN IF NOT EXISTS has_verified_prs BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_message_coaches BOOLEAN DEFAULT TRUE;

-- Add academic fields
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS act_score INTEGER,
ADD COLUMN IF NOT EXISTS sat_score INTEGER,
ADD COLUMN IF NOT EXISTS has_verified_academics BOOLEAN DEFAULT FALSE;

-- Add contact information fields
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'both'));

-- Add bio field
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add onboarding completion flag
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add constraints
ALTER TABLE athlete_profiles 
ADD CONSTRAINT gpa_range CHECK (gpa >= 0 AND gpa <= 4.0),
ADD CONSTRAINT act_range CHECK (act_score >= 1 AND act_score <= 36),
ADD CONSTRAINT sat_range CHECK (sat_score >= 400 AND sat_score <= 1600);

-- Create index for searching by verification status
CREATE INDEX IF NOT EXISTS idx_athlete_verified_prs ON athlete_profiles(has_verified_prs);
CREATE INDEX IF NOT EXISTS idx_athlete_verified_academics ON athlete_profiles(has_verified_academics);
CREATE INDEX IF NOT EXISTS idx_athlete_can_message ON athlete_profiles(can_message_coaches);

-- Add comment
COMMENT ON COLUMN athlete_profiles.milesplit_link IS 'Link to athlete MileSplit profile for PR verification';
COMMENT ON COLUMN athlete_profiles.has_verified_prs IS 'Whether athlete PRs have been verified via MileSplit scraping';
COMMENT ON COLUMN athlete_profiles.can_message_coaches IS 'Whether athlete can initiate messages to coaches (requires verified PRs)';
COMMENT ON COLUMN athlete_profiles.has_verified_academics IS 'Whether academic credentials have been verified via uploaded documents';
