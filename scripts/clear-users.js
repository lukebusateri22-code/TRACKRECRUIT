/**
 * Clear all existing users from the database
 * Keeps test user/password for testing
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Read environment variables from .env.local
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

async function clearUsers() {
  console.log('🗑️  Clearing existing users from database...\n')
  
  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profilesError) throw profilesError
    
    console.log(`Found ${profiles.length} profiles in database`)
    
    // Delete all athlete profiles
    const { error: athleteError } = await supabase
      .from('athlete_profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (athleteError) console.error('Error deleting athlete profiles:', athleteError)
    else console.log('✅ Cleared athlete_profiles')
    
    // Delete all coach profiles
    const { error: coachError } = await supabase
      .from('coach_profiles')
      .delete()
      .neq('profile_id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (coachError) console.error('Error deleting coach profiles:', coachError)
    else console.log('✅ Cleared coach_profiles')
    
    // Delete all profiles
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) console.error('Error deleting profiles:', deleteError)
    else console.log('✅ Cleared profiles')
    
    console.log('\n✨ Database cleared successfully!')
    console.log('   You can now use the test login button to create new test users')
    
  } catch (err) {
    console.error('❌ Error clearing users:', err)
    process.exit(1)
  }
}

clearUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
