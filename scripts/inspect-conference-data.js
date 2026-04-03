/**
 * Inspect the structure of scraped conference data
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

async function inspectData() {
  try {
    // Get one conference with data
    const { data: conferences, error } = await supabase
      .from('tffrs_conferences')
      .select('*')
      .not('data', 'is', null)
      .limit(1)
    
    if (error) throw error
    
    if (conferences && conferences.length > 0) {
      console.log('Sample conference data structure:')
      console.log(JSON.stringify(conferences[0].data, null, 2))
    } else {
      console.log('No conference data found')
    }
    
  } catch (err) {
    console.error('Error:', err)
  }
}

inspectData()
