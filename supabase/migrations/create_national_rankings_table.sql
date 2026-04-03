-- Create national team rankings table
CREATE TABLE IF NOT EXISTS national_team_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women')),
  url TEXT NOT NULL,
  rankings JSONB NOT NULL DEFAULT '[]'::jsonb,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gender)
);

-- Add RLS policies
ALTER TABLE national_team_rankings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to national rankings"
  ON national_team_rankings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage national rankings"
  ON national_team_rankings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_national_rankings_gender ON national_team_rankings(gender);
CREATE INDEX IF NOT EXISTS idx_national_rankings_updated ON national_team_rankings(last_updated DESC);

-- Add comment
COMMENT ON TABLE national_team_rankings IS 'Stores national college team rankings from USTFCCCA';
