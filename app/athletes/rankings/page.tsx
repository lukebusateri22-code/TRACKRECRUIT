'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Trophy, Filter } from 'lucide-react'

export default function AthleteRankings() {
  const [selectedEvent, setSelectedEvent] = useState('400m')
  const [selectedClass, setSelectedClass] = useState('2027')
  const [selectedState, setSelectedState] = useState('All States')
  const [viewType, setViewType] = useState<'national' | 'state'>('national')

  const rankings = {
    '100m': [
      { rank: 1, name: 'Marcus Thompson', school: 'IMG Academy', time: '10.3s', location: 'FL', trend: 'up' },
      { rank: 2, name: 'Jayden Brown', school: 'DeSoto', time: '10.4s', location: 'TX', trend: 'same' },
      { rank: 3, name: 'Chris Lee', school: 'Long Beach Poly', time: '10.5s', location: 'CA', trend: 'up' },
      { rank: 4, name: 'Tyler Johnson', school: 'Oak Park', time: '10.6s', location: 'MI', trend: 'down' },
      { rank: 5, name: 'Andre Williams', school: 'Duncanville', time: '10.7s', location: 'TX', trend: 'up' }
    ],
    '200m': [
      { rank: 1, name: 'Brandon Smith', school: 'Mater Dei', time: '20.8s', location: 'CA', trend: 'up' },
      { rank: 2, name: 'Kevin Martinez', school: 'Strake Jesuit', time: '21.1s', location: 'TX', trend: 'same' },
      { rank: 3, name: 'Jordan Davis', school: 'Lincoln High', time: '22.1s', location: 'CA', trend: 'up', isYou: true },
      { rank: 4, name: 'Alex Rivera', school: 'Westlake', time: '21.3s', location: 'GA', trend: 'up' },
      { rank: 5, name: 'Tyler Brown', school: 'Carmel', time: '21.4s', location: 'IN', trend: 'down' }
    ],
    '400m': [
      { rank: 1, name: 'Michael Thompson', school: 'Long Beach Poly', time: '46.8s', location: 'CA', trend: 'up' },
      { rank: 2, name: 'David Martinez', school: 'DeSoto High', time: '47.1s', location: 'TX', trend: 'same' },
      { rank: 3, name: 'Chris Johnson', school: 'Oak Park', time: '47.4s', location: 'MI', trend: 'up' },
      { rank: 4, name: 'Jordan Davis', school: 'Lincoln High', time: '48.2s', location: 'CA', trend: 'up', isYou: true },
      { rank: 5, name: 'Tyler Brown', school: 'Westlake', time: '48.3s', location: 'GA', trend: 'down' },
      { rank: 6, name: 'Alex Rivera', school: 'Mountain View', time: '48.5s', location: 'AZ', trend: 'up' },
      { rank: 7, name: 'James Wilson', school: 'Central', time: '48.6s', location: 'FL', trend: 'same' },
      { rank: 8, name: 'Marcus Lee', school: 'North Shore', time: '48.7s', location: 'NY', trend: 'down' },
      { rank: 9, name: 'Brandon Chen', school: 'Arcadia', time: '48.8s', location: 'CA', trend: 'up' },
      { rank: 10, name: 'Ryan Foster', school: 'Jesuit', time: '48.9s', location: 'OR', trend: 'same' }
    ],
    '800m': [
      { rank: 1, name: 'Ryan Foster', school: 'Jesuit', time: '1:49.2', location: 'OR', trend: 'up' },
      { rank: 2, name: 'Sam Peterson', school: 'Carmel', time: '1:50.1', location: 'IN', trend: 'same' },
      { rank: 3, name: 'Jake Williams', school: 'Newbury Park', time: '1:50.8', location: 'CA', trend: 'up' },
      { rank: 4, name: 'Jordan Davis', school: 'Lincoln High', time: '1:52.8', location: 'CA', trend: 'up', isYou: true },
      { rank: 5, name: 'Daniel Kim', school: 'Monta Vista', time: '1:53.1', location: 'CA', trend: 'same' },
      { rank: 6, name: 'Alex Martinez', school: 'Strake Jesuit', time: '1:53.4', location: 'TX', trend: 'up' },
      { rank: 7, name: 'Brandon Lee', school: 'Great Oak', time: '1:53.7', location: 'CA', trend: 'down' },
      { rank: 8, name: 'Tyler Johnson', school: 'Wayzata', time: '1:54.0', location: 'MN', trend: 'up' }
    ],
    '1500m': [
      { rank: 1, name: 'Colin Sahlman', school: 'Newbury Park', time: '3:52.8', location: 'CA', trend: 'up' },
      { rank: 2, name: 'Leo Young', school: 'Newbury Park', time: '3:54.2', location: 'CA', trend: 'same' },
      { rank: 3, name: 'Aaron Sahlman', school: 'Newbury Park', time: '3:55.1', location: 'CA', trend: 'up' },
      { rank: 4, name: 'Drew Bosley', school: 'American Fork', time: '3:56.3', location: 'UT', trend: 'up' },
      { rank: 5, name: 'Jake Williams', school: 'Carmel', time: '3:57.2', location: 'IN', trend: 'down' }
    ],
    '110mH': [
      { rank: 1, name: 'Marcus Williams', school: 'IMG Academy', time: '13.5s', location: 'FL', trend: 'up' },
      { rank: 2, name: 'Jordan Smith', school: 'Duncanville', time: '13.7s', location: 'TX', trend: 'same' },
      { rank: 3, name: 'Tyler Brown', school: 'Oak Park', time: '13.9s', location: 'MI', trend: 'up' },
      { rank: 4, name: 'Chris Johnson', school: 'Long Beach Poly', time: '14.1s', location: 'CA', trend: 'down' },
      { rank: 5, name: 'Alex Martinez', school: 'Westlake', time: '14.2s', location: 'GA', trend: 'up' }
    ],
    'Long Jump': [
      { rank: 1, name: 'Jayden Brown', school: 'DeSoto', distance: '25\'2"', location: 'TX', trend: 'up' },
      { rank: 2, name: 'Marcus Lee', school: 'Long Beach Poly', distance: '24\'10"', location: 'CA', trend: 'same' },
      { rank: 3, name: 'Tyler Johnson', school: 'Oak Park', distance: '24\'6"', location: 'MI', trend: 'up' },
      { rank: 4, name: 'Chris Williams', school: 'IMG Academy', distance: '24\'3"', location: 'FL', trend: 'down' },
      { rank: 5, name: 'Alex Rivera', school: 'Westlake', distance: '24\'0"', location: 'GA', trend: 'up' }
    ]
  }

  let currentRankings = rankings[selectedEvent as keyof typeof rankings] || []
  
  // Filter by state if selected
  if (selectedState !== 'All States') {
    currentRankings = currentRankings.filter(r => r.location === selectedState)
    // Re-rank after filtering
    currentRankings = currentRankings.map((r, idx) => ({ ...r, rank: idx + 1 }))
  }
  
  const yourRanking = currentRankings.find(r => r.isYou)
  const availableStates = ['All States', ...new Set(rankings[selectedEvent as keyof typeof rankings]?.map(r => r.location) || [])]

  return (
    
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
              <Link href="/athletes/meets" className="text-gray-900 font-semibold">Meets</Link>
              <Link href="/athletes/rankings" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Rankings</Link>
              <Link href="/search" className="text-gray-900 font-semibold">Find Colleges</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">National Rankings</h1>
          <p className="text-xl text-gray-600">See where you stack up against the competition</p>
        </div>

        {/* Your Ranking Highlight */}
        {yourRanking && (
          <div className="bg-gradient-to-r from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">YOUR NATIONAL RANKING</p>
                <h2 className="text-5xl font-black text-gray-900 mb-2">#{yourRanking.rank}</h2>
                <p className="text-xl font-bold text-gray-900">{selectedEvent} • Class of {selectedClass}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-gray-900 mb-2">{yourRanking.time}</div>
                <div className="flex items-center justify-end">
                  {yourRanking.trend === 'up' && (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Moving Up!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-600 mr-2" />
              <span className="font-bold text-gray-900 mr-4">Filter Rankings:</span>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mr-2">Event:</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none"
              >
                <option value="100m">100m</option>
                <option value="200m">200m</option>
                <option value="400m">400m</option>
                <option value="800m">800m</option>
                <option value="1500m">1500m</option>
                <option value="110mH">110m Hurdles</option>
                <option value="Long Jump">Long Jump</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mr-2">Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none"
              >
                <option value="2025">Class of 2025</option>
                <option value="2026">Class of 2026</option>
                <option value="2027">Class of 2027</option>
                <option value="2028">Class of 2028</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mr-2">State:</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none"
              >
                {availableStates.map(state => (
                  <option key={state} value={state}>{state === 'All States' ? 'National' : state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rankings List */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {selectedEvent} Rankings - {selectedState === 'All States' ? 'National' : selectedState} - Class of {selectedClass}
            </h2>
            <span className="text-sm font-semibold opacity-80">Updated: May 20, 2025</span>
          </div>

          <div className="divide-y divide-gray-200">
            {currentRankings.map((athlete, idx) => (
              <div
                key={idx}
                className={`p-6 flex items-center justify-between hover:bg-gray-50 transition ${
                  athlete.isYou ? 'bg-trackrecruit-yellow bg-opacity-20 border-l-4 border-trackrecruit-yellow' : ''
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl ${
                    athlete.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                    athlete.rank === 2 ? 'bg-gray-300 text-gray-900' :
                    athlete.rank === 3 ? 'bg-orange-400 text-white' :
                    athlete.isYou ? 'bg-trackrecruit-yellow text-gray-900' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {athlete.rank}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-900">{athlete.name}</h3>
                      {athlete.isYou && (
                        <span className="bg-trackrecruit-yellow text-gray-900 px-3 py-1 rounded-full text-xs font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{athlete.school} • {athlete.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900">{athlete.time || athlete.distance}</div>
                    <p className="text-sm text-gray-600">Personal Record</p>
                  </div>
                  
                  <div className="w-12 flex justify-center">
                    {athlete.trend === 'up' && (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    )}
                    {athlete.trend === 'down' && (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                    {athlete.trend === 'same' && (
                      <Minus className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <Trophy className="w-8 h-8 text-trackrecruit-yellow mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Top 5 Goal</h3>
            <p className="text-gray-600 mb-3">You're currently #{yourRanking?.rank}. To break into the top 5, you need to run:</p>
            <div className="text-3xl font-black text-trackrecruit-yellow">47.4s</div>
            <p className="text-sm text-gray-600 mt-1">0.8s improvement needed</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Progress</h3>
            <p className="text-gray-600 mb-3">You've improved your ranking by:</p>
            <div className="text-3xl font-black text-green-600">+3 spots</div>
            <p className="text-sm text-gray-600 mt-1">Since last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <Trophy className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recruiting Impact</h3>
            <p className="text-gray-600 mb-3">Your ranking qualifies you for:</p>
            <div className="text-3xl font-black text-blue-600">18</div>
            <p className="text-sm text-gray-600 mt-1">D1 programs</p>
          </div>
        </div>
      </div>
    </div>
    
  )
}
