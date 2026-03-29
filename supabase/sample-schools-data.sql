-- Sample Schools with Recruiting Standards
-- Run this after school-unlock-system.sql

-- Insert D1 Schools
INSERT INTO schools (name, division, conference, location, state, description) VALUES
  ('University of Oregon', 'D1', 'Pac-12', 'Eugene', 'OR', 'TrackTown USA. Elite training facilities and coaching staff.'),
  ('Stanford University', 'D1', 'Pac-12', 'Stanford', 'CA', 'Top academic institution with strong track program.'),
  ('University of Michigan', 'D1', 'Big Ten', 'Ann Arbor', 'MI', 'Premier Big Ten program with national championship history.'),
  ('University of Texas', 'D1', 'Big 12', 'Austin', 'TX', 'Elite program with state-of-the-art facilities.'),
  ('University of Florida', 'D1', 'SEC', 'Gainesville', 'FL', 'SEC powerhouse with multiple national titles.'),
  ('UCLA', 'D1', 'Pac-12', 'Los Angeles', 'CA', 'Historic program in sunny California.'),
  ('University of Arkansas', 'D1', 'SEC', 'Fayetteville', 'AR', 'Dominant distance program with indoor facility.'),
  ('Georgetown University', 'D1', 'Big East', 'Washington', 'DC', 'Elite academic and athletic program.'),
  ('Syracuse University', 'D1', 'ACC', 'Syracuse', 'NY', 'Strong distance tradition in the ACC.'),
  ('University of Colorado', 'D1', 'Pac-12', 'Boulder', 'CO', 'High-altitude training advantage.');

-- Insert D2 Schools
INSERT INTO schools (name, division, conference, location, state, description) VALUES
  ('Adams State University', 'D2', 'RMAC', 'Alamosa', 'CO', 'Elite D2 distance program at altitude.'),
  ('Grand Valley State', 'D2', 'GLIAC', 'Allendale', 'MI', 'Dominant D2 program with strong facilities.'),
  ('Western Colorado University', 'D2', 'RMAC', 'Gunnison', 'CO', 'Strong mountain running tradition.');

-- Insert D3 Schools
INSERT INTO schools (name, division, conference, location, state, description) VALUES
  ('MIT', 'D3', 'NEWMAC', 'Cambridge', 'MA', 'Top engineering school with competitive track.'),
  ('Williams College', 'D3', 'NESCAC', 'Williamstown', 'MA', 'Elite liberal arts with strong athletics.'),
  ('University of Chicago', 'D3', 'UAA', 'Chicago', 'IL', 'Academic powerhouse with growing track program.');

-- Get school IDs for recruiting standards
DO $$
DECLARE
  oregon_id UUID;
  stanford_id UUID;
  michigan_id UUID;
  texas_id UUID;
  florida_id UUID;
  ucla_id UUID;
  arkansas_id UUID;
  georgetown_id UUID;
  adams_id UUID;
  gvsu_id UUID;
  mit_id UUID;
