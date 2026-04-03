'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Trophy, TrendingUp, Users, ExternalLink, BarChart3 } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { createClient } from '@/lib/supabase/client'

interface TeamRanking {
  rank: number
  team: string
  total_points: number
}

interface ConferenceData {
  men: TeamRanking[]
  women: TeamRanking[]
  conference_name: string
  scraped_at: string
}

export default function ConferenceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conferenceId = params.id as string
  
  const [conference, setConference] = useState<ConferenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (conferenceId) {
      loadConference()
    }
  }, [conferenceId])

  const loadConference = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tffrs_conferences')
        .select('*')
        .eq('id', conferenceId)
        .single()

      if (error) throw error
      setConference((data as any).data)
    } catch (err: any) {
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
          <p className="text-gray-900 font-bold">Loading conference...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl">
          <p className="text-red-800 font-bold mb-4">Error: {error}</p>
          <Link href="/coaches/conferences" className="text-blue-600 hover:text-blue-800">
            ← Back to Conferences
          </Link>
        </div>
      </div>
    )
  }

  if (!conference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl">
          <p className="text-gray-900 font-bold mb-4">Conference not found</p>
          <Link href="/coaches/conferences" className="text-blue-600 hover:text-blue-800">
            ← Back to Conferences
          </Link>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const topMenTeams = conference.men.slice(0, 10).map(team => ({
    team: team.team,
    points: team.total_points,
    rank: team.rank
  }))

  const topWomenTeams = conference.women.slice(0, 10).map(team => ({
    team: team.team,
    points: team.total_points,
    rank: team.rank
  }))

  const totalTeams = conference.men.length + conference.women.length
  const totalPoints = conference.men.reduce((sum, team) => sum + team.total_points, 0) + 
                     conference.women.reduce((sum, team) => sum + team.total_points, 0)

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/coaches/conferences" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">{conference.conference_name}</h1>
                <div className="flex items-center text-gray-700 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Scraped {new Date(conference.scraped_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Link
              href={`/coaches/tffrs-analytics?conf=${conferenceId}`}
              className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Full Analysis
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{conference.men.length}</p>
                <p className="text-sm text-gray-600">Men's Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-pink-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{conference.women.length}</p>
                <p className="text-sm text-gray-600">Women's Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-trackrecruit-yellow mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
                <p className="text-sm text-gray-600">Total Teams</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Men's Top 10 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Men's Top 10 Teams
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMenTeams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Points']} />
                <Bar dataKey="points" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Women's Top 10 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-pink-500" />
              Women's Top 10 Teams
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topWomenTeams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Points']} />
                <Bar dataKey="points" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rankings Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Men's Rankings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-blue-500" />
              Men's Complete Rankings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Team</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {conference.men.map((team) => (
                    <tr key={team.team} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          team.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                          team.rank === 2 ? 'bg-gray-300 text-gray-900' :
                          team.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {team.rank}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{team.team}</td>
                      <td className="py-3 px-4 text-right font-black text-gray-900">{team.total_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Women's Rankings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-pink-500" />
              Women's Complete Rankings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Team</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {conference.women.map((team) => (
                    <tr key={team.team} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          team.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                          team.rank === 2 ? 'bg-gray-300 text-gray-900' :
                          team.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {team.rank}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{team.team}</td>
                      <td className="py-3 px-4 text-right font-black text-gray-900">{team.total_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
