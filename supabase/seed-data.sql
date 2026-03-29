-- Seed Data for TrackRecruit
-- Run this after you have at least one real user account
-- This creates sample athletes, coaches, PRs, and meet results for testing

-- Note: Replace 'your-user-id-here' with your actual user_id from auth.users table
-- You can find it in Supabase: Authentication -> Users -> copy the ID

-- Sample Athletes (10 athletes with realistic data)
INSERT INTO profiles (user_id, email, first_name, last_name, role, is_verified) VALUES
  (gen_random_uuid(), 'sarah.johnson@email.com', 'Sarah', 'Johnson', 'athlete', true),
  (gen_random_uuid(), 'marcus.williams@email.com', 'Marcus', 'Williams', 'athlete', true),
  (gen_random_uuid(), 'emily.chen@email.com', 'Emily', 'Chen', 'athlete', true),
  (gen_random_uuid(), 'jordan.davis@email.com', 'Jordan', 'Davis', 'athlete', true),
  (gen_random_uuid(), 'alex.martinez@email.com', 'Alex', 'Martinez', 'athlete', true),
  (gen_random_uuid(), 'taylor.brown@email.com', 'Taylor', 'Brown', 'athlete', true),
  (gen_random_uuid(), 'casey.wilson@email.com', 'Casey', 'Wilson', 'athlete', true),
  (gen_random_uuid(), 'morgan.lee@email.com', 'Morgan', 'Lee', 'athlete', true),
  (gen_random_uuid(), 'riley.anderson@email.com', 'Riley', 'Anderson', 'athlete', true),
  (gen_random_uuid(), 'jamie.thomas@email.com', 'Jamie', 'Thomas', 'athlete', true);

-- Get the profile IDs we just created
DO $$
DECLARE
  sarah_id UUID;
  marcus_id UUID;
  emily_id UUID;
  jordan_id UUID;
  alex_id UUID;
  taylor_id UUID;
  casey_id UUID;
  morgan_id UUID;
  riley_id UUID;
  jamie_id UUID;
  
  sarah_athlete_id UUID;
  marcus_athlete_id UUID;
  emily_athlete_id UUID;
  jordan_athlete_id UUID;
  alex_athlete_id UUID;
  taylor_athlete_id UUID;
  casey_athlete_id UUID;
  morgan_athlete_id UUID;
  riley_athlete_id UUID;
  jamie_athlete_id UUID;
