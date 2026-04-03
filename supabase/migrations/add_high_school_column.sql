-- Add missing high_school column to athlete_profiles table
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS high_school TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_high_school 
ON athlete_profiles(high_school);
