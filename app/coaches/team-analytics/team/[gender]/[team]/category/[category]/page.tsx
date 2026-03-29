'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface EventPerformance {
  event: string
  rank: number
  points: number
  athlete: string
  mark: string
}

export default function CategoryDetail() {
  const params = useParams()
  const router = useRouter()
  const gender = params.gender as string
  const teamName = decodeURIComponent(params.team as string)
  const category = decodeURIComponent(params.category as string)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [performances, setPerformances] = useState<EventPerformance[]>([])
  const [url, setUrl] = useState('')
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
      fetchCategoryDetails()
    }
  }, [gender, teamName, category, url])

  const fetchCategoryDetails = async () => {
    setLoading(true)
    setError('')

    try {
      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

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
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch category details`)
      }

      const data = await response.json()
      const categoryData = data.team_data[category] || []
      setPerformances(categoryData)
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.')
      } else {
        setError(err.message || 'Failed to fetch category details')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 font-bold">Loading category data...</p>
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

  const totalPoints = performances.reduce((sum, p) => sum + p.points, 0)
  const avgPoints = performances.length > 0 ? (totalPoints / performances.length).toFixed(1) : '0'

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
            ← Back to Team
          </button>
          
          <div className="bg-white border border-gray-200 rounded p-4">
            <h1 className="text-2xl font-bold text-gray-900">{teamName}</h1>
            <p className="text-gray-600">{gender}'s {category}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{performances.length}</div>
            <div className="text-sm text-gray-500">Events</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalPoints}</div>
            <div className="text-sm text-gray-500">Total Points</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{avgPoints}</div>
            <div className="text-sm text-gray-500">Avg Points/Event</div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Individual Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Event</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Athlete</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Mark</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Rank</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Points</th>
                </tr>
              </thead>
              <tbody>
                {performances
                  .sort((a, b) => b.points - a.points)
                  .map((performance, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{performance.event}</td>
                      <td className="py-3 px-4 text-gray-700">{performance.athlete}</td>
                      <td className="py-3 px-4 text-gray-700">{performance.mark}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          performance.rank <= 3 ? 'bg-yellow-100 text-yellow-800' :
                          performance.rank <= 8 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          #{performance.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{performance.points}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
