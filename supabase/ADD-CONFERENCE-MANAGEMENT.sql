-- ============================================
-- CONFERENCE MANAGEMENT TABLE
-- Add this to enable weekly auto-scraping
-- ============================================

-- Conference watchlist for auto-scraping
CREATE TABLE IF NOT EXISTS tffrs_conference_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  conference_name TEXT NOT NULL,
  auto_scrape BOOLEAN DEFAULT true,
  scrape_frequency TEXT DEFAULT 'weekly',
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  next_scrape_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tffrs_conference_watchlist ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to watchlist" ON tffrs_conference_watchlist
  FOR SELECT USING (true);

-- Authenticated insert/update
CREATE POLICY "Allow authenticated insert to watchlist" ON tffrs_conference_watchlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to watchlist" ON tffrs_conference_watchlist
  FOR UPDATE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_tffrs_watchlist_updated_at
  BEFORE UPDATE ON tffrs_conference_watchlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index
CREATE INDEX idx_tffrs_watchlist_active ON tffrs_conference_watchlist(active);
CREATE INDEX idx_tffrs_watchlist_next_scrape ON tffrs_conference_watchlist(next_scrape_at);

SELECT 'Conference watchlist table created successfully!' as status;
