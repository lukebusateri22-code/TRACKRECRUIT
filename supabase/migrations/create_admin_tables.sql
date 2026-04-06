-- Admin Functionality Tables and Updates
-- Run this in Supabase SQL Editor

-- 1. Add status field to profiles table for user management
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- 2. Create flagged_content table for content moderation
CREATE TABLE IF NOT EXISTS flagged_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL, -- 'profile', 'message', 'post'
  content_id UUID NOT NULL,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for flagged_content
CREATE INDEX IF NOT EXISTS idx_flagged_content_status ON flagged_content(status);
CREATE INDEX IF NOT EXISTS idx_flagged_content_reported_user ON flagged_content(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_flagged_content_severity ON flagged_content(severity);
CREATE INDEX IF NOT EXISTS idx_flagged_content_created_at ON flagged_content(created_at DESC);

-- 3. Create activity_log table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'login', 'profile_view', 'message_sent', etc.
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for activity_log
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- 4. Set admin role for Luke
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'lukebusateri22@gmail.com';

-- 5. Enable RLS on new tables
ALTER TABLE flagged_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for flagged_content
-- Admins can see all flagged content
CREATE POLICY "Admins can view all flagged content"
  ON flagged_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can report content
CREATE POLICY "Users can create reports"
  ON flagged_content FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Admins can update flagged content
CREATE POLICY "Admins can update flagged content"
  ON flagged_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 7. Create RLS policies for activity_log
-- Admins can view all activity
CREATE POLICY "Admins can view all activity"
  ON activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8. Create function to log activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action_type TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_log (user_id, action_type, metadata)
  VALUES (p_user_id, p_action_type, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create view for admin dashboard stats
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE role = 'athlete') as total_athletes,
  (SELECT COUNT(*) FROM profiles WHERE role = 'coach') as total_coaches,
  (SELECT COUNT(*) FROM profiles WHERE status = 'active') as active_users,
  (SELECT COUNT(*) FROM profiles WHERE status = 'suspended') as suspended_users,
  (SELECT COUNT(*) FROM profiles WHERE status = 'banned') as banned_users,
  (SELECT COUNT(*) FROM flagged_content WHERE status = 'pending') as pending_reports,
  (SELECT COUNT(*) FROM activity_log WHERE created_at > NOW() - INTERVAL '24 hours') as activity_24h,
  (SELECT COUNT(*) FROM activity_log WHERE created_at > NOW() - INTERVAL '7 days') as activity_7d;

-- Grant access to admin_dashboard_stats view
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- 10. Create function to suspend user
CREATE OR REPLACE FUNCTION suspend_user(p_user_id UUID, p_admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can suspend users';
  END IF;
  
  -- Update user status
  UPDATE profiles
  SET status = 'suspended'
  WHERE id = p_user_id;
  
  -- Log the action
  PERFORM log_user_activity(p_admin_id, 'user_suspended', jsonb_build_object('suspended_user_id', p_user_id));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to ban user
CREATE OR REPLACE FUNCTION ban_user(p_user_id UUID, p_admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can ban users';
  END IF;
  
  -- Update user status
  UPDATE profiles
  SET status = 'banned'
  WHERE id = p_user_id;
  
  -- Log the action
  PERFORM log_user_activity(p_admin_id, 'user_banned', jsonb_build_object('banned_user_id', p_user_id));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to reactivate user
CREATE OR REPLACE FUNCTION reactivate_user(p_user_id UUID, p_admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can reactivate users';
  END IF;
  
  -- Update user status
  UPDATE profiles
  SET status = 'active'
  WHERE id = p_user_id;
  
  -- Log the action
  PERFORM log_user_activity(p_admin_id, 'user_reactivated', jsonb_build_object('reactivated_user_id', p_user_id));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin tables and functions created successfully!';
  RAISE NOTICE '✅ Admin role set for lukebusateri22@gmail.com';
  RAISE NOTICE '✅ RLS policies enabled';
  RAISE NOTICE '✅ Activity logging functions created';
  RAISE NOTICE '✅ User management functions created';
END $$;
