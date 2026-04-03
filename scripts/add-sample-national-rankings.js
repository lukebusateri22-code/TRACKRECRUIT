/**
 * Add sample national team rankings data
 * This is temporary until we implement proper Cloudflare bypass scraping
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
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// NCAA D1 Men's Track & Field Rankings (USTFCCCA Indoor 2024)
const menRankings = [
  { rank: 1, team: 'LSU', points: null },
  { rank: 2, team: 'Texas Tech', points: null },
  { rank: 3, team: 'Minnesota', points: null },
  { rank: 4, team: 'Michigan', points: null },
  { rank: 5, team: 'Ole Miss', points: null },
  { rank: 6, team: 'Texas A&M', points: null },
  { rank: 7, team: 'Virginia', points: null },
  { rank: 8, team: 'Kentucky', points: null },
  { rank: 9, team: 'Nebraska', points: null },
  { rank: 10, team: 'Rutgers', points: null },
  { rank: 11, team: 'Georgia', points: null },
  { rank: 12, team: 'Alabama', points: null },
  { rank: 13, team: 'Southern California', points: null },
  { rank: 14, team: 'Cal Poly', points: null },
  { rank: 15, team: 'Florida State', points: null },
  { rank: 16, team: 'Texas', points: null },
  { rank: 17, team: 'Kansas State', points: null },
  { rank: 18, team: 'Air Force', points: null },
  { rank: 19, team: 'Oklahoma', points: null },
  { rank: 20, team: 'South Florida', points: null },
  { rank: 21, team: 'Michigan State', points: null },
  { rank: 22, team: 'Florida', points: null },
  { rank: 23, team: 'Arizona State', points: null },
  { rank: 24, team: 'Clemson', points: null },
  { rank: 25, team: 'UC Santa Barbara', points: null },
  { rank: 26, team: 'NC State', points: null },
  { rank: 27, team: 'Eastern Kentucky', points: null },
  { rank: 28, team: 'Auburn', points: null },
  { rank: 29, team: 'Iowa', points: null },
  { rank: 30, team: 'Colorado State', points: null },
  { rank: 31, team: 'Harvard', points: null },
  { rank: 32, team: 'Purdue', points: null },
  { rank: 33, team: 'Texas State', points: null },
  { rank: 34, team: 'Charlotte', points: null },
  { rank: 35, team: 'Wichita State', points: null },
  { rank: 36, team: 'Oregon', points: null },
  { rank: 37, team: 'Georgetown', points: null },
  { rank: 38, team: 'Cal State Fullerton', points: null },
  { rank: 39, team: 'Grand Canyon', points: null },
  { rank: 40, team: 'Northwestern State', points: null },
  { rank: 41, team: 'Notre Dame', points: null },
  { rank: 42, team: 'TCU', points: null },
  { rank: 43, team: 'Penn State', points: null },
  { rank: 44, team: 'Mississippi State', points: null },
  { rank: 45, team: 'Houston', points: null },
  { rank: 46, team: 'Kennesaw State', points: null },
  { rank: 47, team: 'Missouri', points: null },
  { rank: 48, team: 'Northern Arizona', points: null },
  { rank: 49, team: 'Virginia Tech', points: null },
  { rank: 50, team: 'Miami (Fla.)', points: null }
]

// NCAA D1 Women's Track & Field Rankings (USTFCCCA Indoor 2024)
const womenRankings = [
  { rank: 1, team: 'LSU', points: null },
  { rank: 2, team: 'Texas Tech', points: null },
  { rank: 3, team: 'Duke', points: null },
  { rank: 4, team: 'Georgia', points: null },
  { rank: 5, team: 'Arkansas', points: null },
  { rank: 6, team: 'Southern California', points: null },
  { rank: 7, team: 'Texas A&M', points: null },
  { rank: 8, team: 'South Carolina', points: null },
  { rank: 9, team: 'Clemson', points: null },
  { rank: 10, team: 'Kentucky', points: null },
  { rank: 11, team: 'Florida', points: null },
  { rank: 12, team: 'Baylor', points: null },
  { rank: 13, team: 'Howard', points: null },
  { rank: 14, team: 'BYU', points: null },
  { rank: 15, team: 'Kansas State', points: null },
  { rank: 16, team: 'UCF', points: null },
  { rank: 17, team: 'Nebraska', points: null },
  { rank: 18, team: 'Virginia', points: null },
  { rank: 19, team: 'West Virginia', points: null },
  { rank: 20, team: 'Michigan', points: null },
  { rank: 21, team: 'Miami (Fla.)', points: null },
  { rank: 22, team: 'UC Santa Barbara', points: null },
  { rank: 23, team: 'Florida State', points: null },
  { rank: 24, team: 'Notre Dame', points: null },
  { rank: 25, team: 'UCLA', points: null },
  { rank: 26, team: 'Oklahoma', points: null },
  { rank: 27, team: 'Ohio State', points: null },
  { rank: 28, team: 'Arizona State', points: null },
  { rank: 29, team: 'Minnesota', points: null },
  { rank: 30, team: 'NC State', points: null },
  { rank: 31, team: 'TCU', points: null },
  { rank: 32, team: 'Penn State', points: null },
  { rank: 33, team: 'Ole Miss', points: null },
  { rank: 34, team: 'Texas State', points: null },
  { rank: 35, team: 'Colorado State', points: null },
  { rank: 36, team: 'Kansas', points: null },
  { rank: 37, team: 'Alabama', points: null },
  { rank: 38, team: 'California', points: null },
  { rank: 39, team: 'Rice', points: null },
  { rank: 40, team: 'Auburn', points: null },
  { rank: 41, team: 'Kennesaw State', points: null },
  { rank: 42, team: 'Missouri', points: null },
  { rank: 43, team: 'Vanderbilt', points: null },
  { rank: 44, team: 'Texas', points: null },
  { rank: 45, team: 'Purdue', points: null },
  { rank: 46, team: 'Villanova', points: null },
  { rank: 47, team: 'Montana State', points: null },
  { rank: 48, team: 'UNLV', points: null },
  { rank: 49, team: 'Louisville', points: null },
  { rank: 50, team: 'Mississippi State', points: null }
]

async function addRankings() {
  console.log('📊 Adding sample national team rankings...\n')
  
  try {
    // Add Men's rankings
    console.log('👨 Adding Men\'s rankings...')
    const { error: menError } = await supabase
      .from('national_team_rankings')
      .upsert({
        gender: 'Men',
        url: 'https://web4.ustfccca.org/iz/tfri/collection/17387',
        scraped_at: new Date().toISOString(),
        rankings: menRankings,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'gender'
      })
    
    if (menError) throw menError
    console.log(`✅ Added ${menRankings.length} men's teams\n`)
    
    // Add Women's rankings
    console.log('👩 Adding Women\'s rankings...')
    const { error: womenError } = await supabase
      .from('national_team_rankings')
      .upsert({
        gender: 'Women',
        url: 'https://web4.ustfccca.org/iz/tfri/collection/17388',
        scraped_at: new Date().toISOString(),
        rankings: womenRankings,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'gender'
      })
    
    if (womenError) throw womenError
    console.log(`✅ Added ${womenRankings.length} women's teams\n`)
    
    console.log('✨ Sample rankings added successfully!')
    console.log('\n📝 Note: These are sample rankings for demonstration.')
    console.log('   For production, implement Cloudflare bypass scraping.')
    
  } catch (err) {
    console.error('❌ Error adding rankings:', err)
    process.exit(1)
  }
}

addRankings()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
