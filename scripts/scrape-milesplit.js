#!/usr/bin/env node
/**
 * MileSplit Profile Scraper
 * Scrapes athlete PRs from MileSplit profile URLs
 * Usage: node scripts/scrape-milesplit.js <profile_url>
 */

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
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
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Fetch HTML content from URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

/**
 * Parse MileSplit profile HTML to extract PRs
 * This is a simplified parser - in production, you'd want more robust parsing
 */
function parseMileSplitProfile(html) {
  const prs = []
  
  // Simple regex-based parsing (in production, use a proper HTML parser like cheerio)
  // This is a placeholder - actual implementation would need to match MileSplit's HTML structure
  
  // Example patterns to look for:
  // - Event names: 100m, 200m, 400m, 800m, 1600m, 3200m, etc.
  // - Times/marks: 10.5s, 48.2s, 1:52.3, 4:15.2, etc.
  
  const eventPatterns = [
    { event: '100m', regex: /100m.*?(\d+\.\d+)s/i },
    { event: '200m', regex: /200m.*?(\d+\.\d+)s/i },
    { event: '400m', regex: /400m.*?(\d+\.\d+)s/i },
    { event: '800m', regex: /800m.*?(\d+:\d+\.\d+)/i },
    { event: '1600m', regex: /1600m.*?(\d+:\d+\.\d+)/i },
    { event: 'Mile', regex: /Mile.*?(\d+:\d+\.\d+)/i },
    { event: '3200m', regex: /3200m.*?(\d+:\d+\.\d+)/i },
    { event: '110mH', regex: /110.*?H.*?(\d+\.\d+)s/i },
    { event: '400mH', regex: /400.*?H.*?(\d+\.\d+)s/i },
    { event: 'Long Jump', regex: /Long Jump.*?(\d+['\-]\d+)/i },
    { event: 'Triple Jump', regex: /Triple Jump.*?(\d+['\-]\d+)/i },
    { event: 'High Jump', regex: /High Jump.*?(\d+['\-]\d+)/i },
    { event: 'Pole Vault', regex: /Pole Vault.*?(\d+['\-]\d+)/i },
    { event: 'Shot Put', regex: /Shot Put.*?(\d+['\-]\d+)/i },
    { event: 'Discus', regex: /Discus.*?(\d+['\-]\d+)/i }
  ]
  
  eventPatterns.forEach(({ event, regex }) => {
    const match = html.match(regex)
    if (match) {
      prs.push({
        event,
        performance: match[1],
        verified: true,
        source: 'milesplit'
      })
    }
  })
  
  return prs
}

/**
 * Scrape athlete profile from MileSplit
 */
async function scrapeMileSplitProfile(profileUrl) {
  console.log(`\n🔍 Scraping MileSplit profile: ${profileUrl}`)
  
  try {
    const html = await fetchHTML(profileUrl)
    const prs = parseMileSplitProfile(html)
    
    console.log(`✅ Found ${prs.length} PRs`)
    prs.forEach(pr => {
      console.log(`   • ${pr.event}: ${pr.performance}`)
    })
    
    return prs
  } catch (error) {
    console.error(`❌ Error scraping profile:`, error.message)
    return null
  }
}

/**
 * Update athlete profile with verified PRs
 */
async function updateAthleteProfile(athleteId, prs) {
  try {
    const { error } = await supabase
      .from('athlete_profiles')
      .update({
        has_verified_prs: true,
        can_message_coaches: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', athleteId)
    
    if (error) throw error
    
    // Store PRs in a separate table or JSONB field
    // This is a placeholder - you'd need to create a PRs table
    console.log(`✅ Updated athlete profile ${athleteId}`)
    
    return true
  } catch (error) {
    console.error(`❌ Error updating profile:`, error.message)
    return false
  }
}

/**
 * Process all athletes with MileSplit links that need verification
 */
async function processUnverifiedAthletes() {
  console.log('🔍 Finding athletes with unverified MileSplit profiles...\n')
  
  try {
    const { data: athletes, error } = await supabase
      .from('athlete_profiles')
      .select('id, profile_id, milesplit_link, has_verified_prs')
      .not('milesplit_link', 'is', null)
      .eq('has_verified_prs', false)
    
    if (error) throw error
    
    if (!athletes || athletes.length === 0) {
      console.log('ℹ️  No athletes need verification')
      return
    }
    
    console.log(`📋 Found ${athletes.length} athletes to verify\n`)
    
    for (const athlete of athletes) {
      console.log(`\n👤 Processing athlete ID: ${athlete.id}`)
      const prs = await scrapeMileSplitProfile(athlete.milesplit_link)
      
      if (prs && prs.length > 0) {
        await updateAthleteProfile(athlete.id, prs)
      } else {
        console.log(`⚠️  No PRs found for athlete ${athlete.id}`)
      }
      
      // Rate limiting - wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    console.log('\n✅ Verification complete!')
  } catch (error) {
    console.error('❌ Error processing athletes:', error.message)
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length > 0) {
    // Single profile mode
    const profileUrl = args[0]
    const prs = await scrapeMileSplitProfile(profileUrl)
    
    if (prs) {
      console.log('\n📊 Scraped PRs:')
      console.log(JSON.stringify(prs, null, 2))
    }
  } else {
    // Batch mode - process all unverified athletes
    await processUnverifiedAthletes()
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('\n❌ Fatal error:', err)
      process.exit(1)
    })
}

module.exports = { scrapeMileSplitProfile, parseMileSplitProfile }
