'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Users, Trophy, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

interface Conference {
  id: string
  url: string
  conference_name: string
  scraped_at: string
  data: any
}

export default function ConferenceAnalyticsPage() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null)

  useEffect(() => {
    loadConferences()
  }, [])

  const loadConferences = async () => {
    try {
      console.log('🔍 Loading conferences for analytics...')
      console.log('📋 Environment check:')
      console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')
      console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tffrs_conferences')
        .select('id, url, conference_name, scraped_at, data')
        .order('conference_name', { ascending: true })

      console.log('📊 Query result:', { data, error })
      console.log('📊 Data length:', data?.length || 0)

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }
      
      console.log('✅ Conferences loaded:', data?.length || 0)
      setConferences(data || [])
    } catch (err: any) {
      console.error('💥 Load conferences error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredConferences = conferences.filter(conf =>
    conf.conference_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 font-bold">Loading conference analytics...</p>
        </div>
      </div>
    )
  }

  if (selectedConference) {
    const scrapedData = selectedConference.data
    const men = scrapedData.rankings?.Men || []
    const women = scrapedData.rankings?.Women || []

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <button
                onClick={() => setSelectedConference(null)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  {scrapedData.conference_name || selectedConference.conference_name}
                </h1>
                <p className="text-gray-700 mt-1">Conference Analytics</p>
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
                <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {scrapedData.summary?.total_athletes || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Athletes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Teams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Men's Rankings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Men's Team Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Team</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-900">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {men.slice(0, 10).map((team: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            (team.rank || index + 1) === 1 ? 'bg-yellow-400 text-gray-900' :
                            (team.rank || index + 1) === 2 ? 'bg-gray-300 text-gray-900' :
                            (team.rank || index + 1) === 3 ? 'bg-orange-400 text-white' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {team.rank || index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          <Link 
                            href={`/coaches/conference-detail/${selectedConference.id}/team/Men/${encodeURIComponent(team.team || 'Unknown')}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {team.team || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-gray-900">{team.total || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {men.length > 10 && (
                  <div className="text-center py-3 text-gray-600 text-sm">
                    Showing top 10 of {men.length} teams
                  </div>
                )}
              </div>
            </div>

            {/* Women's Rankings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Women's Team Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Team</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-900">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {women.slice(0, 10).map((team: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            (team.rank || index + 1) === 1 ? 'bg-yellow-400 text-gray-900' :
                            (team.rank || index + 1) === 2 ? 'bg-gray-300 text-gray-900' :
                            (team.rank || index + 1) === 3 ? 'bg-orange-400 text-white' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {team.rank || index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          <Link 
                            href={`/coaches/conference-detail/${selectedConference.id}/team/Women/${encodeURIComponent(team.team || 'Unknown')}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {team.team || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-gray-900">{team.total || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {women.length > 10 && (
                  <div className="text-center py-3 text-gray-600 text-sm">
                    Showing top 10 of {women.length} teams
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conference Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Conference Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {scrapedData.summary?.total_athletes || 0}
                </div>
                <div className="text-gray-600">Total Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {scrapedData.summary?.total_events || 0}
                </div>
                <div className="text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {scrapedData.summary?.unique_teams || 0}
                </div>
                <div className="text-gray-600">Unique Teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Conference Analytics</h1>
              <p className="text-gray-700 mt-1">Analyze NCAA conference performance data</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/coaches/conference-list"
                className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                View All Conferences
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conferences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
              />
            </div>
            <div className="text-gray-600">
              {filteredConferences.length} conferences found
            </div>
          </div>
        </div>

        {/* Conference List */}
        {filteredConferences.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No conferences found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No conferences available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConferences.map((conference) => {
              const scrapedData = conference.data
              const menCount = scrapedData.rankings?.Men?.length || 0
              const womenCount = scrapedData.rankings?.Women?.length || 0
              
              return (
                <div
                  key={conference.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedConference(conference)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {conference.conference_name}
                    </h3>
                    <Trophy className="w-6 h-6 text-trackrecruit-yellow flex-shrink-0 ml-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{menCount}</div>
                      <div className="text-xs text-gray-600">Men</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-pink-600">{womenCount}</div>
                      <div className="text-xs text-gray-600">Women</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{menCount + womenCount}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Athletes:</span>
                      <span className="font-medium text-gray-900">
                        {scrapedData.summary?.total_athletes || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events:</span>
                      <span className="font-medium text-gray-900">
                        {scrapedData.summary?.total_events || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(conference.scraped_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition">
                    View Analytics
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
