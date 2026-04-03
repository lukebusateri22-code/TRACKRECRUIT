'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Users, Trophy } from 'lucide-react'

interface TeamRanking {
  rank: number
  team: string
  total_points: number
  url: string
}

interface ConferenceData {
  rankings?: {
    Men?: TeamRanking[]
    Women?: TeamRanking[]
  }
  conference_name?: string
  last_updated?: string
  event_breakdown?: any
  summary?: any
  categories?: string[]
  men?: TeamRanking[]  // Fallback for compatibility
  women?: TeamRanking[]  // Fallback for compatibility
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']

interface SavedConference {
  id: string
  url: string
  conference_name: string
  scraped_at: string
}

export default function TFFRSAnalytics() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [url, setUrl] = useState('https://www.tfrrs.org/lists/2288.html') // Pre-filled with Ohio Valley
  const [conferenceData, setConferenceData] = useState<ConferenceData | null>(null)
  const [savedConferences, setSavedConferences] = useState<SavedConference[]>([])
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    const savedUrl = sessionStorage.getItem('tffrs-current-url')
    if (savedUrl) {
      setUrl(savedUrl)
    }
    // Load saved conferences from database
    loadSavedConferences()
  }, [])

  const loadSavedConferences = async () => {
    try {
      const response = await fetch('/api/conferences')
      const data = await response.json()
      if (data.conferences) {
        setSavedConferences(data.conferences)
      }
    } catch (err) {
      console.error('Error loading saved conferences:', err)
    }
  }

  const analyzeConference = async () => {
    if (!url.trim()) {
      setError('Please enter a TFFRS URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tffrs-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setConferenceData(data)
      sessionStorage.setItem('tffrs-current-url', url.trim())
      sessionStorage.setItem('tffrs-conference-data', JSON.stringify(data))
    } catch (err: any) {
      setError(err.message || 'Failed to analyze conference. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-6">
            <Link href="/home" className="text-gray-900 font-semibold hover:text-gray-700">Home</Link>
            <Link href="/coaches/conferences" className="text-gray-900 font-semibold hover:text-gray-700">Conference Library</Link>
            <Link href="/coaches/tffrs-analytics" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">
              Conference Analytics
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Conference Analytics</h1>
              <p className="text-gray-700 mt-1">Analyze team performance and recruiting opportunities</p>
            </div>
            <Link
              href="/coaches/dashboard"
              className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saved Conferences Dropdown */}
        {savedConferences.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-trackrecruit-yellow" />
                Saved Conferences
              </h2>
              <Link
                href="/coaches/conferences"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedConferences.map((conf) => (
                <button
                  key={conf.id}
                  onClick={() => {
                    setUrl(conf.url)
                    analyzeConference()
                  }}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-trackrecruit-yellow hover:bg-yellow-50 transition"
                >
                  <h3 className="font-bold text-gray-900">{conf.conference_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {new Date(conf.scraped_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* URL Input */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-trackrecruit-yellow" />
            Conference Analysis
          </h2>
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter TFFRS conference URL..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
            />
            <button
              onClick={analyzeConference}
              disabled={loading}
              className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {conferenceData && (
          <div className="space-y-8">
            {/* Conference Overview */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {conferenceData.conference_name} Conference
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-trackrecruit-yellow">
                    {conferenceData.rankings?.Men?.length || 0}
                  </div>
                  <p className="text-gray-600">Men's Teams</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-trackrecruit-yellow">
                    {conferenceData.rankings?.Women?.length || 0}
                  </div>
                  <p className="text-gray-600">Women's Teams</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-trackrecruit-yellow">
                    {conferenceData.summary?.total_athletes || 0}
                  </div>
                  <p className="text-gray-600">Total Athletes</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {conferenceData.last_updated ? new Date(conferenceData.last_updated).toLocaleString() : 'Unknown'}
              </p>
            </div>

            {/* Men's Rankings */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Men's Team Rankings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Team</th>
                      <th className="text-right pr-4 font-bold text-gray-900">Points</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(conferenceData.rankings?.Men || conferenceData.men || []).map((team) => (
                      <tr key={team.team} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            team.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                            team.rank === 2 ? 'bg-gray-300 text-gray-900' :
                            team.rank === 3 ? 'bg-orange-400 text-white' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {team.rank}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{team.team}</td>
                        <td className="py-3 px-4 text-right font-black text-gray-900">{team.total_points}</td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/coaches/tffrs-analytics/team/men/${encodeURIComponent(team.team)}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                            <TrendingUp className="w-4 h-4 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women's Rankings */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-500" />
                Women's Team Rankings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Team</th>
                      <th className="text-right pr-4 font-bold text-gray-900">Points</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(conferenceData.rankings?.Women || conferenceData.women || []).map((team) => (
                      <tr key={team.team} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            team.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                            team.rank === 2 ? 'bg-gray-300 text-gray-900' :
                            team.rank === 3 ? 'bg-orange-400 text-white' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {team.rank}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{team.team}</td>
                        <td className="py-3 px-4 text-right font-black text-gray-900">{team.total_points}</td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/coaches/tffrs-analytics/team/women/${encodeURIComponent(team.team)}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                            <TrendingUp className="w-4 h-4 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-900 font-bold">Analyzing conference data...</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !conferenceData && !error && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Analyze</h3>
            <p className="text-gray-600 mb-6">
              Enter a TFFRS conference URL above to see team rankings and performance analytics
            </p>
            <div className="text-left max-w-md mx-auto">
              <p className="text-sm font-bold text-gray-900 mb-2">Example URLs:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ohio Valley: https://www.tfrrs.org/lists/2288.html</li>
                <li>• Big Ten: https://www.tfrrs.org/lists/2285.html</li>
                <li>• SEC: https://www.tfrrs.org/lists/2286.html</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
