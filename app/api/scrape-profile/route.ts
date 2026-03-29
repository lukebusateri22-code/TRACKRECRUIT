import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side scraping API route
export async function POST(request: NextRequest) {
  try {
    const { profileUrl, athleteProfileId, userId, skipDatabaseSave } = await request.json()

    if (!profileUrl) {
      return NextResponse.json(
        { error: 'Missing profileUrl' },
        { status: 400 }
      )
    }

    // Determine which site to scrape
    const isMileSplit = profileUrl.includes('milesplit.com')
    const isAthleticNet = profileUrl.includes('athletic.net')

    if (!isMileSplit && !isAthleticNet) {
      return NextResponse.json(
        { error: 'URL must be from MileSplit or Athletic.net' },
        { status: 400 }
      )
    }

    // Fetch the profile page
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    const html = await response.text()

    // Parse data based on site
    const scrapedData = isMileSplit 
      ? parseMileSplitProfile(html)
      : parseAthleticNetProfile(html)

    // Don't fail if no PRs found - still return athlete info
    console.log('Scraped data:', scrapedData)

    // If skipDatabaseSave is true, just return the scraped data without saving
    if (skipDatabaseSave) {
      return NextResponse.json({
        success: true,
        athleteInfo: scrapedData.athleteInfo,
        prs: scrapedData.prs || [],
        meetResults: scrapedData.meetResults || []
      })
    }

    // Initialize Supabase with service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Insert PRs into database
    let importedPRs = 0
    let importedResults = 0

    for (const pr of scrapedData.prs) {
      const { error } = await supabase
        .from('personal_records')
        .insert({
          athlete_profile_id: athleteProfileId,
          event: pr.event,
          performance: pr.performance,
          date: pr.date || new Date().toISOString().split('T')[0],
          meet_name: pr.meetName || 'Imported from MileSplit',
          location: pr.location || 'Unknown',
          is_personal_best: true,
          verification_status: 'verified',
          source_url: profileUrl
        })

      if (!error) importedPRs++
    }

    // Insert meet results
    for (const result of scrapedData.meetResults || []) {
      const { error } = await supabase
        .from('meet_results')
        .insert({
          athlete_profile_id: athleteProfileId,
          meet_name: result.meetName,
          meet_date: result.date || new Date().toISOString().split('T')[0],
          location: result.location || 'Unknown',
          event: result.event,
          performance: result.performance,
          place: result.place || '',
          points: 0,
          is_pr: result.isPR || false
        })

      if (!error) importedResults++
    }

    return NextResponse.json({
      success: true,
      imported: {
        prs: importedPRs,
        meetResults: importedResults
      },
      athleteInfo: scrapedData.athleteInfo,
      prs: scrapedData.prs || [] // Return PRs array for frontend display
    })

  } catch (error: any) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to scrape profile' },
      { status: 500 }
    )
  }
}

