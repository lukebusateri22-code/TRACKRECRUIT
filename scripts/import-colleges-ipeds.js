/**
 * Import college data from IPEDS (Integrated Postsecondary Education Data System)
 * 
 * This script imports NCAA D1, D2, D3 colleges with track & field programs
 * Data source: IPEDS College Scorecard API and manual NCAA lists
 * 
 * Usage:
 *   node scripts/import-colleges-ipeds.js
 */

const https = require('https')
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// NCAA D1 Track & Field Schools (Top 100 programs to start)
// This is a curated list - in production, you'd import from IPEDS CSV
const NCAA_D1_SCHOOLS = [
  // Power 5 Conferences
  { name: 'University of Oregon', city: 'Eugene', state: 'OR', conference: 'Big Ten', division: 'D1' },
  { name: 'University of Southern California', city: 'Los Angeles', state: 'CA', conference: 'Big Ten', division: 'D1' },
  { name: 'Stanford University', city: 'Stanford', state: 'CA', conference: 'ACC', division: 'D1' },
  { name: 'University of Texas at Austin', city: 'Austin', state: 'TX', conference: 'SEC', division: 'D1' },
  { name: 'University of Florida', city: 'Gainesville', state: 'FL', conference: 'SEC', division: 'D1' },
  { name: 'Louisiana State University', city: 'Baton Rouge', state: 'LA', conference: 'SEC', division: 'D1' },
  { name: 'University of Georgia', city: 'Athens', state: 'GA', conference: 'SEC', division: 'D1' },
  { name: 'University of Arkansas', city: 'Fayetteville', state: 'AR', conference: 'SEC', division: 'D1' },
  { name: 'Texas A&M University', city: 'College Station', state: 'TX', conference: 'SEC', division: 'D1' },
  { name: 'University of Alabama', city: 'Tuscaloosa', state: 'AL', conference: 'SEC', division: 'D1' },
  
  // Big Ten
  { name: 'University of Michigan', city: 'Ann Arbor', state: 'MI', conference: 'Big Ten', division: 'D1' },
  { name: 'Ohio State University', city: 'Columbus', state: 'OH', conference: 'Big Ten', division: 'D1' },
  { name: 'Penn State University', city: 'University Park', state: 'PA', conference: 'Big Ten', division: 'D1' },
  { name: 'University of Wisconsin', city: 'Madison', state: 'WI', conference: 'Big Ten', division: 'D1' },
  { name: 'University of Minnesota', city: 'Minneapolis', state: 'MN', conference: 'Big Ten', division: 'D1' },
  { name: 'Indiana University', city: 'Bloomington', state: 'IN', conference: 'Big Ten', division: 'D1' },
  { name: 'University of Illinois', city: 'Champaign', state: 'IL', conference: 'Big Ten', division: 'D1' },
  { name: 'Purdue University', city: 'West Lafayette', state: 'IN', conference: 'Big Ten', division: 'D1' },
  
  // ACC
  { name: 'University of North Carolina', city: 'Chapel Hill', state: 'NC', conference: 'ACC', division: 'D1' },
  { name: 'Duke University', city: 'Durham', state: 'NC', conference: 'ACC', division: 'D1' },
  { name: 'Clemson University', city: 'Clemson', state: 'SC', conference: 'ACC', division: 'D1' },
  { name: 'Florida State University', city: 'Tallahassee', state: 'FL', conference: 'ACC', division: 'D1' },
  { name: 'University of Miami', city: 'Coral Gables', state: 'FL', conference: 'ACC', division: 'D1' },
  { name: 'Virginia Tech', city: 'Blacksburg', state: 'VA', conference: 'ACC', division: 'D1' },
  { name: 'University of Virginia', city: 'Charlottesville', state: 'VA', conference: 'ACC', division: 'D1' },
  
  // Big 12
  { name: 'Baylor University', city: 'Waco', state: 'TX', conference: 'Big 12', division: 'D1' },
  { name: 'Texas Tech University', city: 'Lubbock', state: 'TX', conference: 'Big 12', division: 'D1' },
  { name: 'University of Kansas', city: 'Lawrence', state: 'KS', conference: 'Big 12', division: 'D1' },
  { name: 'Kansas State University', city: 'Manhattan', state: 'KS', conference: 'Big 12', division: 'D1' },
  { name: 'Oklahoma State University', city: 'Stillwater', state: 'OK', conference: 'Big 12', division: 'D1' },
  
  // Pac-12 (remaining)
  { name: 'University of Washington', city: 'Seattle', state: 'WA', conference: 'Big Ten', division: 'D1' },
  { name: 'University of California, Los Angeles', city: 'Los Angeles', state: 'CA', conference: 'Big Ten', division: 'D1' },
  { name: 'Arizona State University', city: 'Tempe', state: 'AZ', conference: 'Big 12', division: 'D1' },
  { name: 'University of Arizona', city: 'Tucson', state: 'AZ', conference: 'Big 12', division: 'D1' },
  { name: 'University of Colorado', city: 'Boulder', state: 'CO', conference: 'Big 12', division: 'D1' },
  { name: 'University of Utah', city: 'Salt Lake City', state: 'UT', conference: 'Big 12', division: 'D1' },
  
  // Other strong D1 programs
  { name: 'Brigham Young University', city: 'Provo', state: 'UT', conference: 'Big 12', division: 'D1' },
  { name: 'University of Notre Dame', city: 'Notre Dame', state: 'IN', conference: 'ACC', division: 'D1' },
  { name: 'Georgetown University', city: 'Washington', state: 'DC', conference: 'Big East', division: 'D1' },
  { name: 'Villanova University', city: 'Villanova', state: 'PA', conference: 'Big East', division: 'D1' },
  { name: 'Syracuse University', city: 'Syracuse', state: 'NY', conference: 'ACC', division: 'D1' },
  { name: 'Boston College', city: 'Chestnut Hill', state: 'MA', conference: 'ACC', division: 'D1' },
  { name: 'University of Tennessee', city: 'Knoxville', state: 'TN', conference: 'SEC', division: 'D1' },
  { name: 'University of Kentucky', city: 'Lexington', state: 'KY', conference: 'SEC', division: 'D1' },
  { name: 'Mississippi State University', city: 'Starkville', state: 'MS', conference: 'SEC', division: 'D1' },
  { name: 'University of Mississippi', city: 'Oxford', state: 'MS', conference: 'SEC', division: 'D1' },
  { name: 'Auburn University', city: 'Auburn', state: 'AL', conference: 'SEC', division: 'D1' },
  { name: 'University of South Carolina', city: 'Columbia', state: 'SC', conference: 'SEC', division: 'D1' },
  { name: 'Vanderbilt University', city: 'Nashville', state: 'TN', conference: 'SEC', division: 'D1' },
]

