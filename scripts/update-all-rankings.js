/**
 * Update national team rankings with complete data (all 215 teams)
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

// Complete Women's Rankings (215 teams)
const womenRankings = [
  { rank: 1, team: 'LSU' }, { rank: 2, team: 'Texas Tech' }, { rank: 3, team: 'Duke' }, { rank: 4, team: 'Georgia' },
  { rank: 5, team: 'Arkansas' }, { rank: 6, team: 'Southern California' }, { rank: 7, team: 'Texas A&M' },
  { rank: 8, team: 'South Carolina' }, { rank: 9, team: 'Clemson' }, { rank: 10, team: 'Kentucky' },
  { rank: 11, team: 'Florida' }, { rank: 12, team: 'Baylor' }, { rank: 13, team: 'Howard' }, { rank: 14, team: 'BYU' },
  { rank: 15, team: 'Kansas State' }, { rank: 16, team: 'UCF' }, { rank: 17, team: 'Nebraska' }, { rank: 18, team: 'Virginia' },
  { rank: 19, team: 'West Virginia' }, { rank: 20, team: 'Michigan' }, { rank: 21, team: 'Miami (Fla.)' },
  { rank: 22, team: 'UC Santa Barbara' }, { rank: 23, team: 'Florida State' }, { rank: 24, team: 'Notre Dame' },
  { rank: 25, team: 'UCLA' }, { rank: 26, team: 'Oklahoma' }, { rank: 27, team: 'Ohio State' }, { rank: 28, team: 'Arizona State' },
  { rank: 29, team: 'Minnesota' }, { rank: 30, team: 'NC State' }, { rank: 31, team: 'TCU' }, { rank: 32, team: 'Penn State' },
  { rank: 33, team: 'Ole Miss' }, { rank: 34, team: 'Texas State' }, { rank: 35, team: 'Colorado State' }, { rank: 36, team: 'Kansas' },
  { rank: 37, team: 'Alabama' }, { rank: 38, team: 'California' }, { rank: 39, team: 'Rice' }, { rank: 40, team: 'Auburn' },
  { rank: 41, team: 'Kennesaw State' }, { rank: 42, team: 'Missouri' }, { rank: 43, team: 'Vanderbilt' }, { rank: 44, team: 'Texas' },
  { rank: 45, team: 'Purdue' }, { rank: 46, team: 'Villanova' }, { rank: 47, team: 'Montana State' }, { rank: 48, team: 'UNLV' },
  { rank: 49, team: 'Louisville' }, { rank: 50, team: 'Mississippi State' }, { rank: 51, team: 'Virginia Tech' },
  { rank: 52, team: 'Army West Point' }, { rank: 53, team: 'Iowa State' }, { rank: 54, team: 'Air Force' },
  { rank: 55, team: 'George Mason' }, { rank: 56, team: 'Charleston Southern' }, { rank: 57, team: 'Houston' },
  { rank: 58, team: 'Wake Forest' }, { rank: 59, team: 'SMU' }, { rank: 60, team: 'Florida International' },
  { rank: 61, team: 'Charlotte' }, { rank: 62, team: 'Memphis' }, { rank: 63, team: 'Albany' }, { rank: 64, team: 'Boston University' },
  { rank: 65, team: 'NJIT' }, { rank: 66, team: 'Milwaukee' }, { rank: 67, team: 'Cal Poly' }, { rank: 68, team: 'Penn' },
  { rank: 69, team: 'Wisconsin' }, { rank: 70, team: 'Nevada' }, { rank: 71, team: 'Connecticut' }, { rank: 72, team: 'Northern Iowa' },
  { rank: 73, team: 'Indiana State' }, { rank: 74, team: 'Iowa' }, { rank: 75, team: 'Montana' }, { rank: 76, team: 'UTSA' },
  { rank: 77, team: 'North Carolina' }, { rank: 78, team: 'Fresno State' }, { rank: 79, team: 'Eastern Kentucky' },
  { rank: 80, team: 'Toledo' }, { rank: 81, team: 'Northern Colorado' }, { rank: 82, team: 'Oregon' },
  { rank: 83, team: 'UNC-Wilmington' }, { rank: 84, team: 'Coastal Carolina' }, { rank: 85, team: 'Cincinnati' },
  { rank: 86, team: 'Little Rock' }, { rank: 87, team: 'San Diego State' }, { rank: 88, team: 'Liberty' }, { rank: 89, team: 'Tulane' },
  { rank: 90, team: 'Southern' }, { rank: 91, team: 'Utah Valley' }, { rank: 92, team: 'Brown' }, { rank: 93, team: 'Long Beach State' },
  { rank: 94, team: 'Bucknell' }, { rank: 95, team: 'Lamar' }, { rank: 96, team: 'Hawai\'i' }, { rank: 97, team: 'Rutgers' },
  { rank: 98, team: 'Oregon State' }, { rank: 99, team: 'Pittsburgh' }, { rank: 100, team: 'High Point' }, { rank: 101, team: 'La Salle' },
  { rank: 102, team: 'UC Riverside' }, { rank: 103, team: 'Stony Brook' }, { rank: 104, team: 'Norfolk State' },
  { rank: 105, team: 'Oklahoma State' }, { rank: 106, team: 'Indiana' }, { rank: 107, team: 'St. John\'s (N.Y.)' },
  { rank: 108, team: 'Loyola-Chicago' }, { rank: 109, team: 'Northwestern' }, { rank: 110, team: 'Harvard' },
  { rank: 111, team: 'Radford' }, { rank: 112, team: 'Murray State' }, { rank: 113, team: 'Arizona' }, { rank: 114, team: 'Arkansas State' },
  { rank: 115, team: 'Maryland' }, { rank: 116, team: 'Tennessee' }, { rank: 117, team: 'North Carolina A&T' },
  { rank: 118, team: 'Akron' }, { rank: 119, team: 'Princeton' }, { rank: 120, team: 'Jacksonville' },
  { rank: 121, team: 'Northwestern State' }, { rank: 122, team: 'Grand Canyon' }, { rank: 123, team: 'UNC Asheville' },
  { rank: 124, team: 'Alabama A&M' }, { rank: 125, team: 'Cal State Fullerton' }, { rank: 126, team: 'Utah' },
  { rank: 127, team: 'Abilene Christian' }, { rank: 128, team: 'Iona' }, { rank: 129, team: 'Providence' },
  { rank: 130, team: 'James Madison' }, { rank: 131, team: 'UC Irvine' }, { rank: 132, team: 'Appalachian State' },
  { rank: 133, team: 'South Carolina State' }, { rank: 134, team: 'Louisiana' }, { rank: 135, team: 'Furman' },
  { rank: 136, team: 'UC San Diego' }, { rank: 137, team: 'Elon' }, { rank: 138, team: 'Georgia Southern' },
  { rank: 139, team: 'East Carolina' }, { rank: 140, team: 'Washington' }, { rank: 141, team: 'Gardner-Webb' },
  { rank: 142, team: 'Michigan State' }, { rank: 143, team: 'Bryant' }, { rank: 144, team: 'Stanford' },
  { rank: 145, team: 'Central Connecticut State' }, { rank: 146, team: 'Georgia Tech' }, { rank: 147, team: 'Southern Miss' },
  { rank: 148, team: 'Tarleton State' }, { rank: 149, team: 'Saint Louis' }, { rank: 150, team: 'UMBC' },
  { rank: 151, team: 'Boston College' }, { rank: 152, team: 'Bowling Green' }, { rank: 153, team: 'Middle Tennessee' },
  { rank: 154, team: 'Western Michigan' }, { rank: 155, team: 'Eastern Michigan' }, { rank: 156, team: 'Utah State' },
  { rank: 157, team: 'Navy' }, { rank: 158, team: 'Troy' }, { rank: 159, team: 'New Mexico' }, { rank: 160, team: 'Samford' },
  { rank: 161, team: 'Maine' }, { rank: 162, team: 'Lipscomb' }, { rank: 163, team: 'South Alabama' },
  { rank: 164, team: 'St. Thomas (Minn.)' }, { rank: 165, team: 'Bradley' }, { rank: 166, team: 'Miami (Ohio)' },
  { rank: 167, team: 'South Florida' }, { rank: 168, team: 'Tulsa' }, { rank: 169, team: 'ULM' }, { rank: 170, team: 'Dayton' },
  { rank: 171, team: 'Yale' }, { rank: 172, team: 'CSUN' }, { rank: 173, team: 'Wichita State' }, { rank: 173, team: 'Ball State' },
  { rank: 175, team: 'Youngstown State' }, { rank: 176, team: 'San Jose State' }, { rank: 177, team: 'VCU' },
  { rank: 178, team: 'USC Upstate' }, { rank: 179, team: 'San Francisco' }, { rank: 180, team: 'North Texas' },
  { rank: 181, team: 'Robert Morris' }, { rank: 182, team: 'Missouri State' }, { rank: 183, team: 'Hampton' },
  { rank: 184, team: 'UAB' }, { rank: 185, team: 'Northern Arizona' }, { rank: 186, team: 'New Mexico State' },
  { rank: 187, team: 'Illinois State' }, { rank: 188, team: 'Sacramento State' }, { rank: 189, team: 'Houston Christian' },
  { rank: 190, team: 'Marshall' }, { rank: 191, team: 'UTRGV' }, { rank: 191, team: 'UT Arlington' },
  { rank: 193, team: 'Richmond' }, { rank: 194, team: 'Kent State' }, { rank: 194, team: 'Central Michigan' },
  { rank: 194, team: 'Duquesne' }, { rank: 194, team: 'North Florida' }, { rank: 198, team: 'Ohio' },
  { rank: 199, team: 'Central Arkansas' }, { rank: 199, team: 'College Of Charleston' }, { rank: 201, team: 'Georgetown' },
  { rank: 202, team: 'DePaul' }, { rank: 203, team: 'Southern Indiana' }, { rank: 204, team: 'Delaware' },
  { rank: 205, team: 'Belmont' }, { rank: 205, team: 'Rhode Island' }, { rank: 205, team: 'Delaware State' },
  { rank: 205, team: 'Colgate' }, { rank: 209, team: 'Southern Utah' }, { rank: 209, team: 'Eastern Illinois' },
  { rank: 211, team: 'Northeastern' }, { rank: 212, team: 'Drake' }, { rank: 212, team: 'Saint Francis (Pa.)' },
  { rank: 214, team: 'Southern Illinois' }, { rank: 215, team: 'West Georgia' }, { rank: 215, team: 'South Dakota' },
  { rank: 215, team: 'Florida Atlantic' }
]

// Complete Men's Rankings (213 teams)
const menRankings = [
  { rank: 1, team: 'LSU' }, { rank: 2, team: 'Texas Tech' }, { rank: 3, team: 'Minnesota' }, { rank: 4, team: 'Michigan' },
  { rank: 5, team: 'Ole Miss' }, { rank: 6, team: 'Texas A&M' }, { rank: 7, team: 'Virginia' }, { rank: 8, team: 'Kentucky' },
  { rank: 9, team: 'Nebraska' }, { rank: 10, team: 'Rutgers' }, { rank: 11, team: 'Georgia' }, { rank: 12, team: 'Alabama' },
  { rank: 13, team: 'Southern California' }, { rank: 14, team: 'Cal Poly' }, { rank: 15, team: 'Florida State' },
  { rank: 16, team: 'Texas' }, { rank: 17, team: 'Kansas State' }, { rank: 18, team: 'Air Force' }, { rank: 19, team: 'Oklahoma' },
  { rank: 20, team: 'South Florida' }, { rank: 21, team: 'Michigan State' }, { rank: 22, team: 'Florida' },
  { rank: 23, team: 'Arizona State' }, { rank: 24, team: 'Clemson' }, { rank: 25, team: 'UC Santa Barbara' },
  { rank: 26, team: 'NC State' }, { rank: 27, team: 'Eastern Kentucky' }, { rank: 28, team: 'Auburn' }, { rank: 29, team: 'Iowa' },
  { rank: 30, team: 'Colorado State' }, { rank: 31, team: 'Harvard' }, { rank: 32, team: 'Purdue' }, { rank: 33, team: 'Texas State' },
  { rank: 34, team: 'Charlotte' }, { rank: 35, team: 'Wichita State' }, { rank: 36, team: 'Oregon' }, { rank: 37, team: 'Georgetown' },
  { rank: 38, team: 'Cal State Fullerton' }, { rank: 39, team: 'Grand Canyon' }, { rank: 40, team: 'Northwestern State' },
  { rank: 41, team: 'Notre Dame' }, { rank: 42, team: 'TCU' }, { rank: 43, team: 'Penn State' }, { rank: 44, team: 'Mississippi State' },
  { rank: 45, team: 'Houston' }, { rank: 46, team: 'Kennesaw State' }, { rank: 47, team: 'Missouri' },
  { rank: 48, team: 'Northern Arizona' }, { rank: 49, team: 'Virginia Tech' }, { rank: 50, team: 'Miami (Fla.)' },
  { rank: 51, team: 'Ohio State' }, { rank: 52, team: 'Utah State' }, { rank: 53, team: 'Sacramento State' },
  { rank: 54, team: 'Wake Forest' }, { rank: 55, team: 'Princeton' }, { rank: 56, team: 'Howard' }, { rank: 57, team: 'Rhode Island' },
  { rank: 58, team: 'BYU' }, { rank: 59, team: 'Rice' }, { rank: 60, team: 'American' }, { rank: 61, team: 'UCLA' },
  { rank: 62, team: 'Kansas' }, { rank: 63, team: 'Tennessee' }, { rank: 64, team: 'Appalachian State' },
  { rank: 65, team: 'California' }, { rank: 66, team: 'Syracuse' }, { rank: 67, team: 'Butler' }, { rank: 68, team: 'Penn' },
  { rank: 69, team: 'UC San Diego' }, { rank: 70, team: 'Duke' }, { rank: 71, team: 'Liberty' }, { rank: 72, team: 'Tulane' },
  { rank: 73, team: 'Arkansas State' }, { rank: 74, team: 'South Alabama' }, { rank: 75, team: 'Pittsburgh' },
  { rank: 76, team: 'Iona' }, { rank: 77, team: 'Houston Christian' }, { rank: 77, team: 'Fairleigh Dickinson' },
  { rank: 79, team: 'Akron' }, { rank: 80, team: 'Columbia' }, { rank: 81, team: 'Cincinnati' }, { rank: 82, team: 'Incarnate Word' },
  { rank: 83, team: 'UMBC' }, { rank: 84, team: 'Lipscomb' }, { rank: 85, team: 'West Georgia' }, { rank: 86, team: 'UTRGV' },
  { rank: 87, team: 'Georgia Tech' }, { rank: 88, team: 'High Point' }, { rank: 89, team: 'Southern Miss' },
  { rank: 90, team: 'Gardner-Webb' }, { rank: 91, team: 'North Carolina A&T' }, { rank: 92, team: 'Baylor' },
  { rank: 93, team: 'Stephen F. Austin' }, { rank: 94, team: 'Bradley' }, { rank: 95, team: 'Northern Colorado' },
  { rank: 96, team: 'North Carolina' }, { rank: 97, team: 'Long Beach State' }, { rank: 98, team: 'Loyola-Chicago' },
  { rank: 99, team: 'South Carolina' }, { rank: 100, team: 'DePaul' }, { rank: 101, team: 'Florida International' },
  { rank: 102, team: 'Montana' }, { rank: 103, team: 'Tarleton State' }, { rank: 104, team: 'Little Rock' },
  { rank: 105, team: 'Northeastern' }, { rank: 106, team: 'North Texas' }, { rank: 107, team: 'Arkansas-Pine Bluff' },
  { rank: 108, team: 'Iowa State' }, { rank: 109, team: 'Utah Valley' }, { rank: 110, team: 'Eastern Michigan' },
  { rank: 111, team: 'Coppin State' }, { rank: 112, team: 'Maryland' }, { rank: 113, team: 'Weber State' },
  { rank: 114, team: 'Colorado' }, { rank: 115, team: 'UMass Lowell' }, { rank: 116, team: 'ULM' }, { rank: 117, team: 'Marshall' },
  { rank: 118, team: 'Wisconsin' }, { rank: 119, team: 'Illinois State' }, { rank: 120, team: 'Portland' },
  { rank: 121, team: 'Bethune-Cookman' }, { rank: 122, team: 'Charleston Southern' }, { rank: 123, team: 'Arizona' },
  { rank: 124, team: 'Boston College' }, { rank: 125, team: 'South Carolina State' }, { rank: 126, team: 'CSUN' },
  { rank: 127, team: 'Youngstown State' }, { rank: 128, team: 'Montana State' }, { rank: 129, team: 'UT Arlington' },
  { rank: 130, team: 'California Baptist' }, { rank: 131, team: 'William & Mary' }, { rank: 132, team: 'Memphis' },
  { rank: 133, team: 'UTSA' }, { rank: 134, team: 'Miami (Ohio)' }, { rank: 135, team: 'Middle Tennessee' },
  { rank: 136, team: 'Furman' }, { rank: 137, team: 'VCU' }, { rank: 138, team: 'UC Riverside' }, { rank: 139, team: 'Navy' },
  { rank: 140, team: 'UC Irvine' }, { rank: 141, team: 'George Mason' }, { rank: 142, team: 'Campbell' },
  { rank: 143, team: 'Southern' }, { rank: 144, team: 'New Orleans' }, { rank: 145, team: 'Cornell' },
  { rank: 146, team: 'Army West Point' }, { rank: 147, team: 'Oklahoma State' }, { rank: 148, team: 'Connecticut' },
  { rank: 149, team: 'Washington' }, { rank: 150, team: 'Tulsa' }, { rank: 151, team: 'North Florida' },
  { rank: 152, team: 'Delaware State' }, { rank: 153, team: 'Illinois Chicago' }, { rank: 154, team: 'Bucknell' },
  { rank: 155, team: 'Albany' }, { rank: 156, team: 'Idaho' }, { rank: 157, team: 'Idaho State' }, { rank: 158, team: 'Louisiana' },
  { rank: 159, team: 'East Texas A&M' }, { rank: 160, team: 'CSU Bakersfield' }, { rank: 161, team: 'Fresno State' },
  { rank: 162, team: 'Troy' }, { rank: 163, team: 'Hampton' }, { rank: 164, team: 'UNC-Wilmington' }, { rank: 165, team: 'Brown' },
  { rank: 166, team: 'George Washington' }, { rank: 167, team: 'Dartmouth' }, { rank: 168, team: 'Eastern Illinois' },
  { rank: 169, team: 'Jackson State' }, { rank: 170, team: 'East Carolina' }, { rank: 171, team: 'Alabama A&M' },
  { rank: 172, team: 'Kent State' }, { rank: 173, team: 'La Salle' }, { rank: 174, team: 'Providence' },
  { rank: 175, team: 'Oral Roberts' }, { rank: 176, team: 'Norfolk State' }, { rank: 177, team: 'Samford' },
  { rank: 178, team: 'St. Mary\'s (Calif.)' }, { rank: 178, team: 'Drake' }, { rank: 178, team: 'Southern Utah' },
  { rank: 181, team: 'Coastal Carolina' }, { rank: 182, team: 'LIU' }, { rank: 183, team: 'Xavier' },
  { rank: 184, team: 'Texas Southern' }, { rank: 185, team: 'UC Davis' }, { rank: 186, team: 'Central Connecticut State' },
  { rank: 187, team: 'Saint Louis' }, { rank: 188, team: 'Southeastern Louisiana' }, { rank: 188, team: 'Binghamton' },
  { rank: 190, team: 'Marist' }, { rank: 191, team: 'Mount St. Mary\'s' }, { rank: 191, team: 'Louisville' },
  { rank: 193, team: 'Yale' }, { rank: 194, team: 'Lamar' }, { rank: 195, team: 'Indiana State' }, { rank: 196, team: 'Indiana' },
  { rank: 197, team: 'Abilene Christian' }, { rank: 198, team: 'Southern Illinois' }, { rank: 199, team: 'Northern Iowa' },
  { rank: 200, team: 'Central Arkansas' }, { rank: 201, team: 'Vanderbilt' }, { rank: 202, team: 'Wyoming' },
  { rank: 203, team: 'UNC Asheville' }, { rank: 204, team: 'McNeese State' }, { rank: 204, team: 'Northern Kentucky' },
  { rank: 206, team: 'Pepperdine' }, { rank: 207, team: 'Nicholls' }, { rank: 208, team: 'San Jose State' },
  { rank: 208, team: 'Texas A&M-Corpus Christi' }, { rank: 210, team: 'NJIT' }, { rank: 211, team: 'UTEP' },
  { rank: 212, team: 'Tennessee State' }, { rank: 213, team: 'Belmont' }, { rank: 213, team: 'IU Indy' }
]

async function updateRankings() {
  console.log('📊 Updating national team rankings with complete data...\n')
  
  try {
    // Update Men's rankings
    console.log(`👨 Updating Men's rankings (${menRankings.length} teams)...`)
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
    console.log(`✅ Updated ${menRankings.length} men's teams\n`)
    
    // Update Women's rankings
    console.log(`👩 Updating Women's rankings (${womenRankings.length} teams)...`)
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
    console.log(`✅ Updated ${womenRankings.length} women's teams\n`)
    
    console.log('✨ All rankings updated successfully!')
    console.log(`   Total: ${menRankings.length + womenRankings.length} teams`)
    
  } catch (err) {
    console.error('❌ Error updating rankings:', err)
    process.exit(1)
  }
}

updateRankings()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