BEGIN
  -- Get school IDs
  SELECT id INTO oregon_id FROM schools WHERE name = 'University of Oregon';
  SELECT id INTO stanford_id FROM schools WHERE name = 'Stanford University';
  SELECT id INTO michigan_id FROM schools WHERE name = 'University of Michigan';
  SELECT id INTO texas_id FROM schools WHERE name = 'University of Texas';
  SELECT id INTO florida_id FROM schools WHERE name = 'University of Florida';
  SELECT id INTO ucla_id FROM schools WHERE name = 'UCLA';
  SELECT id INTO arkansas_id FROM schools WHERE name = 'University of Arkansas';
  SELECT id INTO georgetown_id FROM schools WHERE name = 'Georgetown University';
  SELECT id INTO adams_id FROM schools WHERE name = 'Adams State University';
  SELECT id INTO gvsu_id FROM schools WHERE name = 'Grand Valley State';
  SELECT id INTO mit_id FROM schools WHERE name = 'MIT';

  -- Insert recruiting standards for 1600m (male)
  INSERT INTO recruiting_standards (school_id, event, gender, standard_type, performance) VALUES
    -- Elite D1 Programs (Oregon, Stanford)
    (oregon_id, '1600m', 'male', 'walk-on', '4:25.0'),
    (oregon_id, '1600m', 'male', 'scholarship', '4:15.0'),
    (oregon_id, '1600m', 'male', 'elite', '4:05.0'),
    
    (stanford_id, '1600m', 'male', 'walk-on', '4:25.0'),
    (stanford_id, '1600m', 'male', 'scholarship', '4:15.0'),
    (stanford_id, '1600m', 'male', 'elite', '4:05.0'),
    
    -- Strong D1 Programs (Michigan, Texas, Florida)
    (michigan_id, '1600m', 'male', 'walk-on', '4:30.0'),
    (michigan_id, '1600m', 'male', 'scholarship', '4:20.0'),
    (michigan_id, '1600m', 'male', 'elite', '4:10.0'),
    
    (texas_id, '1600m', 'male', 'walk-on', '4:30.0'),
    (texas_id, '1600m', 'male', 'scholarship', '4:20.0'),
    (texas_id, '1600m', 'male', 'elite', '4:10.0'),
    
    (florida_id, '1600m', 'male', 'walk-on', '4:30.0'),
    (florida_id, '1600m', 'male', 'scholarship', '4:20.0'),
    (florida_id, '1600m', 'male', 'elite', '4:10.0'),
    
    -- Mid-tier D1 (UCLA, Arkansas, Georgetown)
    (ucla_id, '1600m', 'male', 'walk-on', '4:35.0'),
    (ucla_id, '1600m', 'male', 'scholarship', '4:25.0'),
    (ucla_id, '1600m', 'male', 'elite', '4:15.0'),
    
    (arkansas_id, '1600m', 'male', 'walk-on', '4:28.0'),
    (arkansas_id, '1600m', 'male', 'scholarship', '4:18.0'),
    (arkansas_id, '1600m', 'male', 'elite', '4:08.0'),
    
    (georgetown_id, '1600m', 'male', 'walk-on', '4:32.0'),
    (georgetown_id, '1600m', 'male', 'scholarship', '4:22.0'),
    (georgetown_id, '1600m', 'male', 'elite', '4:12.0'),
    
    -- D2 Programs
    (adams_id, '1600m', 'male', 'walk-on', '4:40.0'),
    (adams_id, '1600m', 'male', 'scholarship', '4:30.0'),
    (adams_id, '1600m', 'male', 'elite', '4:20.0'),
    
    (gvsu_id, '1600m', 'male', 'walk-on', '4:40.0'),
    (gvsu_id, '1600m', 'male', 'scholarship', '4:30.0'),
    (gvsu_id, '1600m', 'male', 'elite', '4:20.0'),
    
    -- D3 Programs
    (mit_id, '1600m', 'male', 'walk-on', '4:45.0'),
    (mit_id, '1600m', 'male', 'scholarship', '4:35.0'),
    (mit_id, '1600m', 'male', 'elite', '4:25.0');

  -- Insert standards for 800m (male)
  INSERT INTO recruiting_standards (school_id, event, gender, standard_type, performance) VALUES
    (oregon_id, '800m', 'male', 'walk-on', '1:55.0'),
    (oregon_id, '800m', 'male', 'scholarship', '1:52.0'),
    (oregon_id, '800m', 'male', 'elite', '1:48.0'),
    
    (stanford_id, '800m', 'male', 'walk-on', '1:55.0'),
    (stanford_id, '800m', 'male', 'scholarship', '1:52.0'),
    (stanford_id, '800m', 'male', 'elite', '1:48.0'),
    
    (michigan_id, '800m', 'male', 'walk-on', '1:57.0'),
    (michigan_id, '800m', 'male', 'scholarship', '1:54.0'),
    (michigan_id, '800m', 'male', 'elite', '1:50.0');

  -- Insert standards for 400m (male)
  INSERT INTO recruiting_standards (school_id, event, gender, standard_type, performance) VALUES
    (oregon_id, '400m', 'male', 'walk-on', '49.0'),
    (oregon_id, '400m', 'male', 'scholarship', '47.5'),
    (oregon_id, '400m', 'male', 'elite', '46.0'),
    
    (florida_id, '400m', 'male', 'walk-on', '49.0'),
    (florida_id, '400m', 'male', 'scholarship', '47.5'),
    (florida_id, '400m', 'male', 'elite', '46.0'),
    
    (texas_id, '400m', 'male', 'walk-on', '49.5'),
    (texas_id, '400m', 'male', 'scholarship', '48.0'),
    (texas_id, '400m', 'male', 'elite', '46.5');

  RAISE NOTICE 'Sample schools and recruiting standards created successfully!';
END $$;
