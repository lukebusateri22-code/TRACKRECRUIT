/**
 * Check what conference data we have in the database
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

async function checkData() {
  console.log('🔍 Checking conference data...\n')
  
  try {
    // Check conferences
    const { data: conferences, error: confError } = await supabase
      .from('tffrs_conferences')
      .select('*')
      .limit(5)
    
    if (confError) {
      console.log('❌ Error fetching conferences:', confError.message)
    } else {
      console.log(`✅ Found ${conferences?.length || 0} conferences`)
      if (conferences && conferences.length > 0) {
        console.log('Sample conference:', conferences[0].conference_name)
      }
    }
    
    // Check teams
    const { data: teams, error: teamsError } = await supabase
      .from('tffrs_teams')
      .select('*')
      .limit(5)
    
    if (teamsError) {
      console.log('❌ Error fetching teams:', teamsError.message)
    } else {
      console.log(`✅ Found ${teams?.length || 0} teams`)
    }
    
    // Check performances
    const { data: performances, error: perfError } = await supabase
      .from('tffrs_performances')
      .select('*')
      .limit(5)
    
    if (perfError) {
      console.log('❌ Error fetching performances:', perfError.message)
    } else {
      console.log(`✅ Found ${performances?.length || 0} performances`)
      if (performances && performances.length > 0) {
        console.log('Sample performance:', {
          athlete: performances[0].athlete_name,
          event: performances[0].event_name,
          mark: performances[0].mark
        })
      }
    }
    
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

checkData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