BEGIN
  -- Get profile IDs
  SELECT id INTO sarah_id FROM profiles WHERE email = 'sarah.johnson@email.com';
  SELECT id INTO marcus_id FROM profiles WHERE email = 'marcus.williams@email.com';
  SELECT id INTO emily_id FROM profiles WHERE email = 'emily.chen@email.com';
  SELECT id INTO jordan_id FROM profiles WHERE email = 'jordan.davis@email.com';
  SELECT id INTO alex_id FROM profiles WHERE email = 'alex.martinez@email.com';
  SELECT id INTO taylor_id FROM profiles WHERE email = 'taylor.brown@email.com';
  SELECT id INTO casey_id FROM profiles WHERE email = 'casey.wilson@email.com';
  SELECT id INTO morgan_id FROM profiles WHERE email = 'morgan.lee@email.com';
  SELECT id INTO riley_id FROM profiles WHERE email = 'riley.anderson@email.com';
  SELECT id INTO jamie_id FROM profiles WHERE email = 'jamie.thomas@email.com';

  -- Create athlete profiles
  INSERT INTO athlete_profiles (profile_id, school_name, graduation_year, location, state, gpa, sat_score, height, weight, bio)
  VALUES
    (sarah_id, 'Lincoln High School', 2027, 'Boston', 'MA', 3.9, 1420, '5''6"', 125, 'Distance runner with strong academics. Looking for D1 program with strong pre-med.'),
    (marcus_id, 'Westside High School', 2027, 'Atlanta', 'GA', 3.6, 1280, '6''1"', 165, 'Hurdler and sprinter. Team captain, 2x state champion.'),
    (emily_id, 'Coastal High School', 2027, 'San Diego', 'CA', 4.0, 1480, '5''8"', 135, 'Long jumper and sprinter. National Honor Society, interested in engineering programs.'),
    (jordan_id, 'Central High School', 2027, 'Chicago', 'IL', 3.8, 1340, '5''10"', 155, '400m specialist. Looking for competitive D1 program.'),
    (alex_id, 'Mountain View HS', 2026, 'Denver', 'CO', 3.7, 1310, '6''0"', 170, 'Mid-distance runner. Interested in business programs.'),
    (taylor_id, 'Riverside High', 2028, 'Portland', 'OR', 3.85, NULL, '5''7"', 130, 'Distance runner, freshman phenom. Multiple school records.'),
    (casey_id, 'North High School', 2027, 'Minneapolis', 'MN', 3.75, 1290, '5''9"', 145, 'Pole vaulter. State record holder.'),
    (morgan_id, 'East High School', 2026, 'Phoenix', 'AZ', 3.65, 1250, '6''2"', 180, 'Throws specialist. Shot put and discus.'),
    (riley_id, 'South High School', 2027, 'Austin', 'TX', 3.9, 1390, '5''11"', 160, 'Multi-event athlete. Heptathlon competitor.'),
    (jamie_id, 'West High School', 2028, 'Seattle', 'WA', 3.95, NULL, '5''5"', 120, 'Distance prodigy. Multiple age group records.')
  RETURNING id INTO sarah_athlete_id, marcus_athlete_id, emily_athlete_id, jordan_athlete_id, alex_athlete_id, 
            taylor_athlete_id, casey_athlete_id, morgan_athlete_id, riley_athlete_id, jamie_athlete_id;

  -- Get athlete profile IDs
  SELECT id INTO sarah_athlete_id FROM athlete_profiles WHERE profile_id = sarah_id;
  SELECT id INTO marcus_athlete_id FROM athlete_profiles WHERE profile_id = marcus_id;
  SELECT id INTO emily_athlete_id FROM athlete_profiles WHERE profile_id = emily_id;
  SELECT id INTO jordan_athlete_id FROM athlete_profiles WHERE profile_id = jordan_id;
  SELECT id INTO alex_athlete_id FROM athlete_profiles WHERE profile_id = alex_id;
  SELECT id INTO taylor_athlete_id FROM athlete_profiles WHERE profile_id = taylor_id;
  SELECT id INTO casey_athlete_id FROM athlete_profiles WHERE profile_id = casey_id;
  SELECT id INTO morgan_athlete_id FROM athlete_profiles WHERE profile_id = morgan_id;
  SELECT id INTO riley_athlete_id FROM athlete_profiles WHERE profile_id = riley_id;
  SELECT id INTO jamie_athlete_id FROM athlete_profiles WHERE profile_id = jamie_id;

  -- Add Personal Records
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best) VALUES
    -- Sarah Johnson (Distance)
    (sarah_athlete_id, '1600m', '4:32.1', '2024-05-15', 'State Championships', 'Boston, MA', true),
    (sarah_athlete_id, '3200m', '10:05.3', '2024-06-01', 'New England Championships', 'Providence, RI', true),
    (sarah_athlete_id, '800m', '2:08.5', '2024-04-20', 'City Meet', 'Boston, MA', true),
    
    -- Marcus Williams (Hurdles/Sprints)
    (marcus_athlete_id, '110mH', '14.2', '2024-05-18', 'State Championships', 'Atlanta, GA', true),
    (marcus_athlete_id, '300mH', '38.5', '2024-05-18', 'State Championships', 'Atlanta, GA', true),
    (marcus_athlete_id, '100m', '10.8', '2024-04-15', 'Region Meet', 'Atlanta, GA', true),
    
    -- Emily Chen (Jumps/Sprints)
    (emily_athlete_id, 'Long Jump', '19''8"', '2024-06-10', 'Nike Outdoor Nationals', 'Eugene, OR', true),
    (emily_athlete_id, '100m', '11.9', '2024-05-20', 'CIF Championships', 'Clovis, CA', true),
    (emily_athlete_id, '200m', '24.3', '2024-05-20', 'CIF Championships', 'Clovis, CA', true),
    
    -- Jordan Davis (400m)
    (jordan_athlete_id, '400m', '48.2', '2024-05-25', 'State Meet', 'Chicago, IL', true),
    (jordan_athlete_id, '200m', '21.8', '2024-05-10', 'Conference Championships', 'Chicago, IL', true),
    
    -- Alex Martinez (Mid-Distance)
    (alex_athlete_id, '800m', '1:52.3', '2024-06-05', 'Great Southwest Classic', 'Albuquerque, NM', true),
    (alex_athlete_id, '1600m', '4:18.7', '2024-05-22', 'State Championships', 'Denver, CO', true),
    
    -- Taylor Brown (Distance)
    (taylor_athlete_id, '3200m', '9:45.2', '2024-05-30', 'Freshman Phenom Meet', 'Portland, OR', true),
    (taylor_athlete_id, '1600m', '4:28.5', '2024-05-15', 'District Championships', 'Portland, OR', true),
    
    -- Casey Wilson (Pole Vault)
    (casey_athlete_id, 'Pole Vault', '15''6"', '2024-06-08', 'State Championships', 'Minneapolis, MN', true),
    
    -- Morgan Lee (Throws)
    (morgan_athlete_id, 'Shot Put', '58''3"', '2024-05-18', 'State Championships', 'Phoenix, AZ', true),
    (morgan_athlete_id, 'Discus', '175''2"', '2024-05-18', 'State Championships', 'Phoenix, AZ', true),
    
    -- Riley Anderson (Multi)
    (riley_athlete_id, 'Heptathlon', '5234 pts', '2024-06-12', 'USATF Junior Olympics', 'Sacramento, CA', true),
    (riley_athlete_id, 'High Jump', '5''8"', '2024-05-20', 'District Meet', 'Austin, TX', true),
    
    -- Jamie Thomas (Distance Prodigy)
    (jamie_athlete_id, '3200m', '9:38.1', '2024-06-15', 'Brooks PR Invitational', 'Seattle, WA', true),
    (jamie_athlete_id, '1600m', '4:22.3', '2024-05-28', 'State Championships', 'Seattle, WA', true);

  -- Add Meet Results (recent performances)
  INSERT INTO meet_results (athlete_profile_id, meet_name, meet_date, location, event, performance, place, points, is_pr) VALUES
    -- Sarah's recent meets
    (sarah_athlete_id, 'Spring Invitational', '2024-03-15', 'Boston, MA', '1600m', '4:35.2', '1st', 10, false),
    (sarah_athlete_id, 'Spring Invitational', '2024-03-15', 'Boston, MA', '3200m', '10:12.5', '2nd', 8, false),
    (sarah_athlete_id, 'City Championships', '2024-04-20', 'Boston, MA', '800m', '2:08.5', '1st', 10, true),
    (sarah_athlete_id, 'State Championships', '2024-05-15', 'Boston, MA', '1600m', '4:32.1', '1st', 10, true),
    
    -- Marcus's recent meets
    (marcus_athlete_id, 'Region Qualifier', '2024-04-15', 'Atlanta, GA', '110mH', '14.5', '1st', 10, false),
    (marcus_athlete_id, 'State Championships', '2024-05-18', 'Atlanta, GA', '110mH', '14.2', '1st', 10, true),
    (marcus_athlete_id, 'State Championships', '2024-05-18', 'Atlanta, GA', '300mH', '38.5', '1st', 10, true),
    
    -- Emily's recent meets
    (emily_athlete_id, 'CIF Championships', '2024-05-20', 'Clovis, CA', 'Long Jump', '19''8"', '1st', 10, true),
    (emily_athlete_id, 'CIF Championships', '2024-05-20', 'Clovis, CA', '100m', '11.9', '2nd', 8, true),
    (emily_athlete_id, 'Nike Outdoor Nationals', '2024-06-10', 'Eugene, OR', 'Long Jump', '19''8"', '3rd', 6, false);

