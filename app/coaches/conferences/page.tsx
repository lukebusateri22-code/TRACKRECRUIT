'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Calendar, Trophy, TrendingUp, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SavedConference {
  id: string
  url: string
  conference_name: string
  scraped_at: string
  data?: any
}

export default function ConferencesPage() {
  const [conferences, setConferences] = useState<SavedConference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')

  const supabase = createClient()

  useEffect(() => {
    loadConferences()
  }, [])

  const loadConferences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tffrs_conferences')
        .select('id, url, conference_name, scraped_at, data')
        .order('scraped_at', { ascending: false })

      if (error) throw error
      setConferences(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load conferences')
    } finally {
      setLoading(false)
    }
  }

  const deleteConference = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tffrs_conferences')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadConferences()
    } catch (err: any) {
      setError(err.message || 'Failed to delete conference')
    }
  }

  const filteredConferences = conferences
    .filter(conf => 
      conf.conference_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conf.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime()
      } else {
        return (a.conference_name || '').localeCompare(b.conference_name || '')
      }
    })

  const getConferenceStats = (data: any) => {
    if (!data) return { men: 0, women: 0, total: 0 }
    
    const menCount = data.men?.length || 0
    const womenCount = data.women?.length || 0
    const totalPoints = (data.men?.reduce((sum: number, team: any) => sum + (team.total_points || 0), 0) || 0) +
                       (data.women?.reduce((sum: number, team: any) => sum + (team.total_points || 0), 0) || 0)
    
    return { men: menCount, women: womenCount, total: totalPoints }
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
              <p className="text-gray-700 mt-1">Manage and analyze all your saved TFFRS conferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/coaches/tffrs-analytics"
                className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Add New
              </Link>
              <button
                onClick={loadConferences}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conferences by name or URL..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trackrecruit-blue focus:border-trackrecruit-blue sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trackrecruit-blue"
              >
                <option value="date">Most Recent</option>
                <option value="name">Conference Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-trackrecruit-yellow mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{conferences.length}</p>
                <p className="text-sm text-gray-600">Total Conferences</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {conferences.filter(c => {
                    const scraped = new Date(c.scraped_at)
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    return scraped > weekAgo
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Scraped This Week</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {conferences.reduce((sum, c) => sum + getConferenceStats(c.data).men, 0)}
                </p>
                <p className="text-sm text-gray-600">Men's Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-pink-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {conferences.reduce((sum, c) => sum + getConferenceStats(c.data).women, 0)}
                </p>
                <p className="text-sm text-gray-600">Women's Teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Conferences Grid */}
        {filteredConferences.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No conferences found' : 'No conferences saved yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start by scraping your first TFFRS conference'}
            </p>
            {!searchTerm && (
              <Link
                href="/coaches/tffrs-analytics"
                className="inline-flex items-center bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                Scrape First Conference
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConferences.map((conference) => {
              const stats = getConferenceStats(conference.data)
              return (
                <div key={conference.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {conference.conference_name || 'Unknown Conference'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(conference.scraped_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteConference(conference.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete conference"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{stats.men}</p>
                      <p className="text-xs text-gray-600">Men</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-pink-600">{stats.women}</p>
                      <p className="text-xs text-gray-600">Women</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-600">Points</p>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="mb-4">
                    <a 
                      href={conference.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Source
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/coaches/tffrs-analytics?conf=${conference.id}`}
                      className="flex-1 text-center bg-trackrecruit-yellow text-gray-900 px-3 py-2 rounded-lg font-bold hover:bg-yellow-400 transition text-sm"
                    >
                      Analyze
                    </Link>
                    <Link
                      href={`/coaches/conferences/${conference.id}`}
                      className="flex-1 text-center bg-gray-900 text-trackrecruit-yellow px-3 py-2 rounded-lg font-bold hover:bg-gray-800 transition text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
