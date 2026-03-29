-- Add MileSplit and Athletic.net URL fields to athlete_profiles
-- Also add verification_status to personal_records

-- Add URL fields to athlete_profiles
ALTER TABLE athlete_profiles
ADD COLUMN IF NOT EXISTS milesplit_url TEXT,
ADD COLUMN IF NOT EXISTS athletic_net_url TEXT;

-- Add verification fields to personal_records
ALTER TABLE personal_records
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Add check constraint for verification_status (drop first if exists)
ALTER TABLE personal_records
DROP CONSTRAINT IF EXISTS verification_status_check;

ALTER TABLE personal_records
ADD CONSTRAINT verification_status_check 
CHECK (verification_status IN ('unverified', 'pending', 'verified', 'official'));

SELECT 'Profile URL fields added successfully!' as message;