END $$;

-- Sample Coaches
INSERT INTO profiles (user_id, email, first_name, last_name, role, is_verified) VALUES
  (gen_random_uuid(), 'coach.anderson@umich.edu', 'Mike', 'Anderson', 'coach', true),
  (gen_random_uuid(), 'coach.roberts@stanford.edu', 'Lisa', 'Roberts', 'coach', true),
  (gen_random_uuid(), 'coach.thompson@oregon.edu', 'James', 'Thompson', 'coach', true);

-- Create coach profiles
DO $$
DECLARE
  anderson_id UUID;
  roberts_id UUID;
  thompson_id UUID;
BEGIN
  SELECT id INTO anderson_id FROM profiles WHERE email = 'coach.anderson@umich.edu';
  SELECT id INTO roberts_id FROM profiles WHERE email = 'coach.roberts@stanford.edu';
  SELECT id INTO thompson_id FROM profiles WHERE email = 'coach.thompson@oregon.edu';

  INSERT INTO coach_profiles (profile_id, university_name, position, bio) VALUES
    (anderson_id, 'University of Michigan', 'Head Coach', 'Leading Michigan Track & Field to national prominence. Looking for dedicated distance runners.'),
    (roberts_id, 'Stanford University', 'Distance Coach', 'Developing Olympic-caliber distance runners. Strong academic program.'),
    (thompson_id, 'University of Oregon', 'Sprints/Hurdles Coach', 'TrackTown USA. Elite training facility and coaching staff.');
END $$;
