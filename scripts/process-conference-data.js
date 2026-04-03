/**
 * Process scraped conference data and populate teams/performances tables
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

async function processConferences() {
  console.log('🔄 Processing conference data...\n')
  
  try {
    // Get all conferences with data
    const { data: conferences, error: confError } = await supabase
      .from('tffrs_conferences')
      .select('*')
    
    if (confError) throw confError
    
    console.log(`📊 Found ${conferences.length} conferences to process\n`)
    
    let totalTeams = 0
    let totalPerformances = 0
    
    for (const conference of conferences) {
      console.log(`Processing: ${conference.conference_name}`)
      
      // Check if data exists in the expected structure
      let teamsData = null
      
      if (conference.data && conference.data.data && conference.data.data.teams) {
        teamsData = conference.data.data.teams
      } else if (conference.data && conference.data.teams) {
        teamsData = conference.data.teams
      }
      
      if (!teamsData) {
        console.log('  ⚠️  No team data found, skipping\n')
        continue
      }
      
      // Process each gender's teams
      for (const gender of ['Men', 'Women']) {
        if (!teamsData[gender]) continue
        
        const genderTeams = teamsData[gender]
        
        for (const [teamName, categories] of Object.entries(genderTeams)) {
          // Insert or update team
          const { data: team, error: teamError } = await supabase
            .from('tffrs_teams')
            .upsert({
              conference_id: conference.id,
              team_name: teamName,
              gender: gender,
              total_points: 0,
              rank: null
            }, {
              onConflict: 'conference_id,team_name,gender'
            })
            .select()
            .single()
          
          if (teamError) {
            console.error(`  ❌ Error inserting team ${teamName}:`, teamError.message)
            continue
          }
          
          totalTeams++
          
          // Process performances for each category (Jumps, Throws, Sprints, Distance)
          for (const [category, performances] of Object.entries(categories)) {
            if (!Array.isArray(performances)) continue
            
            for (const perf of performances) {
              // Only insert top 8 performances
              if (perf.rank && perf.rank <= 8 && perf.athlete) {
                const { error: perfError } = await supabase
                  .from('tffrs_performances')
                  .insert({
                    team_id: team.id,
                    athlete_name: perf.athlete,
                    event_name: perf.event,
                    event_category: category,
                    mark: perf.mark,
                    rank: perf.rank,
                    points: perf.points || 0
                  })
                
                if (perfError && !perfError.message.includes('duplicate')) {
                  console.error(`    ❌ Error inserting performance:`, perfError.message)
                } else if (!perfError) {
                  totalPerformances++
                }
              }
            }
          }
        }
      }
      
      console.log(`  ✅ Processed ${conference.conference_name}\n`)
    }
    
    console.log('🎉 Processing complete!')
    console.log(`✅ Total teams: ${totalTeams}`)
    console.log(`✅ Total performances: ${totalPerformances}`)
    
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

processConferences()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
