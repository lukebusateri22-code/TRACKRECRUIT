'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MessageSquare, Download, ChevronRight, Settings } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function CoachDashboard() {
  const [coachConference, setCoachConference] = useState('')
  const [showConferenceSetup, setShowConferenceSetup] = useState(false)

  useEffect(() => {
    // Check if coach has conference set up
    const savedConference = localStorage.getItem('coachConference')
    if (!savedConference) {
      setShowConferenceSetup(true)
    } else {
      setCoachConference(savedConference)
    }
  }, [])

  const saveConference = (conference: string) => {
    localStorage.setItem('coachConference', conference)
    setCoachConference(conference)
    setShowConferenceSetup(false)
  }

  const conferences = [
    'ACC', 'Big Ten', 'Big 12', 'Pac-12', 'SEC', 'American', 'Atlantic 10',
    'Big East', 'Big Sky', 'Big South', 'Big West', 'CAA', 'C-USA',
    'Horizon', 'Ivy League', 'MAAC', 'MAC', 'MEAC', 'Missouri Valley',
    'Mountain West', 'Northeast', 'Ohio Valley', 'Patriot League',
    'Southern', 'Southland', 'Summit League', 'Sun Belt', 'SWAC',
    'The Summit', 'WAC', 'WCC'
  ]

  const newMatches = [
    { name: 'Sarah Johnson', event: '1500m', pr: '4:32.1', gpa: 3.9, location: 'Boston, MA', match: 95 },
    { name: 'Marcus Williams', event: '110mH', pr: '14.2s', gpa: 3.6, location: 'Atlanta, GA', match: 92 },
    { name: 'Emily Chen', event: 'LJ', pr: '19\'8"', gpa: 4.0, location: 'San Diego, CA', match: 88 },
    { name: 'Jordan Davis', event: '400m', pr: '48.2s', gpa: 3.8, location: 'Chicago, IL', match: 86 },
    { name: 'Tyler Washington', event: '400mH', pr: '53.8s', gpa: 3.5, location: 'Miami, FL', match: 84 }
  ]

  const recentActivity = [
    { athlete: 'Jordan Davis', action: 'Updated 400m PR to 48.2s', time: '2h ago' },
    { athlete: 'Sarah Johnson', action: 'Sent you a message', time: '4h ago' },
    { athlete: 'Marcus Williams', action: 'Viewed your profile', time: '6h ago' },
    { athlete: 'Emily Chen', action: 'Added to favorites', time: '1d ago' }
  ]

  return (
    <RoleGuard allowedRole="coach">
      <div className="min-h-screen bg-gray-50">
        {/* Conference Setup Modal */}
        {showConferenceSetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to TrackRecruit!</h2>
              <p className="text-gray-600 mb-6">
                To get started, please select your athletic conference. This will help us provide you with relevant conference data and analytics.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Conference</label>
                <select
                  onChange={(e) => saveConference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">Select your conference...</option>
                  {conferences.map(conf => (
                    <option key={conf} value={conf}>{conf}</option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>✓ Automatic weekly conference data updates</p>
                <p>✓ Conference-specific athlete recommendations</p>
                <p>✓ Competition analysis and insights</p>
              </div>
            </div>
          </div>
        )}

        {/* Simple Header */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/coaches/dashboard" className="flex items-center">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/coaches/dashboard" className="text-gray-900 font-semibold hover:text-gray-700">Dashboard</Link>
                <Link href="/coaches/conference-analytics" className="text-gray-900 font-semibold hover:text-gray-700">Conference Analytics</Link>
                <Link href="/coaches/search" className="text-gray-900 font-semibold hover:text-gray-700">Search Athletes</Link>
                <Link href="/coaches/messages" className="text-gray-900 font-semibold hover:text-gray-700">Messages</Link>
                {coachConference && (
                  <span className="px-3 py-1 bg-gray-900 text-trackrecruit-yellow rounded-full text-sm font-bold">
                    {coachConference}
                  </span>
                )}
                <button 
                  onClick={() => {
                    localStorage.removeItem('userRole')
                    window.location.href = '/home'
                  }}
                  className="text-gray-900 font-semibold hover:text-gray-700"
                >
                  Logout
                </button>
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold cursor-pointer">
                  CA
                </div>
              </div>
            </div>
          </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats - Simple */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="border-2 border-gray-200 rounded p-4">
            <div className="text-3xl font-bold text-gray-900">247</div>
            <div className="text-sm text-gray-600">Athletes Watched</div>
          </div>
          <div className="border-2 border-gray-200 rounded p-4">
            <div className="text-3xl font-bold text-gray-900">34</div>
            <div className="text-sm text-gray-600">Top Prospects</div>
          </div>
          <div className="border-2 border-gray-200 rounded p-4">
            <div className="text-3xl font-bold text-orange-600">15</div>
            <div className="text-sm text-gray-600">Active Conversations</div>
          </div>
          <div className="border-2 border-gray-200 rounded p-4">
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">2027 Commits</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* New Matches - Table Style */}
          <div className="col-span-2">
            <div className="border-2 border-gray-200 rounded">
              <div className="border-b-2 border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">New Matches (5)</h2>
                  <Link href="/coaches/search" className="text-sm text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold text-gray-600 uppercase">
                    <th className="px-4 py-2">Athlete</th>
                    <th className="px-4 py-2">Event</th>
                    <th className="px-4 py-2">PR</th>
                    <th className="px-4 py-2">GPA</th>
                    <th className="px-4 py-2">Match</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {newMatches.map((athlete, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{athlete.name}</div>
                        <div className="text-xs text-gray-500">{athlete.location}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{athlete.event}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{athlete.pr}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{athlete.gpa}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-green-600">{athlete.match}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/athletes/${athlete.name.toLowerCase().replace(' ', '-')}`} className="text-blue-600 hover:underline text-sm">
                          View <ChevronRight className="w-3 h-3 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Activity - Simple List */}
            <div className="border-2 border-gray-200 rounded mt-6">
              <div className="border-b-2 border-gray-200 px-4 py-3 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">{activity.athlete}</span>
                      <span className="text-gray-600"> {activity.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="border-2 border-gray-200 rounded">
              <div className="border-b-2 border-gray-200 px-4 py-3 bg-gray-50">
                <h3 className="font-bold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <Link href="/coaches/search" className="block w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 text-center">
                  Search Athletes
                </Link>
                <Link href="/coaches/messages" className="block w-full px-4 py-2 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 text-center">
                  View Messages
                </Link>
                <Link href="/coaches/preferences" className="block w-full px-4 py-2 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 text-center">
                  Edit Preferences
                </Link>
                <button className="block w-full px-4 py-2 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 text-center">
                  <Download className="w-4 h-4 inline mr-2" />
                  Export Data
                </button>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded">
              <div className="border-b-2 border-gray-200 px-4 py-3 bg-gray-50">
                <h3 className="font-bold text-gray-900">Class of 2027</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Committed:</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">In Pipeline:</span>
                    <span className="font-bold text-gray-900">34</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scholarships Left:</span>
                    <span className="font-bold text-gray-900">4.2</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded">
              <div className="border-b-2 border-gray-200 px-4 py-3 bg-gray-50">
                <h3 className="font-bold text-gray-900">Filters Active</h3>
              </div>
              <div className="p-4 text-sm text-gray-600">
                <p className="mb-2">• 400m: &lt; 49.0s</p>
                <p className="mb-2">• 800m: &lt; 1:55.0</p>
                <p className="mb-2">• Min GPA: 3.5</p>
                <p className="mb-2">• Class: 2026-2027</p>
                <Link href="/coaches/preferences" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                  Edit Filters →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </RoleGuard>
  )
}
