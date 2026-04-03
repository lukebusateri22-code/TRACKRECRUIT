'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, TrendingUp, Award, Target } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'
import { createClient } from '@/lib/supabase/client'

export default function ConferenceContextPage() {
  const [loading, setLoading] = useState(true)
  const [nationalRankings, setNationalRankings] = useState<any>(null)

  useEffect(() => {
    loadNationalRankings()
  }, [])

  const loadNationalRankings = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('national_team_rankings')
        .select('*')
        .order('gender')
      
      if (error) throw error
      setNationalRankings(data)
    } catch (err) {
      console.error('Error loading national rankings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Conference scoring standards
  const conferenceScoringInfo = {
    title: 'NCAA Conference Scoring',
    description: 'Understanding what it takes to score and win at the conference level',
    scoringStandards: [
      {
        place: '1st',
        points: 10,
        description: 'Conference Champion - Top performer in your event',
        color: 'bg-yellow-400'
      },
      {
        place: '2nd',
        points: 8,
        description: 'Runner-up - Elite conference performance',
        color: 'bg-gray-300'
      },
      {
        place: '3rd',
        points: 6,
        description: 'Bronze - Strong conference showing',
        color: 'bg-orange-400'
      },
      {
        place: '4th',
        points: 5,
        description: 'Scoring position',
        color: 'bg-blue-400'
      },
      {
        place: '5th',
        points: 4,
        description: 'Scoring position',
        color: 'bg-blue-300'
      },
      {
        place: '6th',
        points: 3,
        description: 'Scoring position',
        color: 'bg-blue-200'
      },
      {
        place: '7th',
        points: 2,
        description: 'Scoring position',
        color: 'bg-blue-100'
      },
      {
        place: '8th',
        points: 1,
        description: 'Minimum to score - Your goal to contribute to team',
        color: 'bg-green-100'
      }
    ]
  }

  // Top 8 per event example data (would come from athlete's actual data)
  const top8ByEvent = {
    '400m': [
      { rank: 1, name: 'Jordan Davis', school: 'Lincoln HS', time: '48.2s', points: 10, isYou: true },
      { rank: 2, name: 'Marcus Johnson', school: 'Washington HS', time: '48.5s', points: 8, isYou: false },
      { rank: 3, name: 'Tyler Smith', school: 'Roosevelt HS', time: '48.8s', points: 6, isYou: false },
      { rank: 4, name: 'Alex Brown', school: 'Jefferson HS', time: '49.1s', points: 5, isYou: false },
      { rank: 5, name: 'Chris Wilson', school: 'Madison HS', time: '49.3s', points: 4, isYou: false },
      { rank: 6, name: 'Ryan Taylor', school: 'Adams HS', time: '49.5s', points: 3, isYou: false },
      { rank: 7, name: 'Kevin Martinez', school: 'Monroe HS', time: '49.7s', points: 2, isYou: false },
      { rank: 8, name: 'David Garcia', school: 'Jackson HS', time: '49.9s', points: 1, isYou: false }
    ]
  }

  return (
    <RoleGuard allowedRole="athlete">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link
                href="/athletes/profile"
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Conference Context</h1>
                <p className="text-gray-700 mt-1">Understand scoring and rankings</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Conference Scoring Standards */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">{conferenceScoringInfo.title}</h2>
            </div>
            <p className="text-gray-600 mb-6">{conferenceScoringInfo.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {conferenceScoringInfo.scoringStandards.map((standard) => (
                <div key={standard.place} className={`${standard.color} rounded-lg p-4 border-2 border-gray-900`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-gray-900">{standard.place}</span>
                    <span className="text-xl font-bold text-gray-900">{standard.points} pts</span>
                  </div>
                  <p className="text-sm text-gray-800">{standard.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-900 font-medium">
                  Your Goal: Finish in the top 8 to score points for your team at the conference championship!
                </p>
              </div>
            </div>
          </div>

          {/* Top 8 Per Event */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Top 8 in Your Events</h2>
            </div>
            <p className="text-gray-600 mb-6">See where you rank against the competition</p>

            {Object.entries(top8ByEvent).map(([event, rankings]) => (
              <div key={event} className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{event}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-900">
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Rank</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Athlete</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-900">School</th>
                        <th className="text-right py-3 px-4 font-bold text-gray-900">Time</th>
                        <th className="text-right py-3 px-4 font-bold text-gray-900">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.map((athlete) => (
                        <tr 
                          key={athlete.rank} 
                          className={`border-b border-gray-100 ${athlete.isYou ? 'bg-trackrecruit-yellow' : 'hover:bg-gray-50'}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className={`font-bold ${athlete.rank <= 3 ? 'text-xl' : 'text-lg'}`}>
                                {athlete.rank}
                              </span>
                              {athlete.rank === 1 && <Trophy className="w-4 h-4 text-yellow-500 ml-1" />}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`${athlete.isYou ? 'font-black' : 'font-medium'} text-gray-900`}>
                              {athlete.name} {athlete.isYou && '(You)'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{athlete.school}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">{athlete.time}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-black text-gray-900">{athlete.points}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* National College Team Rankings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">National College Team Rankings</h2>
            </div>
            <p className="text-gray-600 mb-6">See which college programs are ranked nationally</p>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading rankings...</p>
              </div>
            ) : nationalRankings && nationalRankings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nationalRankings.map((ranking: any) => (
                  <div key={ranking.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{ranking.gender} Teams</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Last updated: {new Date(ranking.last_updated).toLocaleDateString()}
                    </p>
                    <a
                      href={ranking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View full rankings →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">National rankings will be available soon</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://web4.ustfccca.org/iz/tfri/collection/17387"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    View Men's Rankings
                  </a>
                  <a
                    href="https://web4.ustfccca.org/iz/tfri/collection/17388"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition"
                  >
                    View Women's Rankings
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
