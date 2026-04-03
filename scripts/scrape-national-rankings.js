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
    
    // Fetch the page HTML with proper headers
    const html = await new Promise((resolve, reject) => {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }
      
      https.get(url, options, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => resolve(data))
      }).on('error', reject)
    })
    
    console.log(`   📄 Downloaded ${html.length} bytes of HTML`)
    
    const rankings = []
    
    // Strategy 1: Look for table rows with ranking data
    // Pattern: <tr><td>1</td><td>Team Name</td><td>Points</td></tr>
    const tableRowPattern = /<tr[^>]*>[\s\S]*?<td[^>]*>(\d+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([\d.]+)<\/td>[\s\S]*?<\/tr>/gi
    let match
    
    while ((match = tableRowPattern.exec(html)) !== null) {
      const rank = parseInt(match[1])
      const team = match[2].trim().replace(/&amp;/g, '&')
      const points = parseFloat(match[3])
      
      if (rank && team && !isNaN(points)) {
        rankings.push({ rank, team, points })
      }
    }
    
    // Strategy 2: Look for div-based rankings
    if (rankings.length === 0) {
      console.log(`   🔄 Trying alternative parsing strategy...`)
      const divPattern = /<div[^>]*class="[^"]*rank[^"]*"[^>]*>[\s\S]*?(\d+)[\s\S]*?<\/div>[\s\S]*?<div[^>]*>([^<]+)<\/div>[\s\S]*?<div[^>]*>([\d.]+)<\/div>/gi
      
      while ((match = divPattern.exec(html)) !== null) {
        const rank = parseInt(match[1])
        const team = match[2].trim().replace(/&amp;/g, '&')
        const points = parseFloat(match[3])
        
        if (rank && team && !isNaN(points)) {
          rankings.push({ rank, team, points })
        }
      }
    }
    
    // Strategy 3: Look for list items
    if (rankings.length === 0) {
      console.log(`   🔄 Trying list-based parsing...`)
      const listPattern = /<li[^>]*>[\s\S]*?(\d+)[\s.]+([A-Za-z\s&\-']+?)[\s\-–]+?([\d.]+)/gi
      
      while ((match = listPattern.exec(html)) !== null) {
        const rank = parseInt(match[1])
        const team = match[2].trim().replace(/&amp;/g, '&')
        const points = parseFloat(match[3])
        
        if (rank && team && !isNaN(points)) {
          rankings.push({ rank, team, points })
        }
      }
    }
    
    // Strategy 4: Look for any pattern with rank, team name, and points
    if (rankings.length === 0) {
      console.log(`   🔄 Trying generic pattern matching...`)
      // Match patterns like: "1 University Name 123.45" or "1. University Name - 123.45"
      const genericPattern = /(?:^|\n|\r|>)\s*(\d+)[\s.)\-–]+([A-Z][A-Za-z\s&\-']+?)\s+[\-–]?\s*([\d.]+)(?:\s|<|$)/gm
      
      while ((match = genericPattern.exec(html)) !== null) {
        const rank = parseInt(match[1])
        const team = match[2].trim().replace(/&amp;/g, '&').replace(/\s+/g, ' ')
        const points = parseFloat(match[3])
        
        // Filter out obvious false positives
        if (rank && rank <= 100 && team && team.length > 3 && !isNaN(points) && points > 0) {
          rankings.push({ rank, team, points })
        }
      }
    }
    
    // Strategy 5: Extract from JSON-LD or script tags
    if (rankings.length === 0) {
      console.log(`   🔄 Looking for embedded JSON data...`)
      const jsonPattern = /<script[^>]*type="application\/(?:ld\+)?json"[^>]*>([\s\S]*?)<\/script>/gi
      
      while ((match = jsonPattern.exec(html)) !== null) {
        try {
          const jsonData = JSON.parse(match[1])
          // Look for ranking data in JSON structure
          if (jsonData.rankings || jsonData.teams || jsonData.data) {
            const data = jsonData.rankings || jsonData.teams || jsonData.data
            if (Array.isArray(data)) {
              data.forEach((item, idx) => {
                if (item.rank && item.team) {
                  rankings.push({
                    rank: parseInt(item.rank),
                    team: item.team,
                    points: item.points || item.score || null
                  })
                }
              })
            }
          }
        } catch (e) {
          // Not valid JSON or doesn't contain rankings
        }
      }
    }
    
    // Remove duplicates and sort by rank
    const uniqueRankings = Array.from(
      new Map(rankings.map(r => [r.rank, r])).values()
    ).sort((a, b) => a.rank - b.rank)
    
    const result = {
      gender,
      url,
      scraped_at: new Date().toISOString(),
      rankings: uniqueRankings.slice(0, 50), // Get top 50 teams
      last_updated: new Date().toISOString()
    }
    
    console.log(`✅ Scraped ${uniqueRankings.length} teams`)
    if (uniqueRankings.length > 0) {
      console.log(`   Top 5: ${uniqueRankings.slice(0, 5).map(r => `${r.rank}. ${r.team} (${r.points})`).join(', ')}`)
    } else {
      console.log(`⚠️  No rankings found - trying to save HTML for debugging...`)
      // Save a sample of the HTML for debugging
      const fs = require('fs')
      const samplePath = `/tmp/ustfccca-${gender}-sample.html`
      fs.writeFileSync(samplePath, html.substring(0, 50000))
      console.log(`   📝 Saved HTML sample to: ${samplePath}`)
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
