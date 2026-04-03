#!/usr/bin/env node
/**
 * Scrape national college team rankings from USTFCCCA
 * Boys: https://web4.ustfccca.org/iz/tfri/collection/17387
 * Girls: https://web4.ustfccca.org/iz/tfri/collection/17388
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
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function scrapeRankings(url, gender) {
  console.log(`\n🔍 Scraping ${gender} rankings from ${url}...`)
  
  try {
    const https = require('https')
    
    // Fetch the page HTML
    const html = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => resolve(data))
      }).on('error', reject)
    })
    
    // Simple regex-based parsing for team rankings
    // This is a basic implementation - adjust regex patterns based on actual HTML structure
    const rankings = []
    
    // Look for ranking patterns like: "1. Team Name - Points"
    // Adjust these patterns based on the actual USTFCCCA website structure
    const rankingPattern = /(\d+)\.\s+([A-Za-z\s&]+?)(?:\s+[-–]\s+(\d+(?:\.\d+)?))?\s*(?:<|$)/g
    let match
    
    while ((match = rankingPattern.exec(html)) !== null) {
      rankings.push({
        rank: parseInt(match[1]),
        team: match[2].trim(),
        points: match[3] ? parseFloat(match[3]) : null
      })
    }
    
    const result = {
      gender,
      url,
      scraped_at: new Date().toISOString(),
      rankings: rankings.slice(0, 25), // Top 25 teams
      last_updated: new Date().toISOString()
    }
    
    console.log(`✅ Scraped ${rankings.length} teams`)
    if (rankings.length > 0) {
      console.log(`   Top 3: ${rankings.slice(0, 3).map(r => `${r.rank}. ${r.team}`).join(', ')}`)
    } else {
      console.log(`⚠️  No rankings found - HTML structure may have changed`)
      console.log(`   Consider updating the parsing logic or using a proper HTML parser`)
    }
    
    return result
  } catch (error) {
    console.error(`❌ Error scraping ${gender} rankings:`, error.message)
    return null
  }
}

async function saveRankings(rankings) {
  if (!rankings) return false
  
  try {
    // Check if rankings for this gender already exist
    const { data: existing } = await supabase
      .from('national_team_rankings')
      .select('id')
      .eq('gender', rankings.gender)
      .single()
    
    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('national_team_rankings')
        .update({
          url: rankings.url,
          rankings: rankings.rankings,
          scraped_at: rankings.scraped_at,
          last_updated: rankings.last_updated
        })
        .eq('id', existing.id)
      
      if (error) throw error
      console.log(`✅ Updated ${rankings.gender} rankings`)
    } else {
      // Insert new
      const { error } = await supabase
        .from('national_team_rankings')
        .insert([rankings])
      
      if (error) throw error
      console.log(`✅ Inserted ${rankings.gender} rankings`)
    }
    
    return true
  } catch (error) {
    console.error(`❌ Error saving ${rankings.gender} rankings:`, error.message)
    return false
  }
}

async function main() {
  console.log('🏃 National College Team Rankings Scraper')
  console.log('==========================================\n')
  
  // Scrape boys rankings
  const boysRankings = await scrapeRankings(
    'https://web4.ustfccca.org/iz/tfri/collection/17387',
    'Men'
  )
  
  if (boysRankings) {
    await saveRankings(boysRankings)
  }
  
  // Scrape girls rankings
  const girlsRankings = await scrapeRankings(
    'https://web4.ustfccca.org/iz/tfri/collection/17388',
    'Women'
  )
  
  if (girlsRankings) {
    await saveRankings(girlsRankings)
  }
  
  console.log('\n✅ Scraping complete!')
  console.log('\n📝 Next steps:')
  console.log('   1. Create the national_team_rankings table in Supabase')
  console.log('   2. Implement actual scraping logic with puppeteer')
  console.log('   3. Set up automated scraping (weekly/daily)')
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Fatal error:', err)
    process.exit(1)
  })
