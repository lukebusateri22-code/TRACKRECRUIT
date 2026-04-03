/**
 * Fix database issues programmatically
 * This script will:
 * 1. Check if high_school column exists, add if missing
 * 2. Set lukebusateri22@gmail.com as admin
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixIssues() {
  console.log('🔧 Fixing database issues...\n')
  
  try {
    // 1. Check if high_school column exists
    console.log('1️⃣ Checking high_school column...')
    const { data: columns, error: colError } = await supabase
      .from('athlete_profiles')
      .select('high_school')
      .limit(1)
    
    if (colError) {
      if (colError.message.includes('column') && colError.message.includes('does not exist')) {
        console.log('   ⚠️  Column does not exist')
        console.log('   ℹ️  You need to run this SQL in Supabase dashboard:')
        console.log('   ALTER TABLE athlete_profiles ADD COLUMN high_school TEXT;\n')
      } else {
        console.error('   ❌ Error:', colError.message)
      }
    } else {
      console.log('   ✅ high_school column exists\n')
    }
    
    // 2. Find user and set as admin
    console.log('2️⃣ Setting admin role for lukebusateri22@gmail.com...')
    
    // First check if user exists
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('   ❌ Cannot list users:', authError.message)
      console.log('   ℹ️  You need to run this SQL in Supabase dashboard:')
      console.log(`   
SELECT id FROM auth.users WHERE email = 'lukebusateri22@gmail.com';
-- Then use that ID in:
INSERT INTO profiles (user_id, email, role) 
VALUES ('USER_ID_HERE', 'lukebusateri22@gmail.com', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
`)
      return
    }
    
    const targetUser = authUser.users.find(u => u.email === 'lukebusateri22@gmail.com')
    
    if (!targetUser) {
      console.log('   ⚠️  User not found - they need to sign up first')
      return
    }
    
    console.log('   ✅ User found:', targetUser.id)
    
    // Update or insert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: targetUser.id,
        email: 'lukebusateri22@gmail.com',
        role: 'admin'
      }, {
        onConflict: 'user_id'
      })
    
    if (profileError) {
      console.error('   ❌ Error setting admin role:', profileError.message)
    } else {
      console.log('   ✅ Admin role set successfully!\n')
    }
    
    // 3. Verify
    console.log('3️⃣ Verifying changes...')
    const { data: profile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', targetUser.id)
      .single()
    
    if (verifyError) {
      console.error('   ❌ Error verifying:', verifyError.message)
    } else {
      console.log('   ✅ Profile verified:')
      console.log('      Email:', profile.email)
      console.log('      Role:', profile.role)
    }
    
  } catch (err) {
    console.error('💥 Unexpected error:', err)
  }
}

fixIssues()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
