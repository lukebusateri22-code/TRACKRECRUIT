'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Trophy, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function ConferenceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conferenceId = params.id as string
  
  const [conference, setConference] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (conferenceId) {
      loadConference()
    }
  }, [conferenceId])

  const loadConference = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('tffrs_conferences')
        .select('*')
        .eq('id', conferenceId)
        .single()

      if (error) throw error
      
      console.log('🔍 Raw conference data:', data)
      setConference(data)
    } catch (err: any) {
      console.error('Error loading conference:', err)
      setError(err.message || 'Failed to load conference')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 font-bold">Loading conference data...</p>
        </div>
      </div>
    )
  }

  if (error || !conference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl">
          <p className="text-gray-900 font-bold mb-4">Error: {error}</p>
          <Link href="/coaches/conference-list" className="text-blue-600 hover:text-blue-800">
            ← Back to Conferences
          </Link>
        </div>
      </div>
    )
  }

  const scrapedData = conference.data
  const men = scrapedData.men || []
  const women = scrapedData.women || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/coaches/conference-list"
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  {scrapedData.conference_name || conference.conference_name}
                </h1>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Scraped: {new Date(conference.scraped_at).toLocaleDateString()}
                  </div>
                  <a
                    href={conference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Source
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{men.length}</p>
                <p className="text-sm text-gray-600">Men's Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-pink-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{women.length}</p>
                <p className="text-sm text-gray-600">Women's Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-trackrecruit-yellow mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{men.length + women.length}</p>
                <p className="text-sm text-gray-600">Total Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {scrapedData.summary?.total_athletes || 0}
                </p>
                <p className="text-sm text-gray-600">Total Athletes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Raw Data Display */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Scraped Data</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              {JSON.stringify(scrapedData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
