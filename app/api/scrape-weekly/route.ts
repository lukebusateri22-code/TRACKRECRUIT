import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SCRAPER_URL = process.env.SCRAPER_URL || 'http://localhost:5001'

// GET - Run weekly scraper for all active conferences
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all conferences that need scraping
    const { data: conferences, error } = await supabase
      .from('tffrs_conference_watchlist')
      .select('*')
      .eq('active', true)
      .lte('next_scrape_at', new Date().toISOString())

    if (error) {
      console.error('Error fetching watchlist:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!conferences || conferences.length === 0) {
      return NextResponse.json({ 
        message: 'No conferences need scraping at this time',
        scraped: 0 
      })
    }

    const results = []

    // Scrape each conference
    for (const conf of conferences) {
      try {
        console.log(`🔄 Scraping ${conf.conference_name}...`)

        // Call the scraper
        const response = await fetch(`${SCRAPER_URL}/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: conf.url })
        })

        const scrapedData = await response.json()

        if (scrapedData.success) {
          // Save to database via tffrs-proxy logic
          await saveToDatabase(conf.url, scrapedData, conf.conference_name)

          // Update watchlist - set next scrape time
          await supabase
            .from('tffrs_conference_watchlist')
            .update({
              last_scraped_at: new Date().toISOString(),
              next_scrape_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
            })
            .eq('id', conf.id)

          results.push({
            conference: conf.conference_name,
            status: 'success',
            url: conf.url
          })

          console.log(`✅ Successfully scraped ${conf.conference_name}`)
        } else {
          results.push({
            conference: conf.conference_name,
            status: 'failed',
            error: scrapedData.error || 'Unknown error'
          })
          console.error(`❌ Failed to scrape ${conf.conference_name}`)
        }
      } catch (err: any) {
        results.push({
          conference: conf.conference_name,
          status: 'error',
          error: err.message
        })
        console.error(`❌ Error scraping ${conf.conference_name}:`, err)
      }
    }

    return NextResponse.json({
      message: 'Weekly scraping completed',
      total: conferences.length,
      results
    })
  } catch (error: any) {
    console.error('Error in weekly scraper:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper function to save scraped data to database
async function saveToDatabase(url: string, rawData: any, conferenceName: string) {
  try {
    // Transform data to match expected structure
    const transformedData = {
      conference_name: conferenceName,
      men: rawData.men || [],
      women: rawData.women || [],
      event_breakdown: rawData.event_breakdown || {}
    }

    // Save conference
    const { data: conference, error: confError } = await supabase
      .from('tffrs_conferences')
      .upsert({
        url,
        conference_name: conferenceName,
        data: rawData,
        scraped_at: new Date().toISOString()
      }, {
        onConflict: 'url'
      })
      .select()
      .single()

    if (confError) {
      console.error('Error saving conference:', confError)
      return
    }

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
          console.error(`Error saving team ${ranking.team}:`, teamError)
          continue
        }

        // Save performances
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

    console.log(`✅ Saved ${conferenceName} to database`)
  } catch (error) {
    console.error('Error in saveToDatabase:', error)
    throw error
  }
}
