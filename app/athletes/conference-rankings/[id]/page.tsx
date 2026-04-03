'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface Performance {
  id: string
  athlete_name: string
  event_name: string
  event_category: string
  mark: string
  rank: number
  points: number
  year: string
}

interface Conference {
  id: string
  conference_name: string
  url: string
}

export default function ConferenceRankingsPage() {
  const params = useParams()
  const conferenceId = params.id as string
  
  const [conference, setConference] = useState<Conference | null>(null)
  const [performances, setPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    loadConferenceData()
  }, [conferenceId])

  const loadConferenceData = async () => {
    try {
      // Load conference info
      const { data: confData, error: confError } = await supabase
        .from('tffrs_conferences')
        .select('*')
        .eq('id', conferenceId)
        .single()
      
      if (confError) throw confError
      setConference(confData)

      // Load performances for this conference
      // First get all team IDs for this conference
      const { data: teamsData, error: teamsError } = await supabase
        .from('tffrs_teams')
        .select('id')
        .eq('conference_id', conferenceId)
      
      if (teamsError) throw teamsError
      
      const teamIds = (teamsData as any[])?.map(t => t.id) || []
      
      // Then get performances for those teams
      const { data: perfData, error: perfError } = await supabase
        .from('tffrs_performances')
        .select('*')
        .in('team_id', teamIds)
        .lte('rank', 8)
        .order('event_name', { ascending: true })
        .order('rank', { ascending: true })
      
      if (perfError) throw perfError
      setPerformances(perfData || [])
      
      // Set first event as selected
      if (perfData && perfData.length > 0) {
        setSelectedEvent((perfData as Performance[])[0].event_name)
      }
    } catch (err) {
      console.error('Error loading conference data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Group performances by event
  const eventGroups: Record<string, Performance[]> = {}
  performances.forEach((perf) => {
    if (!eventGroups[perf.event_name]) {
      eventGroups[perf.event_name] = []
    }
    eventGroups[perf.event_name].push(perf)
  })

  const events = Object.keys(eventGroups).sort()
  const selectedPerformances = selectedEvent ? eventGroups[selectedEvent] || [] : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/athletes/conference-info"
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  {conference?.conference_name || 'Conference Rankings'}
                </h1>
                <p className="text-gray-700 mt-1">Top 8 athletes per event</p>
              </div>
            </div>
            {conference?.url && (
              <a
                href={conference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-gray-700 flex items-center text-sm font-semibold"
              >
                View on TFRRS <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rankings...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Data Available</h3>
            <p className="text-gray-600 mb-6">
              Performance data for this conference hasn't been scraped yet.
            </p>
            {conference?.url && (
              <a
                href={conference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                View on TFRRS <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Event Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-4">Select Event</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {events.map((event) => (
                    <button
                      key={event}
                      onClick={() => setSelectedEvent(event)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                        selectedEvent === event
                          ? 'bg-trackrecruit-yellow text-gray-900'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-sm">{event}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {eventGroups[event].length} athletes
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rankings Table */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="bg-trackrecruit-yellow px-6 py-4 border-b-2 border-gray-900">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent}</h2>
                  <p className="text-gray-700 text-sm mt-1">Top 8 Conference Performers</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Athlete</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Mark</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Points</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPerformances.map((perf, index) => (
                        <tr 
                          key={perf.id}
                          className={`border-b border-gray-200 ${
                            perf.rank === 1 ? 'bg-yellow-50' :
                            perf.rank === 8 ? 'bg-green-50' :
                            ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {perf.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500 mr-2" />}
                              <span className="font-bold text-gray-900 text-lg">{perf.rank}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">{perf.athlete_name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-gray-900 text-lg">{perf.mark}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold text-lg ${
                              perf.rank === 1 ? 'text-yellow-600' :
                              perf.rank === 8 ? 'text-green-600' :
                              'text-blue-600'
                            }`}>
                              {perf.points}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{perf.year || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Scoring Legend */}
                <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Conference Scoring</h4>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-yellow-100 border border-yellow-300 rounded px-2 py-1">
                      <span className="font-bold">1st:</span> 10 pts
                    </div>
                    <div className="bg-gray-100 border border-gray-300 rounded px-2 py-1">
                      <span className="font-bold">2nd:</span> 8 pts
                    </div>
                    <div className="bg-orange-100 border border-orange-300 rounded px-2 py-1">
                      <span className="font-bold">3rd:</span> 6 pts
                    </div>
                    <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1">
                      <span className="font-bold">4th:</span> 5 pts
                    </div>
                    <div className="bg-blue-100 border border-blue-200 rounded px-2 py-1">
                      <span className="font-bold">5th:</span> 4 pts
                    </div>
                    <div className="bg-blue-100 border border-blue-200 rounded px-2 py-1">
                      <span className="font-bold">6th:</span> 3 pts
                    </div>
                    <div className="bg-blue-100 border border-blue-200 rounded px-2 py-1">
                      <span className="font-bold">7th:</span> 2 pts
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded px-2 py-1">
                      <span className="font-bold">8th:</span> 1 pt
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
