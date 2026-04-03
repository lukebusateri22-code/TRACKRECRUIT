/**
 * Test the conference query directly to see if it works
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
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables')
  console.log('SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing')
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Found' : 'Missing')
  process.exit(1)
}

console.log('🔧 Testing conference query...\n')
console.log('URL:', supabaseUrl)
console.log('Using ANON key (same as frontend)\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testQuery() {
  try {
    console.log('📡 Executing query...')
    const startTime = Date.now()
    
    const { data, error } = await supabase
      .from('tffrs_conferences')
      .select('id, conference_name, url')
      .order('conference_name', { ascending: true })
      .limit(100)
    
    const endTime = Date.now()
    console.log(`⏱️  Query took ${endTime - startTime}ms\n`)
    
    if (error) {
      console.error('❌ Error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      
      if (error.code === 'PGRST301') {
        console.log('\n⚠️  RLS POLICY ISSUE DETECTED!')
        console.log('The table has RLS enabled but no policy allows SELECT')
        console.log('You need to add a policy in Supabase dashboard:\n')
        console.log('ALTER TABLE tffrs_conferences ENABLE ROW LEVEL SECURITY;')
        console.log('CREATE POLICY "Allow public read access" ON tffrs_conferences FOR SELECT USING (true);')
      }
      
      return
    }
    
    console.log('✅ Success!')
    console.log('Conferences found:', data?.length)
    console.log('\nFirst 3 conferences:')
    data?.slice(0, 3).forEach((conf, idx) => {
      console.log(`  ${idx + 1}. ${conf.conference_name} (${conf.id})`)
    })
    
  } catch (err) {
    console.error('💥 Unexpected error:', err)
  }
}

testQuery()