function parseMileSplitProfile(html: string) {
  const prs: any[] = []
  const meetResults: any[] = []

  // Extract athlete info - try multiple patterns
  let name = '', school = '', graduationYear = '', location = '', state = ''
  
  // School - try multiple patterns
  // Pattern 1: current-school class (most common on MileSplit)
  let schoolMatch = html.match(/<span[^>]*class="current-school"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i)
  if (schoolMatch) {
    school = schoolMatch[1].trim()
    // Add "High School" if not present
    if (!school.toLowerCase().includes('high school') && !school.toLowerCase().includes('academy') && !school.toLowerCase().includes('prep')) {
      school += ' High School'
    }
  }
  
  // Pattern 2: Links to /teams/ (MileSplit uses teams not schools)
  if (!school) {
    schoolMatch = html.match(/<a[^>]*href="[^"]*\/teams\/[^"]*"[^>]*>([^<]+)<\/a>/i)
    if (schoolMatch) {
      school = schoolMatch[1].trim()
      if (!school.toLowerCase().includes('high school') && !school.toLowerCase().includes('academy') && !school.toLowerCase().includes('prep')) {
        school += ' High School'
      }
    }
  }
  
  // Pattern 3: School name before "Class of"
  if (!school) {
    schoolMatch = html.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[•·]\s*Class of/i)
    if (schoolMatch) {
      school = schoolMatch[1].trim() + ' High School'
    }
  }
  
  // Clean up school name - remove any HTML artifacts
  if (school) {
    school = school.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    // Validate - should not contain HTML tags or be too short
    if (school.includes('<') || school.includes('>') || school.length < 3) {
      school = ''
    }
  }
  
  // Grad year - look for "Class of YYYY" or just year patterns
  const gradPatterns = [
    /Class of (\d{4})/i,
    /Graduation Year[:\s]+(\d{4})/i,
    /'(\d{2})\b/,
    /\b(20\d{2})\b/
  ]
  
  for (const pattern of gradPatterns) {
    const match = html.match(pattern)
    if (match) {
      graduationYear = match[1].length === 2 ? '20' + match[1] : match[1]
      break
    }
  }
  
  // Location - look for City, ST pattern (common in athlete profiles)
  // Try multiple patterns for city/state
  const locPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/,
    /<span[^>]*class="[^"]*location[^"]*"[^>]*>([^,]+),\s*([A-Z]{2})<\/span>/i,
    /Location[:\s]+([^,]+),\s*([A-Z]{2})/i
  ]
  
  for (const pattern of locPatterns) {
    const match = html.match(pattern)
    if (match && match[1] && match[2]) {
      location = match[1].trim()
      state = match[2].trim().toUpperCase()
      // Validate state is actually a 2-letter code
      if (state.length === 2 && /^[A-Z]{2}$/.test(state)) {
        break
      }
    }
  }
  
  // Find ALL tables in the HTML and look for event/performance patterns
  const allTables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi)
  
  if (allTables) {
    for (const table of allTables) {
      // Extract all table rows
      const rows = table.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)
      
      if (rows) {
        for (const row of rows) {
          // Skip header rows
          if (row.includes('<th')) continue
          
          // Extract td elements
          const cells = row.match(/<td[^>]*>(.*?)<\/td>/gi)
          
          if (cells && cells.length >= 2) {
            // First td is event, second td is performance
            const eventText = cells[0].replace(/<[^>]*>/g, '').trim()
            const perfText = cells[1].replace(/<[^>]*>/g, '').trim()
            
            // Check if this looks like valid track event and performance
            // Event should be short (< 20 chars) and perf should have numbers
            if (eventText && perfText && eventText.length < 20 && /[\d.:]+/.test(perfText)) {
              // Common track events: 100m, 200m, 400m, 800m, 1500m, 110H, etc.
              const isTrackEvent = /^(100|110|200|400|800|1500|3000|5000|10000|110H|400H|HJ|LJ|TJ|PV|SP|DT|JT|S|Hammer)/i.test(eventText)
              
              if (isTrackEvent || eventText.includes('m') || eventText.includes('H')) {
                prs.push({
                  event: eventText,
                  performance: perfText,
                  date: new Date().toISOString().split('T')[0],
                  meetName: 'Imported from MileSplit',
                  location: location || 'Unknown'
                })
              }
            }
          }
        }
      }
    }
  }

  // Remove duplicates - keep first occurrence
  const uniquePRs: any[] = []
  const seenEvents = new Set()
  
  for (const pr of prs) {
    if (!seenEvents.has(pr.event)) {
      uniquePRs.push(pr)
      seenEvents.add(pr.event)
    }
  }

  return {
    athleteInfo: {
      name,
      school,
      graduationYear,
      location,
      state
    },
    prs: uniquePRs,
    meetResults
  }
}

function parseAthleticNetProfile(html: string) {
  // Similar parsing for Athletic.net
  // Their HTML structure is different
  
  return {
    athleteInfo: { name: '', school: '' },
    prs: [],
    meetResults: []
  }
}
