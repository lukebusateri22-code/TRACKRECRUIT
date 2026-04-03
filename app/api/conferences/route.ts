import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch all saved conferences
export async function GET(request: NextRequest) {
  console.log('🔗 GET /api/conferences called')
  
  try {
    // Check environment variables first
    console.log('📋 Environment check:')
    console.log('  SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')
    console.log('  SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')
    
    // Test basic connection with a simple query
    console.log('🔍 Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('tffrs_conferences')
      .select('count')
      .limit(1)
      .single()
    
    if (testError) {
      console.error('❌ Database test failed:', testError)
      return NextResponse.json({ 
        error: `Database connection failed: ${testError.message}`,
        code: testError.code,
        details: testError
      }, { status: 500 })
    }
    
    console.log('✅ Database connection successful')
    
    // Now fetch the actual conferences
    console.log('📊 Fetching conferences...')
    const { data: conferences, error } = await supabase
      .from('tffrs_conferences')
      .select('id, url, conference_name, season, scraped_at')
      .order('scraped_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching conferences:', error)
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        details: error
      }, { status: 500 })
    }

    console.log(`✅ Successfully fetched ${conferences?.length || 0} conferences`)
    return NextResponse.json({ conferences: conferences || [] })
    
  } catch (error: any) {
    console.error('💥 Unexpected error in GET /api/conferences:', error)
    return NextResponse.json({ 
      error: `Unexpected error: ${error.message}`,
      stack: error.stack
    }, { status: 500 })
  }
}

// POST - Add conference to watchlist for auto-scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, conference_name } = body

    if (!url || !conference_name) {
      return NextResponse.json(
        { error: 'URL and conference name are required' },
        { status: 400 }
      )
    }

    // Add to watchlist
    const { data, error } = await supabase
      .from('tffrs_conference_watchlist')
      .upsert({
        url,
        conference_name,
        auto_scrape: true,
        next_scrape_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }, {
        onConflict: 'url'
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding to watchlist:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in POST /api/conferences:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
