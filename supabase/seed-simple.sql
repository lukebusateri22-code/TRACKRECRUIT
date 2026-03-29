-- Simple Seed Data for TrackRecruit
-- This version temporarily disables the foreign key constraint

-- Temporarily disable the foreign key constraint
ALTER TABLE profiles DISABLE TRIGGER ALL;

-- Sample Athletes (10 athletes)
DO $$
DECLARE
  sarah_id UUID := gen_random_uuid();
  marcus_id UUID := gen_random_uuid();
  emily_id UUID := gen_random_uuid();
  jordan_id UUID := gen_random_uuid();
  alex_id UUID := gen_random_uuid();
  
  sarah_athlete_id UUID;
  marcus_athlete_id UUID;
  emily_athlete_id UUID;
  jordan_athlete_id UUID;
  alex_athlete_id UUID;
BEGIN
  -- Insert profiles
  INSERT INTO profiles (id, user_id, email, first_name, last_name, role, is_verified) VALUES
    (sarah_id, sarah_id, 'sarah.johnson@test.com', 'Sarah', 'Johnson', 'athlete', true),
    (marcus_id, marcus_id, 'marcus.williams@test.com', 'Marcus', 'Williams', 'athlete', true),
    (emily_id, emily_id, 'emily.chen@test.com', 'Emily', 'Chen', 'athlete', true),
    (jordan_id, jordan_id, 'jordan.davis@test.com', 'Jordan', 'Davis', 'athlete', true),
    (alex_id, alex_id, 'alex.martinez@test.com', 'Alex', 'Martinez', 'athlete', true);

  -- Create athlete profiles
  INSERT INTO athlete_profiles (profile_id, school_name, graduation_year, location, state, gpa, sat_score, height, weight, bio)
  VALUES
    (sarah_id, 'Lincoln High School', 2027, 'Boston', 'MA', 3.9, 1420, '5''6"', 125, 'Distance runner with strong academics.'),
    (marcus_id, 'Westside High School', 2027, 'Atlanta', 'GA', 3.6, 1280, '6''1"', 165, 'Hurdler and sprinter. Team captain.'),
    (emily_id, 'Coastal High School', 2027, 'San Diego', 'CA', 4.0, 1480, '5''8"', 135, 'Long jumper and sprinter.'),
    (jordan_id, 'Central High School', 2027, 'Chicago', 'IL', 3.8, 1340, '5''10"', 155, '400m specialist.'),
    (alex_id, 'Mountain View HS', 2026, 'Denver', 'CO', 3.7, 1310, '6''0"', 170, 'Mid-distance runner.');

  -- Get athlete profile IDs
  SELECT id INTO sarah_athlete_id FROM athlete_profiles WHERE profile_id = sarah_id;
  SELECT id INTO marcus_athlete_id FROM athlete_profiles WHERE profile_id = marcus_id;
  SELECT id INTO emily_athlete_id FROM athlete_profiles WHERE profile_id = emily_id;
  SELECT id INTO jordan_athlete_id FROM athlete_profiles WHERE profile_id = jordan_id;
  SELECT id INTO alex_athlete_id FROM athlete_profiles WHERE profile_id = alex_id;

  -- Add Personal Records
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best) VALUES
    (sarah_athlete_id, '1600m', '4:32.1', '2024-05-15', 'State Championships', 'Boston, MA', true),
    (sarah_athlete_id, '3200m', '10:05.3', '2024-06-01', 'New England Championships', 'Providence, RI', true),
    (marcus_athlete_id, '110mH', '14.2', '2024-05-18', 'State Championships', 'Atlanta, GA', true),
    (marcus_athlete_id, '100m', '10.8', '2024-04-15', 'Region Meet', 'Atlanta, GA', true),
    (emily_athlete_id, 'Long Jump', '19''8"', '2024-06-10', 'Nike Outdoor Nationals', 'Eugene, OR', true),
    (emily_athlete_id, '100m', '11.9', '2024-05-20', 'CIF Championships', 'Clovis, CA', true),
    (jordan_athlete_id, '400m', '48.2', '2024-05-25', 'State Meet', 'Chicago, IL', true),
    (alex_athlete_id, '800m', '1:52.3', '2024-06-05', 'Great Southwest Classic', 'Albuquerque, NM', true);

  -- Add Meet Results
  INSERT INTO meet_results (athlete_profile_id, meet_name, meet_date, location, event, performance, place, points, is_pr) VALUES
    (sarah_athlete_id, 'State Championships', '2024-05-15', 'Boston, MA', '1600m', '4:32.1', '1st', 10, true),
    (marcus_athlete_id, 'State Championships', '2024-05-18', 'Atlanta, GA', '110mH', '14.2', '1st', 10, true),
    (emily_athlete_id, 'Nike Outdoor Nationals', '2024-06-10', 'Eugene, OR', 'Long Jump', '19''8"', '3rd', 6, true),
    (jordan_athlete_id, 'State Meet', '2024-05-25', 'Chicago, IL', '400m', '48.2', '1st', 10, true);

  RAISE NOTICE 'Seed data created: 5 athletes, 8 PRs, 4 meet results';
END $$;

-- Re-enable the foreign key constraint
ALTER TABLE profiles ENABLE TRIGGER ALL;
