'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Trophy, ExternalLink } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface Conference {
  id: string
  conference_name: string
  url: string
}

export default function ConferenceListPage() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    console.log('🔄 useEffect triggered')
    
    const loadConferences = async () => {
      console.log('🔍 Starting to load conferences...')
      console.log('⏰ Time:', new Date().toISOString())
      
      try {
        console.log('📡 Making Supabase query...')
        const startTime = performance.now()
        
        // Create a simple client without auth to avoid lock issues
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false
            }
          }
        )
        
        const { data, error } = await supabase
          .from('tffrs_conferences')
          .select('id, conference_name, url')
          .order('conference_name', { ascending: true })
          .limit(100)
        
        const endTime = performance.now()
        console.log(`⏱️ Query took ${(endTime - startTime).toFixed(2)}ms`)
        
        if (error) {
          console.error('❌ Supabase error:', error)
          throw error
        }
        
        console.log('✅ Data received:', data?.length, 'conferences')
        console.log('📊 Sample data:', data?.[0])
        
        setConferences(data || [])
      } catch (err) {
        console.error('💥 Error loading conferences:', err)
        console.error('Error details:', JSON.stringify(err, null, 2))
      } finally {
        console.log('🏁 Loading complete, setting loading to false')
        setLoading(false)
      }
    }
    
    loadConferences()
  }, [])

  const filteredConferences = conferences.filter(conf => 
    conf.conference_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/athletes"
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">All Conferences</h1>
                <p className="text-gray-700 mt-1">Complete list of scraped TFRRS conferences</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conferences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none text-gray-900"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{filteredConferences.length} conferences found</p>
        </div>

        {/* Conferences Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conferences...</p>
          </div>
        ) : filteredConferences.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-600">No conferences found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Conference Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Source</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConferences.map((conference) => (
                    <tr key={conference.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{conference.conference_name || 'Unknown Conference'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={conference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          TFRRS <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/athletes/conference-rankings/${conference.id}`}
                          className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition inline-block"
                        >
                          View Rankings
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