// Region mapping
const STATE_TO_REGION = {
  'ME': 'Northeast', 'NH': 'Northeast', 'VT': 'Northeast', 'MA': 'Northeast', 'RI': 'Northeast', 'CT': 'Northeast',
  'NY': 'Northeast', 'NJ': 'Northeast', 'PA': 'Northeast', 'DE': 'Northeast', 'MD': 'Northeast', 'DC': 'Northeast',
  'VA': 'Southeast', 'WV': 'Southeast', 'NC': 'Southeast', 'SC': 'Southeast', 'GA': 'Southeast', 'FL': 'Southeast',
  'KY': 'Southeast', 'TN': 'Southeast', 'AL': 'Southeast', 'MS': 'Southeast', 'LA': 'Southeast', 'AR': 'Southeast',
  'OH': 'Midwest', 'IN': 'Midwest', 'IL': 'Midwest', 'MI': 'Midwest', 'WI': 'Midwest', 'MN': 'Midwest',
  'IA': 'Midwest', 'MO': 'Midwest', 'ND': 'Midwest', 'SD': 'Midwest', 'NE': 'Midwest', 'KS': 'Midwest',
  'OK': 'Southwest', 'TX': 'Southwest', 'NM': 'Southwest', 'AZ': 'Southwest',
  'MT': 'West', 'ID': 'West', 'WY': 'West', 'CO': 'West', 'UT': 'West', 'NV': 'West',
  'WA': 'West', 'OR': 'West', 'CA': 'West', 'AK': 'West', 'HI': 'West'
}

async function importColleges() {
  console.log('🏫 Starting college data import...\n')
  
  let imported = 0
  let skipped = 0
  let errors = 0
  
  for (const school of NCAA_D1_SCHOOLS) {
    try {
      console.log(`📍 Processing: ${school.name}`)
      
      // Check if college already exists
      const { data: existing } = await supabase
        .from('colleges')
        .select('id')
        .eq('name', school.name)
        .eq('state', school.state)
        .single()
      
      if (existing) {
        console.log(`   ⏭️  Already exists, skipping`)
        skipped++
        continue
      }
      
      // Prepare college data
      const collegeData = {
        name: school.name,
        city: school.city,
        state: school.state,
        ncaa_division: school.division,
        conference: school.conference,
        region: STATE_TO_REGION[school.state] || 'Unknown',
        has_mens_track: true,
        has_womens_track: true,
        data_source: 'Manual',
        data_quality_score: 60, // Basic info only
        last_verified_at: new Date().toISOString()
      }
      
      // Insert into database
      const { error } = await supabase
        .from('colleges')
        .insert(collegeData)
      
      if (error) throw error
      
      console.log(`   ✅ Imported successfully`)
      imported++
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`)
      errors++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Import Summary:')
  console.log(`   ✅ Imported: ${imported}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📝 Total processed: ${NCAA_D1_SCHOOLS.length}`)
  console.log('='.repeat(60))
}

// Run the import
importColleges()
  .then(() => {
    console.log('\n✨ College import complete!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n💥 Fatal error:', err)
    process.exit(1)
  })
