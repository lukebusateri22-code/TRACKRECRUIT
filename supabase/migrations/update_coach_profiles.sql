-- Update coach_profiles table for admin-created accounts

-- Add new fields to coach_profiles
ALTER TABLE coach_profiles 
ADD COLUMN IF NOT EXISTS school_name TEXT,
ADD COLUMN IF NOT EXISTS conference TEXT,
ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferred_events TEXT[],
ADD COLUMN IF NOT EXISTS min_gpa DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS min_act INTEGER,
ADD COLUMN IF NOT EXISTS min_sat INTEGER,
ADD COLUMN IF NOT EXISTS preferred_states TEXT[],
ADD COLUMN IF NOT EXISTS target_class_years TEXT[],
ADD COLUMN IF NOT EXISTS gender_preference TEXT DEFAULT 'both' CHECK (gender_preference IN ('men', 'women', 'both'));

-- Add indexes for searching
CREATE INDEX IF NOT EXISTS idx_coach_school_name ON coach_profiles(school_name);
CREATE INDEX IF NOT EXISTS idx_coach_conference ON coach_profiles(conference);
CREATE INDEX IF NOT EXISTS idx_coach_onboarding ON coach_profiles(onboarding_completed);

-- Add comments
COMMENT ON COLUMN coach_profiles.school_name IS 'Name of the college/university the coach represents';
COMMENT ON COLUMN coach_profiles.conference IS 'NCAA conference (e.g., Big Ten, SEC, ACC)';
COMMENT ON COLUMN coach_profiles.created_by_admin IS 'Whether this account was created by admin vs self-signup';
COMMENT ON COLUMN coach_profiles.invitation_sent_at IS 'When the invitation email was sent to the coach';
COMMENT ON COLUMN coach_profiles.invitation_accepted_at IS 'When the coach first logged in and accepted invitation';

-- Create admin_users table for admin access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  UNIQUE(profile_id)
);

-- Add RLS policies for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users table
CREATE POLICY "Only admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.profile_id = auth.uid()
    )
  );

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_profile ON admin_users(profile_id);

COMMENT ON TABLE admin_users IS 'Tracks which users have admin privileges for creating coach accounts';
