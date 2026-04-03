/**
 * Check what columns exist in athlete_profiles table
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

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColumns() {
  console.log('🔍 Checking athlete_profiles table columns...\n')
  
  try {
    // Try to select with all the columns the onboarding uses
    const { data, error } = await supabase
      .from('athlete_profiles')
      .select('profile_id, high_school, graduation_year, event_specialties, personal_records, gpa, act_score, sat_score, has_verified_academics, phone_number, contact_email, preferred_contact, bio, onboarding_completed')
      .limit(1)
    
    if (error) {
      console.error('❌ Error selecting columns:', error.message)
      console.log('\nMissing column detected in error message above.')
      console.log('\nColumns that onboarding tries to use:')
      console.log('- profile_id')
      console.log('- high_school')
      console.log('- graduation_year')
      console.log('- event_specialties')
      console.log('- personal_records')
      console.log('- gpa')
      console.log('- act_score')
      console.log('- sat_score')
      console.log('- has_verified_academics')
      console.log('- phone_number')
      console.log('- contact_email')
      console.log('- preferred_contact')
      console.log('- bio')
      console.log('- onboarding_completed')
    } else {
      console.log('✅ All columns exist!')
      console.log('Sample data:', data)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

checkColumns()
