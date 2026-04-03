import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface TeamRanking {
  rank: number
  team: string
  total_points: number
  url: string
}

interface ConferenceData {
  men: TeamRanking[]
  women: TeamRanking[]
  conference_name: string
  last_updated: string
  event_breakdown?: any
  summary?: any
  categories?: string[]
}

async function saveToDatabase(url: string, rawData: any, transformedData: ConferenceData) {
  try {
    console.log('💾 Saving data to database...')
    
    // Save or update conference
    const { data: conference, error: confError } = await supabase
      .from('tffrs_conferences')
      .upsert({
        url,
        conference_name: transformedData.conference_name,
        data: rawData,
        scraped_at: new Date().toISOString()
      }, {
        onConflict: 'url'
      })
      .select()
      .single()

    if (confError) {
      console.error('❌ Error saving conference:', confError)
      return
    }

    console.log('✅ Conference saved:', conference.id)

    // Save teams and performances
    const eventBreakdown = rawData.event_breakdown || {}
    
    for (const gender of ['Men', 'Women']) {
      const genderData = eventBreakdown[gender] || {}
      const rankings = gender === 'Men' ? transformedData.men : transformedData.women
      
      for (const ranking of rankings) {
        // Save team
        const { data: team, error: teamError } = await supabase
          .from('tffrs_teams')
          .upsert({
            conference_id: conference.id,
            team_name: ranking.team,
            gender,
            total_points: ranking.total_points,
            rank: ranking.rank
          }, {
            onConflict: 'conference_id,team_name,gender'
          })
          .select()
          .single()

        if (teamError) {
          console.error(`❌ Error saving team ${ranking.team}:`, teamError)
          continue
        }

        // Save performances for this team
        const teamEvents = genderData[ranking.team] || {}
        
        for (const [category, performances] of Object.entries(teamEvents)) {
          for (const perf of performances as any[]) {
            await supabase
              .from('tffrs_performances')
              .upsert({
                team_id: team.id,
                athlete_name: perf.athlete,
                event_name: perf.event,
                event_category: category,
                mark: perf.mark,
                rank: perf.rank,
                points: perf.points,
                year: perf.year || null,
                meet: perf.meet || null,
                date: perf.date || null
              })
          }
        }
      }
    }

    console.log('✅ All data saved to database!')
  } catch (error) {
    console.error('❌ Error saving to database:', error)
  }
}

function transformTFFRSData(rawData: any): ConferenceData {
  console.log('🔍 Using new scraper data structure')
  
  // The new scraper already provides rankings in the correct format
  const rankings = rawData.rankings || {}
  const menRankings = rankings.Men || []
  const womenRankings = rankings.Women || []
  
  // Extract conference name from URL or use default
  const conferenceName = 'Conference Championship'
  
  return {
    men: menRankings.map((team: any, index: number) => ({
      rank: index + 1,
      team: team.team,
      total_points: team.total,
      url: `https://www.tfrrs.org`
    })),
    women: womenRankings.map((team: any, index: number) => ({
      rank: index + 1,
      team: team.team,
      total_points: team.total,
      url: `https://www.tfrrs.org`
    })),
    conference_name: conferenceName,
    last_updated: new Date().toISOString(),
    // Include additional data for team detail pages
    event_breakdown: rawData.event_breakdown || {},
    summary: rawData.summary || {},
    categories: rawData.categories || []
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 TFFRS Proxy API called!')
    
    const body = await request.json()
    console.log('📨 Request body:', body)
    
    const { url, endpoint, data } = body
    
    // Handle different endpoints
    const scraperUrl = process.env.SCRAPER_URL || 'http://localhost:8080'
    let flaskUrl = `${scraperUrl}/analyze`
    let requestData = { url }
    
    if (endpoint === '/graduation_analysis') {
      flaskUrl = `${scraperUrl}/graduation_analysis`
      requestData = data || { url }
    }
    
    if (!url && !data?.url) {
      console.log('❌ No URL provided')
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log('🚀 Forwarding to Flask:', flaskUrl)
    
    const response = await fetch(flaskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    console.log('📥 Flask response status:', response.status)
    
    const responseData = await response.json()
    console.log('📊 Flask response data:', responseData)

    if (!response.ok) {
      console.log('❌ Flask returned error:', response.status)
      return NextResponse.json(
        responseData,
        { status: response.status }
      )
    }

    // Handle different response types
    if (endpoint === '/graduation_analysis') {
      // Return graduation analysis data directly
      console.log('✅ Graduation analysis successful!')
      return NextResponse.json(responseData)
    }
    
    // Save the exact raw scraper data
    if (responseData.success) {
      console.log('� Saving raw TFFRS data to database...')
      console.log('📊 Raw data sample:', { 
        menCount: responseData.men?.length || 0, 
        womenCount: responseData.women?.length || 0,
        conference: responseData.conference_name
      })
      
      // Save raw data to database
      try {
        const { data: savedConference, error: saveError } = await supabase
          .from('tffrs_conferences')
          .upsert({
            url,
            conference_name: responseData.conference_name || 'Unknown Conference',
            data: responseData, // Save the exact raw response
            scraped_at: new Date().toISOString()
          }, {
            onConflict: 'url'
          })
          .select()
          .single()

        if (saveError) {
          console.error('❌ Save failed:', saveError)
        } else {
          console.log('✅ Conference saved successfully:', savedConference.id)
        }
      } catch (err) {
        console.error('❌ Database save error:', err)
      }
      
      return NextResponse.json(responseData)
    }

    console.log('❌ Data transformation failed - missing success')
    return NextResponse.json({ error: 'Invalid response format from TFFRS scraper' }, { status: 500 })

  } catch (error: any) {
    console.error('❌ TFFRS proxy error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to proxy request to TFFRS scraper' },
      { status: 500 }
    )
  }
}
