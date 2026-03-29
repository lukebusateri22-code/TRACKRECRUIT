// MileSplit Profile Scraper
// Scrapes athlete data from their public MileSplit profile

interface ScrapedPR {
  event: string
  performance: string
  date: string
  meetName?: string
  location?: string
  season?: string
}

interface ScrapedMeetResult {
  meetName: string
  date: string
  location: string
  event: string
  performance: string
  place?: string
  isPR: boolean
}

export async function scrapeMileSplitProfile(profileUrl: string) {
  try {
    // Fetch the profile page
    const response = await fetch(profileUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch MileSplit profile')
    }

    const html = await response.text()
    
    // Parse PRs and meet results
    const prs = parsePRs(html)
    const meetResults = parseMeetResults(html)
    const athleteInfo = parseAthleteInfo(html)

    return {
      success: true,
      athleteInfo,
      prs,
      meetResults
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

function parseAthleteInfo(html: string) {
  // Extract athlete name, school, grad year, location from MileSplit HTML
  
  // Try multiple patterns for name
  let name = ''
  const namePatterns = [
    /<h1[^>]*class="[^"]*athlete[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<title>([^-|]+)/i
  ]
  for (const pattern of namePatterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      name = match[1].trim()
      break
    }
  }
  
  // School name - look for common patterns
  let school = ''
  const schoolPatterns = [
    /<a[^>]*href="[^"]*\/schools\/[^"]*"[^>]*>([^<]+)<\/a>/i,
    /School:\s*<[^>]*>([^<]+)<\//i,
    /<span[^>]*class="[^"]*school[^"]*"[^>]*>([^<]+)<\/span>/i
  ]
  for (const pattern of schoolPatterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      school = match[1].trim()
      break
    }
  }
  
  // Graduation year
  const gradYearMatch = html.match(/Class of (\d{4})|Grad(?:uation)?\s+Year:\s*(\d{4})|'(\d{2})\b/i)
  const graduationYear = gradYearMatch?.[1] || gradYearMatch?.[2] || (gradYearMatch?.[3] ? '20' + gradYearMatch[3] : '')
  
  // Location (city, state)
  let location = ''
  let state = ''
  const locationMatch = html.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/i)
  if (locationMatch) {
    location = locationMatch[1].trim()
    state = locationMatch[2].toUpperCase()
  }
  
  return {
    name,
    school,
    graduationYear,
    location,
    state
  }
}

function parsePRs(html: string): ScrapedPR[] {
  const prs: ScrapedPR[] = []
  
  // MileSplit has Rankings tables (e.g., "2024 Outdoor Rankings")
  // Format: Event name in first column, time/mark in second column
  
  // Look for Rankings sections
  const rankingsMatches = html.matchAll(/(?:20\d{2}\s+(?:Outdoor|Indoor)\s+Rankings|Personal\s+Records?|Best\s+Performances?)[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/gi)
  
  for (const rankingsMatch of rankingsMatches) {
    const tableContent = rankingsMatch[1]
    const rowMatches = Array.from(tableContent.matchAll(/<tr[^>]*>(.*?)<\/tr>/gi))
    
    for (const rowMatch of rowMatches) {
      const row = (rowMatch as RegExpMatchArray)[1]
      
      // Skip header rows
      if (row.includes('<th') || row.includes('TN') || row.includes('National')) {
        continue
      }
      
      const cells = Array.from(row.matchAll(/<td[^>]*>(.*?)<\/td>/gi))
      
      if (cells.length >= 2) {
        const eventRaw = (cells[0][1] || '').replace(/<[^>]*>/g, '').trim()
        const performanceRaw = (cells[1][1] || '').replace(/<[^>]*>/g, '').trim()
        
        // Clean up event name and performance
        const event = eventRaw.replace(/\s+/g, ' ')
        const performance = performanceRaw.replace(/\s+/g, ' ')
        
        // Only add if we have both event and performance
        if (event && performance && event.length < 50 && performance.length < 50) {
          prs.push({
            event,
            performance,
            date: '', // MileSplit Rankings don't always show dates
            season: rankingsMatch[0].includes('Outdoor') ? 'Outdoor' : 'Indoor'
          })
        }
      }
    }
  }
  
  return prs
}

function parseMeetResults(html: string): ScrapedMeetResult[] {
  const results: ScrapedMeetResult[] = []
  
  // Similar approach for meet results table
  const resultsTableMatch = html.match(/<table[^>]*class="[^"]*results-table[^"]*"[^>]*>(.*?)<\/table>/is)
  
  if (resultsTableMatch) {
    const tableContent = resultsTableMatch[1]
    const rowMatches = Array.from(tableContent.matchAll(/<tr[^>]*>(.*?)<\/tr>/gi))
    
    for (const rowMatch of rowMatches) {
      const row = (rowMatch as RegExpMatchArray)[1]
      const cells = Array.from(row.matchAll(/<td[^>]*>(.*?)<\/td>/gi))
      
      if (cells.length >= 4) {
        const meetName = (cells[0][1] || '').replace(/<[^>]*>/g, '').trim()
        const date = (cells[1][1] || '').replace(/<[^>]*>/g, '').trim()
        const event = (cells[2][1] || '').replace(/<[^>]*>/g, '').trim()
        const performance = (cells[3][1] || '').replace(/<[^>]*>/g, '').trim()
        const place = (cells[4]?.[1] || '').replace(/<[^>]*>/g, '').trim()
        const isPR = row.includes('PR') || row.includes('personal-record')
        
        if (meetName && event && performance) {
          results.push({
            meetName,
            date,
            location: '', // May need separate parsing
            event,
            performance,
            place,
            isPR
          })
        }
      }
    }
  }
  
  return results
}

// Athletic.net scraper (similar approach)
export async function scrapeAthleticNetProfile(profileUrl: string) {
  try {
    const response = await fetch(profileUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch Athletic.net profile')
    }

    const html = await response.text()
    
    // Athletic.net has different HTML structure
    // Will need custom parsing logic
    
    return {
      success: true,
      athleteInfo: parseAthleticNetInfo(html),
      prs: parseAthleticNetPRs(html),
      meetResults: parseAthleticNetResults(html)
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

function parseAthleticNetInfo(html: string) {
  // Parse Athletic.net specific HTML structure
  return {
    name: '',
    school: '',
    graduationYear: ''
  }
}

function parseAthleticNetPRs(html: string): ScrapedPR[] {
  // Parse Athletic.net PRs table
  return []
}

function parseAthleticNetResults(html: string): ScrapedMeetResult[] {
  // Parse Athletic.net meet results
  return []
}
