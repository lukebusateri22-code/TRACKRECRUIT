/**
 * Remove duplicate performances from the database
 * Keep only one entry per unique combination of team_id, athlete_name, event_name, rank
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

async function removeDuplicates() {
  console.log('🔄 Removing duplicate performances...\n')
  
  try {
    // Get all performances
    const { data: performances, error } = await supabase
      .from('tffrs_performances')
      .select('*')
      .order('id')
    
    if (error) throw error
    
    console.log(`📊 Found ${performances.length} total performances`)
    
    // Group by unique key
    const seen = new Map()
    const duplicates = []
    
    for (const perf of performances) {
      const key = `${perf.team_id}-${perf.athlete_name}-${perf.event_name}-${perf.rank}`
      
      if (seen.has(key)) {
        // This is a duplicate - mark for deletion
        duplicates.push(perf.id)
      } else {
        // First occurrence - keep it
        seen.set(key, perf.id)
      }
    }
    
    console.log(`🔍 Found ${duplicates.length} duplicate entries`)
    console.log(`✅ Keeping ${seen.size} unique performances\n`)
    
    if (duplicates.length > 0) {
      console.log('🗑️  Deleting duplicates...')
      
      // Delete in batches of 100
      for (let i = 0; i < duplicates.length; i += 100) {
        const batch = duplicates.slice(i, i + 100)
        const { error: deleteError } = await supabase
          .from('tffrs_performances')
          .delete()
          .in('id', batch)
        
        if (deleteError) {
          console.error(`❌ Error deleting batch: ${deleteError.message}`)
        } else {
          console.log(`  ✅ Deleted ${batch.length} duplicates (${i + batch.length}/${duplicates.length})`)
        }
      }
      
      console.log('\n🎉 Duplicates removed!')
    } else {
      console.log('✅ No duplicates found!')
    }
    
    // Verify final count
    const { count } = await supabase
      .from('tffrs_performances')
      .select('*', { count: 'exact', head: true })
    
    console.log(`\n📊 Final count: ${count} performances`)
    
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

removeDuplicates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
