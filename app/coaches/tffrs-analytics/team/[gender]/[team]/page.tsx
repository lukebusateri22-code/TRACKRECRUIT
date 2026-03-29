'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Performance {
  athlete: string
  event: string
  mark: string
  rank: number
  points: number
}

export default function TeamPage() {
  const params = useParams()
  const gender = params.gender as string
  const teamName = decodeURIComponent(params.team as string)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [teamData, setTeamData] = useState<Record<string, Performance[]>>({})

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      // First, try to get data from sessionStorage (instant!)
      const savedData = sessionStorage.getItem('tffrs-conference-data')
      let data

      if (savedData) {
        // Use cached data - instant load!
        data = JSON.parse(savedData)
      } else {
        // Fallback: fetch from API if no cached data
        const savedUrl = sessionStorage.getItem('tffrs-current-url')
        if (!savedUrl) {
          setError('No conference data found. Please go back and analyze a conference first.')
          setLoading(false)
          return
        }

        const response = await fetch('/api/tffrs-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: savedUrl })
        })

        data = await response.json()
      }
      
      const eventBreakdown = data.event_breakdown || {}
      
      // Capitalize gender to match API structure (Men/Women)
      const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1)
      
      const genderData = eventBreakdown[capitalizedGender] || {}
      const teamEventData = genderData[teamName] || {}
      
      if (Object.keys(teamEventData).length === 0) {
        setError(`No data found for "${teamName}" in ${capitalizedGender}'s teams. Available teams: ${Object.keys(genderData).join(', ')}`)
        return
      }
      
      setTeamData(teamEventData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 font-bold">Loading {teamName}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl">
          <p className="text-red-800 font-bold mb-4">Error: {error}</p>
          <Link href="/coaches/tffrs-analytics" className="text-blue-600 hover:text-blue-800">
            ← Back to Conference Analytics
          </Link>
        </div>
      </div>
    )
  }

  const categories = Object.keys(teamData)
  const totalPoints = categories.reduce((sum, cat) => 
    sum + teamData[cat].reduce((s, perf) => s + perf.points, 0), 0
  )

  // Prepare chart data
  const chartData = categories.map(category => ({
    category,
    points: teamData[category].reduce((sum, perf) => sum + perf.points, 0),
    events: teamData[category].length,
    avgPoints: Math.round(teamData[category].reduce((sum, perf) => sum + perf.points, 0) / teamData[category].length * 10) / 10
  })).sort((a, b) => b.points - a.points)

  // Pie chart data
  const pieData = chartData.map(item => ({
    name: item.category,
    value: item.points,
    percentage: Math.round((item.points / totalPoints) * 100)
  }))

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/home" className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/home" className="text-gray-900 font-semibold hover:text-gray-700">Home</Link>
              <Link href="/coaches/tffrs-analytics" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">
                Conference Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/coaches/tffrs-analytics" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Conference
        </Link>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{teamName}</h1>
              <p className="text-lg text-gray-600">{gender}'s Team</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-gray-900">{totalPoints}</p>
              <p className="text-sm text-gray-500">total points</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Points by Category */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Point Distribution by Event Group</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Points']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="points" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Percentage Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Point Percentage Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${Math.round((percent || 0) * 100)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Points']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {chartData.map((item, index) => (
            <div key={item.category} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.points}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{item.events} events</p>
                  <p className="text-sm font-medium text-gray-700">{item.avgPoints} avg</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {categories.map(category => {
            const performances = teamData[category]
            const categoryPoints = performances.reduce((sum, perf) => sum + perf.points, 0)
            const sortedPerformances = performances.sort((a, b) => b.points - a.points)

            return (
              <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                  <div className="text-right">
                    <span className="text-3xl font-black text-blue-600">{categoryPoints}</span>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Athlete</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Event</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Mark</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-900">Rank</th>
                        <th className="text-right py-3 px-4 font-bold text-gray-900">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPerformances.map((perf, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{perf.athlete}</td>
                          <td className="py-3 px-4 text-gray-700">{perf.event}</td>
                          <td className="py-3 px-4 text-gray-700">{perf.mark}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              perf.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                              perf.rank === 2 ? 'bg-gray-300 text-gray-900' :
                              perf.rank === 3 ? 'bg-orange-400 text-white' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {perf.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-black text-gray-900">{perf.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
