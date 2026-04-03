'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Calendar, Trophy, TrendingUp, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SavedConference {
  id: string
  url: string
  conference_name: string
  scraped_at: string
  data?: any
}

export default function SimpleConferencesPage() {
  const [conferences, setConferences] = useState<SavedConference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')

  useEffect(() => {
    console.log('🎯 Simple conference page mounting...')
    loadConferencesSimple()
  }, [])

  const loadConferencesSimple = async () => {
    console.log('🚀 Starting simple conference load...')
    
    try {
      setLoading(true)
      setError('')
      
      // Step 1: Test basic fetch to our own API
      console.log('📡 Testing API connection...')
      const apiTest = await fetch('/api/conferences')
      console.log('📥 API test response:', apiTest.status)
      
      if (!apiTest.ok) {
        const errorText = await apiTest.text()
        console.error('❌ API test failed:', errorText)
        setError(`API connection failed: ${apiTest.status}`)
        return
      }
      
      const apiData = await apiTest.json()
      console.log('✅ API data received:', apiData)
      
      setConferences(apiData.conferences || [])
      
    } catch (err: any) {
      console.error('💥 Simple load error:', err)
      setError(`Failed to load: ${err.message}`)
    } finally {
      setLoading(false)
      console.log('🏁 Simple load complete')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 font-bold">Loading conferences...</p>
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
              <h1 className="text-3xl font-black text-gray-900">Conference Library</h1>
              <p className="text-gray-700 mt-1">Manage and analyze your saved TFFRS conferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/coaches/tffrs-analytics"
                className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Add New
              </Link>
              <button
                onClick={loadConferencesSimple}
                className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-bold">Error: {error}</p>
          </div>
        )}

        {/* Success State */}
        {!error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">✅ Page loaded successfully! Found {conferences.length} conferences.</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search conferences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Conferences Grid */}
        {conferences.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No conferences have been added yet</h3>
            <p className="text-gray-600 mb-6">To get started, please add your first TFFRS conference</p>
            <Link
              href="/coaches/tffrs-analytics"
              className="inline-flex items-center bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
            >
              Add First Conference
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conferences.map((conference) => (
              <div key={conference.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {conference.conference_name || 'Untitled Conference'}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{conference.url}</p>
                  </div>
                  <Trophy className="w-6 h-6 text-trackrecruit-yellow flex-shrink-0 ml-2" />
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(conference.scraped_at).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/coaches/conferences/${conference.id}`}
                    className="flex-1 bg-gray-900 text-white px-3 py-2 rounded text-center text-sm font-bold hover:bg-gray-800 transition"
                  >
                    View Details
                  </Link>
                  <button
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
