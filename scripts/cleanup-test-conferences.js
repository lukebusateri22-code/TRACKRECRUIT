#!/usr/bin/env node
/**
 * Clean up test conferences from the database
 * Run with: node scripts/cleanup-test-conferences.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file
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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupTestConferences() {
  console.log('🧹 Cleaning up test conferences...\n')
  
  // First, get all conferences
  const { data: allConferences, error: fetchError } = await supabase
    .from('tffrs_conferences')
    .select('id, conference_name')
  
  if (fetchError) {
    console.error('❌ Error fetching conferences:', fetchError.message)
    return
  }
  
  // Find test conferences (case-insensitive)
  const testPatterns = ['test.com', 'unknown conference']
  const toDelete = allConferences.filter(conf => {
    const name = conf.conference_name.toLowerCase()
    return testPatterns.some(pattern => name.includes(pattern))
  })
  
  console.log(`Found ${toDelete.length} test conferences to remove\n`)
  
  for (const conf of toDelete) {
    console.log(`🗑️  Removing: ${conf.conference_name} (ID: ${conf.id})`)
    
    try {
      const { error } = await supabase
        .from('tffrs_conferences')
        .delete()
        .eq('id', conf.id)
      
      if (error) {
        console.error(`❌ Error removing ${conf.conference_name}:`, error.message)
      } else {
        console.log(`✅ Successfully removed ${conf.conference_name}`)
      }
    } catch (err) {
      console.error(`❌ Error removing ${conf.conference_name}:`, err.message)
    }
  }
  
  console.log('\n📊 Checking remaining conferences...')
  
  try {
    const { data, error } = await supabase
      .from('tffrs_conferences')
      .select('conference_name, scraped_at')
      .order('conference_name')
    
    if (error) {
      console.error('❌ Error checking conferences:', error.message)
    } else if (data) {
      console.log(`\n📋 Remaining conferences (${data.length}):`)
      data.forEach(conf => {
        console.log(`   • ${conf.conference_name} (scraped: ${new Date(conf.scraped_at).toLocaleDateString()})`)
      })
    }
  } catch (err) {
    console.error('❌ Error checking conferences:', err.message)
  }
}

cleanupTestConferences()
  .then(() => {
    console.log('\n✅ Cleanup complete!')
    process.exit(0)
  })
  .catch(err => {
    console.error('\n❌ Cleanup failed:', err)
    process.exit(1)
  })
