'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, TrendingUp, Calendar, MapPin, Star, Award, Target, BarChart3, Edit } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function AthleteProfile() {
  const [selectedEvent, setSelectedEvent] = useState('400m')

  const athleteData = {
    name: 'Jordan Davis',
    school: 'Lincoln High School',
    location: 'Los Angeles, CA',
    class: '2027',
    gpa: 3.8,
    sat: 1340,
    height: '6\'1"',
    weight: '165 lbs',
    profileViews: 1247,
    coachMessages: 23
  }

  const events = {
    '400m': {
      pr: '48.2s',
      seasonBest: '48.2s',
      nationalRank: 4,
      stateRank: 1,
      progression: [
        { date: 'Mar 15', time: 50.2, meet: 'Season Opener' },
        { date: 'Mar 29', time: 49.5, meet: 'City Championships' },
        { date: 'Apr 12', time: 49.1, meet: 'Arcadia Invite' },
        { date: 'Apr 28', time: 48.7, meet: 'League Finals' },
        { date: 'May 10', time: 48.5, meet: 'Regionals' },
        { date: 'May 17', time: 48.2, meet: 'State Championships' }
      ],
      meets: [
        { meet: 'State Championship', date: 'May 17, 2025', place: '1st', time: '48.2s', isPR: true },
        { meet: 'Regional Championship', date: 'May 10, 2025', place: '2nd', time: '48.5s', isPR: false },
        { meet: 'League Finals', date: 'Apr 28, 2025', place: '1st', time: '48.7s', isPR: false },
        { meet: 'Arcadia Invitational', date: 'Apr 12, 2025', place: '5th', time: '49.1s', isPR: false }
      ]
    },
    '800m': {
      pr: '1:52.8',
      seasonBest: '1:52.8',
      nationalRank: 12,
      stateRank: 3,
      progression: [
        { date: 'Mar 22', time: 116.5, meet: 'Early Season' },
        { date: 'Apr 5', time: 115.2, meet: 'Invitational' },
        { date: 'Apr 19', time: 114.8, meet: 'League Meet' },
        { date: 'May 3', time: 113.5, meet: 'Pre-Regional' },
        { date: 'May 10', time: 112.8, meet: 'Regionals' }
      ],
      meets: [
        { meet: 'Regional Championship', date: 'May 10, 2025', place: '3rd', time: '1:52.8', isPR: true },
        { meet: 'League Finals', date: 'Apr 19, 2025', place: '2nd', time: '1:54.8', isPR: false },
        { meet: 'Spring Invitational', date: 'Apr 5, 2025', place: '4th', time: '1:55.2', isPR: false }
      ]
    }
  }

  const achievements = [
    { title: 'State Champion - 400m', year: '2025', icon: Trophy },
    { title: 'School Record - 400m', year: '2025', icon: Award },
    { title: 'All-League First Team', year: '2025', icon: Star },
    { title: 'Regional Qualifier', year: '2024, 2025', icon: Target }
  ]

  const currentEvent = events[selectedEvent as keyof typeof events]
  const maxTime = Math.max(...currentEvent.progression.map(p => p.time))
  const minTime = Math.min(...currentEvent.progression.map(p => p.time))

  return (
    <RoleGuard allowedRole="athlete">
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/athletes" className="flex items-center text-gray-900 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <h1 className="text-3xl font-black tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/athletes" className="text-gray-900 font-semibold">Dashboard</Link>
              <Link href="/athletes/profile" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Profile</Link>
              <Link href="/athletes/meets" className="text-gray-900 font-semibold">Meets</Link>
              <Link href="/athletes/rankings" className="text-gray-900 font-semibold">Rankings</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-5xl border-4 border-white">
                JD
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">{athleteData.name}</h1>
                <p className="text-xl text-gray-800 mb-3">{athleteData.school} • Class of {athleteData.class}</p>
                <div className="flex items-center space-x-4 text-gray-800">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {athleteData.location}
                  </span>
                  <span>•</span>
                  <span>{athleteData.height} • {athleteData.weight}</span>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="bg-white px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-600">GPA:</span>
                    <span className="ml-2 font-black text-gray-900">{athleteData.gpa}</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-600">SAT:</span>
                    <span className="ml-2 font-black text-gray-900">{athleteData.sat}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Link href="/athletes/edit" className="bg-gray-900 text-trackrecruit-yellow px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition inline-flex items-center mb-4">
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </Link>
              <div className="space-y-2">
                <div className="bg-white px-4 py-2 rounded-lg">
                  <div className="text-3xl font-black text-gray-900">{athleteData.profileViews}</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg">
                  <div className="text-3xl font-black text-gray-900">{athleteData.coachMessages}</div>
                  <div className="text-sm text-gray-600">Coach Messages</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Selector */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Performance Analysis</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedEvent('400m')}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      selectedEvent === '400m'
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    400m
                  </button>
                  <button
                    onClick={() => setSelectedEvent('800m')}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      selectedEvent === '800m'
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    800m
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-500">
                  <div className="text-sm text-green-800 font-semibold mb-1">Personal Record</div>
                  <div className="text-3xl font-black text-green-900">{currentEvent.pr}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-500">
                  <div className="text-sm text-blue-800 font-semibold mb-1">Season Best</div>
                  <div className="text-3xl font-black text-blue-900">{currentEvent.seasonBest}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-500">
                  <div className="text-sm text-purple-800 font-semibold mb-1">National Rank</div>
                  <div className="text-3xl font-black text-purple-900">#{currentEvent.nationalRank}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-500">
                  <div className="text-sm text-orange-800 font-semibold mb-1">State Rank</div>
                  <div className="text-3xl font-black text-orange-900">#{currentEvent.stateRank}</div>
                </div>
              </div>

              {/* Performance Graph */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Season Progression
                </h3>
                <div className="relative h-64">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-600 font-semibold">
                    <span>{selectedEvent === '400m' ? `${Math.floor(minTime)}s` : `${Math.floor(minTime / 60)}:${String(Math.floor(minTime % 60)).padStart(2, '0')}`}</span>
                    <span>{selectedEvent === '400m' ? `${Math.floor((minTime + maxTime) / 2)}s` : `${Math.floor(((minTime + maxTime) / 2) / 60)}:${String(Math.floor(((minTime + maxTime) / 2) % 60)).padStart(2, '0')}`}</span>
                    <span>{selectedEvent === '400m' ? `${Math.floor(maxTime)}s` : `${Math.floor(maxTime / 60)}:${String(Math.floor(maxTime % 60)).padStart(2, '0')}`}</span>
                  </div>
                  
                  {/* Graph area */}
                  <div className="absolute left-14 right-0 top-0 bottom-8 border-l-2 border-b-2 border-gray-300">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 border-t border-gray-200"></div>
                      <div className="absolute top-1/3 left-0 right-0 border-t border-gray-200"></div>
                      <div className="absolute top-2/3 left-0 right-0 border-t border-gray-200"></div>
                    </div>
                    
                    {/* Line graph */}
                    <svg className="absolute inset-0 w-full h-full">
                      <polyline
                        points={currentEvent.progression.map((point, idx) => {
                          const x = (idx / (currentEvent.progression.length - 1)) * 100
                          const y = ((maxTime - point.time) / (maxTime - minTime)) * 100
                          return `${x}%,${y}%`
                        }).join(' ')}
                        fill="none"
                        stroke="#FFE500"
                        strokeWidth="3"
                      />
                      {currentEvent.progression.map((point, idx) => {
                        const x = (idx / (currentEvent.progression.length - 1)) * 100
                        const y = ((maxTime - point.time) / (maxTime - minTime)) * 100
                        return (
                          <circle
                            key={idx}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="6"
                            fill="#FFE500"
                            stroke="#000"
                            strokeWidth="2"
                          />
                        )
                      })}
                    </svg>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute left-14 right-0 bottom-0 flex justify-between text-xs text-gray-600 font-semibold">
                    {currentEvent.progression.map((point, idx) => (
                      <span key={idx} className="transform -rotate-45 origin-top-left">{point.date}</span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">
                      <span className="font-bold text-green-600">
                        {selectedEvent === '400m' 
                          ? `${(maxTime - minTime).toFixed(1)}s` 
                          : `${Math.floor((maxTime - minTime) / 60)}:${String(Math.floor((maxTime - minTime) % 60)).padStart(2, '0')}`
                        }
                      </span> improvement this season
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meet Results for Selected Event */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Recent {selectedEvent} Results</h3>
              <div className="space-y-4">
                {currentEvent.meets.map((meet, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-trackrecruit-yellow transition">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                        meet.place === '1st' ? 'bg-yellow-400 text-gray-900' :
                        meet.place === '2nd' ? 'bg-gray-300 text-gray-900' :
                        meet.place === '3rd' ? 'bg-orange-400 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {meet.place.replace(/[^\d]/g, '')}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{meet.meet}</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {meet.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-gray-900">{meet.time}</span>
                        {meet.isPR && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">PR</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{meet.place} Place</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-6 h-6 text-trackrecruit-yellow mr-2" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, idx) => {
                  const Icon = achievement.icon
                  return (
                    <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <Icon className="w-5 h-5 text-trackrecruit-yellow mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.year}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Season Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Meets:</span>
                  <span className="font-bold text-gray-900">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">1st Place Finishes:</span>
                  <span className="font-bold text-gray-900">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PRs Set:</span>
                  <span className="font-bold text-green-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-bold text-gray-900">64</span>
                </div>
              </div>
            </div>

            {/* Recruiting Status */}
            <div className="bg-gradient-to-br from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recruiting Status</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-black text-gray-900">18</div>
                  <div className="text-sm text-gray-600">Schools Interested</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-black text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Coach Messages</div>
                </div>
                <Link href="/athletes/eligible-schools" className="block w-full bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold text-center hover:bg-gray-800 transition">
                  View Eligible Schools
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
