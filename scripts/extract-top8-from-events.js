/**
 * Extract top 8 per event from event_breakdown and populate tables
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

async function extractAndPopulate() {
  console.log('🔄 Extracting top 8 per event from event_breakdown...\n')
  
  try {
    // Get all conferences
    const { data: conferences, error: confError } = await supabase
      .from('tffrs_conferences')
      .select('*')
    
    if (confError) throw confError
    
    console.log(`📊 Found ${conferences.length} conferences\n`)
    
    let totalTeams = 0
    let totalPerformances = 0
    
    for (const conference of conferences) {
      console.log(`Processing: ${conference.conference_name}`)
      
      // Get event_breakdown from the data
      const eventBreakdown = conference.data?.event_breakdown
      
      if (!eventBreakdown) {
        console.log('  ⚠️  No event_breakdown found\n')
        continue
      }
      
      // Track teams we've created
      const teamCache = {}
      
      // Process each event
      for (const [eventName, teamPerformances] of Object.entries(eventBreakdown)) {
        // teamPerformances is an object where keys are team names
        for (const [teamName, categories] of Object.entries(teamPerformances)) {
          // Determine gender from event name
          const gender = eventName.includes('(Women)') ? 'Women' : 'Men'
          const teamKey = `${teamName}-${gender}`
          
          // Create team if not exists
          if (!teamCache[teamKey]) {
            const { data: team, error: teamError } = await supabase
              .from('tffrs_teams')
              .upsert({
                conference_id: conference.id,
                team_name: teamName,
                gender: gender,
                total_points: 0
              }, {
                onConflict: 'conference_id,team_name,gender'
              })
              .select()
              .single()
            
            if (teamError) {
              console.error(`  ❌ Team error for ${teamName}: ${teamError.message}`)
              continue
            }
            
            teamCache[teamKey] = team.id
            totalTeams++
          }
          
          const teamId = teamCache[teamKey]
          
          // Process performances in each category
          for (const [category, performances] of Object.entries(categories)) {
            if (!Array.isArray(performances)) continue
            
            for (const perf of performances) {
              // Only top 8 with valid data
              if (perf.rank && perf.rank <= 8 && perf.athlete && perf.mark) {
                const { error: perfError } = await supabase
                  .from('tffrs_performances')
                  .insert({
                    team_id: teamId,
                    athlete_name: perf.athlete,
                    event_name: perf.event || eventName,
                    event_category: category,
                    mark: perf.mark,
                    rank: perf.rank,
                    points: perf.points || 0
                  })
                
                if (!perfError) {
                  totalPerformances++
                } else if (!perfError.message.includes('duplicate')) {
                  console.error(`    ⚠️  Performance error: ${perfError.message}`)
                }
              }
            }
          }
        }
      }
      
      console.log(`  ✅ Done\n`)
    }
    
    console.log('🎉 COMPLETE!')
    console.log(`✅ Total teams created: ${totalTeams}`)
    console.log(`✅ Total performances inserted: ${totalPerformances}`)
    
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

extractAndPopulate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
