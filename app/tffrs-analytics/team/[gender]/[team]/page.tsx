'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface TeamData {
  [category: string]: Array<{
    event: string
    rank: number
    points: number
    athlete: string
    mark: string
  }>
}

interface TeamScores {
  total: number
  Sprints?: number
  Distance?: number
  Hurdles?: number
  Jumps?: number
  Throws?: number
  Relays?: number
  Combined?: number
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']

export default function TeamDetail() {
  const params = useParams()
  const router = useRouter()
  const gender = params.gender as string
  const teamName = decodeURIComponent(params.team as string)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [teamScores, setTeamScores] = useState<TeamScores | null>(null)
  const [url, setUrl] = useState('')
  const [graduationLoss, setGraduationLoss] = useState<any>(null)

  useEffect(() => {
    const savedUrl = sessionStorage.getItem('tffrs-current-url')
    if (savedUrl) {
      setUrl(savedUrl)
    }
  }, [])

  useEffect(() => {
    if (url) {
      fetchTeamDetails()
    }
  }, [gender, teamName, url])

  const fetchTeamDetails = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tffrs-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/team_details/${gender}/${encodeURIComponent(teamName)}`,
          data: { url }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch team details')
      }

      setTeamData(data.team_data)
      setTeamScores(data.team_scores)
      
      // Get graduation data
      try {
        const gradResponse = await fetch('/api/tffrs-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: '/enhanced_graduation_analysis',
            data: { url }
          })
        })
        
        const gradData = await gradResponse.json()
        if (gradResponse.ok) {
          setGraduationLoss(gradData.analysis[gender]?.[teamName])
        }
      } catch (gradErr) {
        console.error('Graduation analysis failed:', gradErr)
      }
      
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
          <p className="text-gray-900 font-bold">Loading team data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <p className="text-red-800 font-bold">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const categories = Object.entries(teamScores || {})
    .filter(([key]) => key !== 'total' && teamScores![key as keyof TeamScores]! > 0)
    .map(([category, points]) => ({ name: category, value: points }))

  const barData = Object.entries(teamData || {}).map(([category, events]) => ({
    category,
    points: events.reduce((sum, event) => sum + event.points, 0),
    events: events.length
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/home" className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/home" className="text-gray-900 font-semibold hover:text-gray-700">Home</Link>
              <Link href="/tffrs-analytics" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">
                TFFRS Analytics
              </Link>
              <Link href="/about" className="text-gray-900 font-semibold hover:text-gray-700">About</Link>
              <Link href="/contact" className="text-gray-900 font-semibold hover:text-gray-700">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Rankings
          </button>
          
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{teamName}</h1>
                <p className="text-gray-600">{gender}'s Team</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-gray-900">{teamScores?.total || 0}</p>
                <p className="text-sm text-gray-500">total points</p>
                
                {graduationLoss && graduationLoss.senior_points_lost > 0 && (
                  <div className="text-sm text-red-600 font-medium mt-1">
                    🎓 {graduationLoss.senior_points_lost} pts lost ({graduationLoss.percentage_lost}%)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Point Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Category Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Groups */}
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(teamData || {}).map(([category, events]) => (
              <Link
                key={category}
                href={`/tffrs-analytics/team/${gender}/${encodeURIComponent(teamName)}/category/${encodeURIComponent(category)}`}
                className="block border border-gray-200 rounded p-4 hover:border-gray-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-900">{category}</h4>
                  <span className="text-lg font-bold text-blue-600">
                    {events.reduce((sum, event) => sum + event.points, 0)} pts
                  </span>
                </div>
                <p className="text-sm text-gray-500">{events.length} events</p>
                
                {graduationLoss?.category_breakdown?.[category] && (
                  <p className="text-sm text-red-600 font-medium mt-2">
                    🎓 {graduationLoss.category_breakdown[category].senior_points_lost} pts lost
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
