/**
 * Deep check of all database tables to find where the data is
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

async function deepCheck() {
  console.log('🔍 DEEP DATABASE CHECK\n')
  console.log('=' .repeat(60))
  
  try {
    // 1. Check total counts
    console.log('\n📊 TOTAL COUNTS:')
    const { count: confCount } = await supabase.from('tffrs_conferences').select('*', { count: 'exact', head: true })
    const { count: teamCount } = await supabase.from('tffrs_teams').select('*', { count: 'exact', head: true })
    const { count: perfCount } = await supabase.from('tffrs_performances').select('*', { count: 'exact', head: true })
    
    console.log(`Conferences: ${confCount}`)
    console.log(`Teams: ${teamCount}`)
    console.log(`Performances: ${perfCount}`)
    
    // 2. Check which conferences have raw scraped data
    console.log('\n📦 RAW SCRAPED DATA:')
    const { data: confsWithData } = await supabase
      .from('tffrs_conferences')
      .select('id, conference_name, data')
      .not('data', 'is', null)
    
    console.log(`Conferences with raw data: ${confsWithData?.length}`)
    
    // Check if raw data has event_breakdown
    let withEventBreakdown = 0
    let withoutEventBreakdown = 0
    
    confsWithData?.forEach(conf => {
      if (conf.data && conf.data.event_breakdown) {
        withEventBreakdown++
      } else {
        withoutEventBreakdown++
      }
    })
    
    console.log(`  - With event_breakdown: ${withEventBreakdown}`)
    console.log(`  - Without event_breakdown: ${withoutEventBreakdown}`)
    
    // 3. Check teams by conference
    console.log('\n👥 TEAMS BY CONFERENCE:')
    const { data: allTeams } = await supabase
      .from('tffrs_teams')
      .select('conference_id, team_name, gender')
    
    const teamsByConf = {}
    allTeams?.forEach(team => {
      if (!teamsByConf[team.conference_id]) {
        teamsByConf[team.conference_id] = []
      }
      teamsByConf[team.conference_id].push(team)
    })
    
    console.log(`Conferences with teams: ${Object.keys(teamsByConf).length}`)
    
    // Show which conferences have teams
    for (const confId of Object.keys(teamsByConf)) {
      const { data: conf } = await supabase
        .from('tffrs_conferences')
        .select('conference_name')
        .eq('id', confId)
        .single()
      
      console.log(`  - ${conf?.conference_name}: ${teamsByConf[confId].length} teams`)
    }
    
    // 4. Check performances by team
    console.log('\n🏃 PERFORMANCES DISTRIBUTION:')
    const { data: allPerfs } = await supabase
      .from('tffrs_performances')
      .select('team_id, event_name')
    
    const perfsByTeam = {}
    allPerfs?.forEach(perf => {
      if (!perfsByTeam[perf.team_id]) {
        perfsByTeam[perf.team_id] = 0
      }
      perfsByTeam[perf.team_id]++
    })
    
    console.log(`Teams with performances: ${Object.keys(perfsByTeam).length}`)
    console.log(`Total performances: ${allPerfs?.length}`)
    
    // 5. Sample a conference that should have data but doesn't
    console.log('\n🔬 SAMPLE CHECK - Big Ten:')
    const { data: bigTen } = await supabase
      .from('tffrs_conferences')
      .select('*')
      .eq('conference_name', 'Big Ten')
      .single()
    
    if (bigTen) {
      console.log(`Big Ten ID: ${bigTen.id}`)
      console.log(`Has raw data: ${bigTen.data ? 'YES' : 'NO'}`)
      
      if (bigTen.data && bigTen.data.event_breakdown) {
        const events = Object.keys(bigTen.data.event_breakdown)
        console.log(`Events in raw data: ${events.length}`)
        console.log(`Sample events: ${events.slice(0, 3).join(', ')}`)
      }
      
      const { count: bigTenTeams } = await supabase
        .from('tffrs_teams')
        .select('*', { count: 'exact', head: true })
        .eq('conference_id', bigTen.id)
      
      console.log(`Teams in database: ${bigTenTeams}`)
    }
    
    // 6. Check for duplicate conference names
    console.log('\n🔄 DUPLICATE CHECK:')
    const { data: allConfs } = await supabase
      .from('tffrs_conferences')
      .select('conference_name')
    
    const nameCount = {}
    allConfs?.forEach(c => {
      nameCount[c.conference_name] = (nameCount[c.conference_name] || 0) + 1
    })
    
    const duplicates = Object.entries(nameCount).filter(([name, count]) => count > 1)
    if (duplicates.length > 0) {
      console.log('Duplicate conference names found:')
      duplicates.forEach(([name, count]) => {
        console.log(`  - ${name}: ${count} entries`)
      })
    } else {
      console.log('No duplicate conference names')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('\n💡 SUMMARY:')
    console.log(`Total data: ${confCount} conferences, ${teamCount} teams, ${perfCount} performances`)
    console.log(`Raw scraped data available for: ${withEventBreakdown} conferences`)
    console.log(`Data populated in tables for: ${Object.keys(teamsByConf).length} conferences`)
    console.log(`\n⚠️  Missing data for: ${withEventBreakdown - Object.keys(teamsByConf).length} conferences`)
    
  } catch (err) {
    console.error('Error:', err)
  }
}

deepCheck()
