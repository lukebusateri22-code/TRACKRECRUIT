/**
 * Populate tffrs_teams and tffrs_performances from existing scraped conference data
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

async function populate() {
  console.log('🔄 Populating teams and performances from existing data...\n')
  
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
      
      // Check all possible data paths
      let rawData = null
      if (conference.data && conference.data.raw_data) {
        rawData = conference.data.raw_data
      } else if (conference.data && conference.data.data && conference.data.data.teams) {
        rawData = conference.data.data.teams
      }
      
      if (!rawData) {
        console.log('  ⚠️  No usable data found\n')
        continue
      }
      
      // Process each gender
      for (const gender of ['Men', 'Women']) {
        if (!rawData[gender]) continue
        
        const genderTeams = rawData[gender]
        
        for (const [teamName, categories] of Object.entries(genderTeams)) {
          // Create team
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
            console.error(`  ❌ Team error: ${teamError.message}`)
            continue
          }
          
          totalTeams++
          
          // Process performances by category
          for (const [category, performances] of Object.entries(categories)) {
            if (!Array.isArray(performances)) continue
            
            for (const perf of performances) {
              if (perf.rank && perf.rank <= 8 && perf.athlete) {
                const { error: perfError } = await supabase
                  .from('tffrs_performances')
                  .insert({
                    team_id: team.id,
                    athlete_name: perf.athlete,
                    event_name: perf.event || 'Unknown',
                    event_category: category,
                    mark: perf.mark || '',
                    rank: perf.rank,
                    points: perf.points || 0
                  })
                
                if (!perfError) {
                  totalPerformances++
                }
              }
            }
          }
        }
      }
      
      console.log(`  ✅ Done\n`)
    }
    
    console.log('🎉 Complete!')
    console.log(`✅ Teams: ${totalTeams}`)
    console.log(`✅ Performances: ${totalPerformances}`)
    
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

populate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
