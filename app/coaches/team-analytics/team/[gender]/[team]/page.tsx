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

interface RecruitingRecommendation {
  name: string
  event: string
  mark: string
  school: string
  year: string
  fit_score: number
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
  const [showRecruiting, setShowRecruiting] = useState(false)
  const [recruitingRecommendations, setRecruitingRecommendations] = useState<RecruitingRecommendation[]>([])
  const [userRole, setUserRole] = useState<string>('coach')

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'coach'
    setUserRole(role)
  }, [])

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
      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      const response = await fetch('/api/tffrs-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/team_details/${gender}/${encodeURIComponent(teamName)}`,
          data: { url }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch team details`)
      }

      const data = await response.json()
      setTeamData(data.team_data)
      setTeamScores(data.team_scores)
      
      // Get graduation data with timeout
      try {
        const gradController = new AbortController()
        const gradTimeoutId = setTimeout(() => gradController.abort(), 10000) // 10 second timeout

        const gradResponse = await fetch('/api/tffrs-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: '/enhanced_graduation_analysis',
            data: { url }
          }),
          signal: gradController.signal
        })

        clearTimeout(gradTimeoutId)

        if (gradResponse.ok) {
          const gradData = await gradResponse.json()
          setGraduationLoss(gradData.analysis[gender]?.[teamName])
        }
      } catch (gradErr) {
        console.log('Graduation analysis skipped or failed:', gradErr)
        // Don't fail the whole page load if graduation analysis fails
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.')
      } else {
        setError(err.message || 'Failed to fetch team details')
      }
    } finally {
      setLoading(false)
    }
  }

  const analyzeWeaknessesAndRecommend = () => {
    if (!teamScores || !graduationLoss) return

    // Find weakest categories considering graduation losses
    const categories = Object.entries(teamScores)
      .filter(([key]) => key !== 'total' && teamScores[key as keyof TeamScores]! > 0)
      .map(([category, points]) => {
        const seniorLoss = graduationLoss.category_breakdown?.[category]?.senior_points_lost || 0
        const projectedPoints = points - seniorLoss
        const impactPercentage = points > 0 ? (seniorLoss / points) * 100 : 0
        
        return {
          category,
          currentPoints: points,
          seniorLoss,
          projectedPoints,
          impactPercentage
        }
      })
      .sort((a, b) => b.impactPercentage - a.impactPercentage)

    // Generate mock recruiting recommendations for weakest categories
    const recommendations: RecruitingRecommendation[] = []
    const weakestCategories = categories.slice(0, 2) // Top 2 weakest

    weakestCategories.forEach(cat => {
      // Mock data - in real implementation this would come from a database
      const mockAthletes = [
        { name: 'Sarah Johnson', event: cat.category === 'Sprints' ? '100m' : cat.category === 'Distance' ? '800m' : cat.category, mark: cat.category === 'Sprints' ? '11.8' : cat.category === 'Distance' ? '2:08.5' : '12.5', school: 'Lincoln High', year: 'SR-4', fit_score: 95 },
        { name: 'Marcus Williams', event: cat.category === 'Sprints' ? '200m' : cat.category === 'Distance' ? '1600m' : cat.category, mark: cat.category === 'Sprints' ? '22.1' : cat.category === 'Distance' ? '4:15.2' : '13.1', school: 'Oak Ridge', year: 'JR-3', fit_score: 92 },
        { name: 'Emily Chen', event: cat.category === 'Sprints' ? '400m' : cat.category === 'Distance' ? '3200m' : cat.category, mark: cat.category === 'Sprints' ? '55.2' : cat.category === 'Distance' ? '10:45.8' : '11.8', school: 'Westlake', year: 'SR-4', fit_score: 88 },
      ]
      
      recommendations.push(...mockAthletes)
    })

    setRecruitingRecommendations(recommendations)
    setShowRecruiting(true)
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
            <Link href={userRole === 'coach' ? '/coaches/dashboard' : '/athletes'} className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href={userRole === 'coach' ? '/coaches/dashboard' : '/athletes'} className="text-gray-900 font-semibold hover:text-gray-700">
                {userRole === 'coach' ? 'Dashboard' : 'Profile'}
              </Link>
              {userRole === 'coach' && (
                <>
                  <Link href="/coaches/tffrs-analytics" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">
                    TFFRS Analytics
                  </Link>
                  <Link href="/coaches/search" className="text-gray-900 font-semibold hover:text-gray-700">Search Athletes</Link>
                  <Link href="/coaches/messages" className="text-gray-900 font-semibold hover:text-gray-700">Messages</Link>
                </>
              )}
              {userRole === 'athlete' && (
                <>
                  <Link href="/athletes/search" className="text-gray-900 font-semibold hover:text-gray-700">Search Coaches</Link>
                  <Link href="/athletes/profile" className="text-gray-900 font-semibold hover:text-gray-700">My Profile</Link>
                </>
              )}
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

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={analyzeWeaknessesAndRecommend}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            🎯 Analyze Weaknesses & Get Recommendations
          </button>
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

        {/* Senior Analysis */}
        {graduationLoss && (
          <div className="bg-white border border-gray-200 rounded p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎓 Senior Impact Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-semibold text-gray-900 mb-2">Projected Next Year</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Current Points:</span>
                    <span className="font-bold">{graduationLoss.total_points}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Senior Loss:</span>
                    <span className="font-bold">-{graduationLoss.senior_points_lost}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between">
                    <span className="font-semibold">Projected:</span>
                    <span className="font-bold text-lg">
                      {graduationLoss.total_points - graduationLoss.senior_points_lost}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-semibold text-gray-900 mb-2">Top Senior Performers</h4>
                <div className="space-y-1">
                  {graduationLoss.senior_performances.slice(0, 3).map((perf: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium">{perf.athlete}</span>
                      <span className="text-red-600 font-bold">{perf.points}pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Impact */}
            {graduationLoss.category_breakdown && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Impact by Category</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(graduationLoss.category_breakdown).map(([category, data]: [string, any]) => (
                    <div key={category} className="border border-gray-200 rounded p-2">
                      <div className="font-medium text-gray-900">{category}</div>
                      <div className="text-sm text-gray-500">{data.total_points} total</div>
                      <div className="text-sm font-bold text-red-600">-{data.senior_points_lost} senior</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recruiting Recommendations Modal */}
        {showRecruiting && (
          <div className="bg-white border border-gray-200 rounded p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">🎯 Recruiting Recommendations</h3>
              <button
                onClick={() => setShowRecruiting(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Athlete</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Event</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Mark</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">School</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Year</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Fit Score</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitingRecommendations.map((rec, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{rec.name}</td>
                      <td className="py-3 px-4 text-gray-700">{rec.event}</td>
                      <td className="py-3 px-4 text-gray-700">{rec.mark}</td>
                      <td className="py-3 px-4 text-gray-700">{rec.school}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          rec.year.includes('SR') ? 'bg-red-100 text-red-800' :
                          rec.year.includes('JR') ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.year}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-bold ${
                          rec.fit_score >= 90 ? 'bg-green-500 text-white' :
                          rec.fit_score >= 80 ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {rec.fit_score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Event Groups */}
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(teamData || {}).map(([category, events]) => (
              <Link
                key={category}
                href={`/coaches/tffrs-analytics/team/${gender}/${encodeURIComponent(teamName)}/category/${encodeURIComponent(category)}`}
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
