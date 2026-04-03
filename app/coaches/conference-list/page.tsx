'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Calendar, Trophy, TrendingUp, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

interface Conference {
  id: string
  url: string
  conference_name: string
  scraped_at: string
  data: any
}

export default function ConferenceListPage() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadConferences()
  }, [])

  const loadConferences = async () => {
    try {
      console.log('🔍 Starting to load conferences...')
      const supabase = createClient()
      
      // Debug environment variables
      console.log('📋 Environment check:')
      console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
      console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
      
      const { data, error } = await supabase
        .from('tffrs_conferences')
        .select('id, url, conference_name, scraped_at')
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

  console.log('🎯 Current state:', { 
    loading, 
    conferencesLength: conferences.length, 
    filteredLength: filteredConferences.length,
    searchTerm 
  })

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
              <h1 className="text-3xl font-black text-gray-900">All Conferences</h1>
              <p className="text-gray-700 mt-1">Complete list of scraped TFFRS conferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/coaches/conference-analytics"
                className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Conference Analytics
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
              {searchTerm ? 'Try adjusting your search terms' : 'Start by scraping your first conference'}
            </p>
            {!searchTerm && (
              <Link
                href="/coaches/conference-analytics"
                className="inline-flex items-center bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                View Conference Analytics
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-bold text-gray-900">Conference Name</th>
                  <th className="text-left py-3 px-6 font-bold text-gray-900">Last Updated</th>
                  <th className="text-left py-3 px-6 font-bold text-gray-900">Source</th>
                  <th className="text-center py-3 px-6 font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredConferences.map((conference, index) => (
                  <tr key={conference.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {conference.conference_name || 'Unknown Conference'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(conference.scraped_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={conference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        TFRRS
                      </a>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/coaches/conference-detail/${conference.id}`}
                        className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded font-bold hover:bg-yellow-400 transition inline-block"
                      >
                        View Rankings
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
