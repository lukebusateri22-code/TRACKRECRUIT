/**
 * Add missing high_school column to athlete_profiles table
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

async function addColumn() {
  console.log('🔧 Adding high_school column to athlete_profiles...\n')
  
  try {
    // Use raw SQL to add the column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE athlete_profiles 
        ADD COLUMN IF NOT EXISTS high_school TEXT;
        
        CREATE INDEX IF NOT EXISTS idx_athlete_profiles_high_school 
        ON athlete_profiles(high_school);
      `
    })
    
    if (error) {
      console.error('❌ Error:', error)
      console.log('\n⚠️  Trying alternative method...\n')
      
      // Alternative: Just try to select from the table to see if column exists
      const { data, error: selectError } = await supabase
        .from('athlete_profiles')
        .select('high_school')
        .limit(1)
      
      if (selectError) {
        console.error('Column does not exist. Please run this SQL manually in Supabase dashboard:')
        console.log('\nALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS high_school TEXT;')
        process.exit(1)
      } else {
        console.log('✅ Column already exists!')
      }
    } else {
      console.log('✅ Column added successfully!')
    }
    
  } catch (err) {
    console.error('❌ Error:', err)
    console.log('\n⚠️  Please run this SQL manually in Supabase dashboard:')
    console.log('\nALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS high_school TEXT;')
    process.exit(1)
  }
}

addColumn()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
