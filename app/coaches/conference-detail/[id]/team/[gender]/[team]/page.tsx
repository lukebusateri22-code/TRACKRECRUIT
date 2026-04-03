'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Users, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function ConferenceTeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conferenceId = params.id as string
  const gender = params.gender as string
  const teamName = decodeURIComponent(params.team as string)
  
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
      
      console.log('🔍 Conference data loaded:', data)
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
          <p className="text-gray-900 font-bold">Loading team data...</p>
        </div>
      </div>
    )
  }

  if (error || !conference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl">
          <p className="text-gray-900 font-bold mb-4">Error: {error}</p>
          <Link href={`/coaches/conference-detail/${conferenceId}`} className="text-blue-600 hover:text-blue-800">
            ← Back to Conference
          </Link>
        </div>
      </div>
    )
  }

  const scrapedData = conference.data
  const teams = scrapedData.rankings?.[gender] || []
  const teamData = teams.find((team: any) => team.team === teamName)

  
  if (!teamData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link
                href={`/coaches/conference-detail/${conferenceId}`}
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Team Not Found</h1>
                <p className="text-gray-700 mt-1">{teamName} - {gender}</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-900 font-bold mb-4">Team "{teamName}" not found in {gender} rankings</p>
            <Link href={`/coaches/conference-detail/${conferenceId}`} className="text-blue-600 hover:text-blue-800">
              ← Back to Conference
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Prepare category data for charts - include all categories with 0 points
  const allCategories = ['Sprints', 'Distance', 'Jumps', 'Hurdles', 'Throws']
  const categoryData = allCategories.map(category => {
    const categoryKey = category.toLowerCase()
    let points = 0
    
    // Find matching category in team data
    Object.entries(teamData).forEach(([key, value]) => {
      if (key !== 'rank' && key !== 'team' && key !== 'total' && typeof value === 'number') {
        const formattedCategory = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        if (formattedCategory === category) {
          // Move 10,000 points to Distance category
          if (category === 'Distance' && value === 10000) {
            points = 10000
          } else if (category !== 'Distance' && value === 10000) {
            // Don't show 10,000 in other categories
            points = 0
          } else {
            points = value
          }
        }
      }
    })
    
    return { category, points }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href={`/coaches/conference-detail/${conferenceId}`}
              className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{teamName}</h1>
              <p className="text-gray-700 mt-1">{gender} - Rank #{teamData.rank}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-trackrecruit-yellow mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">#{teamData.rank}</p>
                <p className="text-sm text-gray-600">Rank</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{teamData.total}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{scrapedData.summary?.total_athletes || 0}</p>
                <p className="text-sm text-gray-600">Conference Athletes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Points by Category</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-bold text-gray-900">Category</th>
                      <th className="text-right py-2 px-3 font-bold text-gray-900">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((cat, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-medium text-gray-900">{cat.category}</td>
                        <td className="py-2 px-3 text-right font-black text-gray-900">{cat.points as number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Points Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="points" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Full Athlete Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Full Athlete Breakdown</h2>
          
                    
          {scrapedData.event_breakdown?.[gender]?.[teamName] ? (
            <div className="space-y-6">
              {categoryData.map(({category, points}) => {
                // Find the original category key from teamData
                const originalCategoryKey = Object.keys(teamData).find(key => {
                  if (key === 'rank' || key === 'team' || key === 'total') return false
                  const formattedCategory = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  return formattedCategory === category
                }) || category.toLowerCase()
                
                // Try different ways to access the category data
                let categoryPerformances = []
                const teamBreakdown = scrapedData.event_breakdown[gender][teamName]
                
                if (Array.isArray(teamBreakdown)) {
                  categoryPerformances = teamBreakdown.filter((event: any) => 
                    event.category === category
                  )
                } else if (teamBreakdown && typeof teamBreakdown === 'object') {
                  // If it's an object, try to find the category data
                  categoryPerformances = teamBreakdown[originalCategoryKey] || []
                }
                
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-between">
                      <span>{category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span className="text-sm font-normal text-gray-600">{points as number} points</span>
                    </h3>
                    
                    {categoryPerformances.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 font-bold text-gray-900 text-sm">Athlete</th>
                              <th className="text-left py-2 px-3 font-bold text-gray-900 text-sm">Event</th>
                              <th className="text-left py-2 px-3 font-bold text-gray-900 text-sm">Performance</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-900 text-sm">Place</th>
                              <th className="text-right py-2 px-3 font-bold text-gray-900 text-sm">Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoryPerformances
                              .sort((a: any, b: any) => b.points - a.points)
                              .map((performance: any, index: number) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-2 px-3 font-medium text-gray-900 text-sm">
                                    {performance.athlete || 'Unknown'}
                                  </td>
                                  <td className="py-2 px-3 text-gray-900 text-sm">
                                    {performance.event || 'Unknown'}
                                  </td>
                                  <td className="py-2 px-3 text-gray-900 text-sm">
                                    {performance.mark || 'N/A'}
                                  </td>
                                  <td className="py-2 px-3 text-center text-gray-900 text-sm">
                                    {performance.place || 'N/A'}
                                  </td>
                                  <td className="py-2 px-3 text-right font-black text-gray-900 text-sm">
                                    {performance.points || 0}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No performances found in this category
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Athletes: {categoryPerformances.length}</span>
                        <span>Total Points: {categoryPerformances.reduce((sum: number, p: any) => sum + (p.points || 0), 0)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium mb-2">No detailed athlete data available</p>
              <p className="text-sm mb-4">The event breakdown data is not available for this team.</p>
              
              {/* Always show raw_data as fallback */}
              {scrapedData.raw_data && Array.isArray(scrapedData.raw_data) && (
                <div className="text-left mt-6">
                  <h4 className="font-bold text-gray-900 mb-3">Raw Performance Data:</h4>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-3 font-bold text-gray-900">Athlete</th>
                          <th className="text-left py-2 px-3 font-bold text-gray-900">Event</th>
                          <th className="text-left py-2 px-3 font-bold text-gray-900">Performance</th>
                          <th className="text-center py-2 px-3 font-bold text-gray-900">Place</th>
                          <th className="text-right py-2 px-3 font-bold text-gray-900">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scrapedData.raw_data
                          .filter((item: any) => item.team === teamName && item.gender === gender)
                          .slice(0, 50)
                          .map((item: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 font-medium text-gray-900">{item.athlete || 'Unknown'}</td>
                              <td className="py-2 px-3 text-gray-900">{item.event || 'Unknown'}</td>
                              <td className="py-2 px-3 text-gray-900">{item.mark || 'N/A'}</td>
                              <td className="py-2 px-3 text-center text-gray-900">{item.place || 'N/A'}</td>
                              <td className="py-2 px-3 text-right font-black text-gray-900">{item.points || 0}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Showing first 50 performances for {teamName} {gender}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
