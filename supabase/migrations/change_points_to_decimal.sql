-- Change points column from INTEGER to DECIMAL to support tie averaging
-- Run this in Supabase SQL Editor

-- Update tffrs_performances points column to DECIMAL
ALTER TABLE tffrs_performances 
ALTER COLUMN points TYPE DECIMAL(5,2);

-- Update tffrs_teams total_points column to DECIMAL
ALTER TABLE tffrs_teams 
ALTER COLUMN total_points TYPE DECIMAL(10,2);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Points columns changed to DECIMAL to support tie averaging';
  RAISE NOTICE '✅ Example: 2 athletes tie for 1st = (10+8)/2 = 9.0 points each';
END $$;
