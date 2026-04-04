/**
 * Check which conferences have performance data
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

async function checkAllConferences() {
  console.log('🔍 Checking all conferences for performance data...\n')
  
  try {
    // Get all conferences
    const { data: conferences, error: confError } = await supabase
      .from('tffrs_conferences')
      .select('id, conference_name')
      .order('conference_name')
    
    if (confError) throw confError
    
    console.log(`Found ${conferences.length} conferences\n`)
    
    for (const conf of conferences) {
      // Get teams for this conference
      const { data: teams, error: teamError } = await supabase
        .from('tffrs_teams')
        .select('id')
        .eq('conference_id', conf.id)
      
      if (teamError) {
        console.log(`❌ ${conf.conference_name}: Error getting teams - ${teamError.message}`)
        continue
      }
      
      const teamCount = teams?.length || 0
      
      if (teamCount === 0) {
        console.log(`⚠️  ${conf.conference_name}: 0 teams, 0 performances`)
        continue
      }
      
      // Get performances for these teams
      const teamIds = teams.map(t => t.id)
      const { count: perfCount, error: perfError } = await supabase
        .from('tffrs_performances')
        .select('*', { count: 'exact', head: true })
        .in('team_id', teamIds)
      
      if (perfError) {
        console.log(`❌ ${conf.conference_name}: Error getting performances - ${perfError.message}`)
        continue
      }
      
      if (perfCount === 0) {
        console.log(`⚠️  ${conf.conference_name}: ${teamCount} teams, 0 performances`)
      } else {
        console.log(`✅ ${conf.conference_name}: ${teamCount} teams, ${perfCount} performances`)
      }
    }
    
  } catch (err) {
    console.error('Error:', err)
  }
}

checkAllConferences()
