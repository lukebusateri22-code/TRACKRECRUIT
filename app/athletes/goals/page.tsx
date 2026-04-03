'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Target, TrendingUp, Calendar, Link as LinkIcon, CheckCircle, Clock, BarChart3, Activity } from 'lucide-react'

interface Meet {
  id: string
  name: string
  date: string
  resultsLink: string
  verified: boolean
}

interface EventGoal {
  id: string
  event: string
  targetTime: string
  currentTime: string
  unit: 'time' | 'distance'
  progress: number
  meets: Array<{
    id: string
    performance: string
    date: string
    improvement: number
  }>
}

export default function Goals() {
  const [userRole, setUserRole] = useState<string>('athlete')
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const [showAddMeet, setShowAddMeet] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)

  const [meets, setMeets] = useState<Meet[]>([
    {
      id: '1',
      name: 'State Championships',
      date: '2025-05-17',
      resultsLink: 'https://www.athletic.net/TrackAndField/meet/235875/results',
      verified: true
    },
    {
      id: '2',
      name: 'District Meet',
      date: '2025-05-10',
      resultsLink: 'https://www.milesplit.com/meets/123456/results',
      verified: true
    },
    {
      id: '3',
      name: 'Invitational',
      date: '2025-04-28',
      resultsLink: 'https://www.athletic.net/TrackAndField/meet/234567/results',
      verified: true
    }
  ])

  const [goals, setGoals] = useState<EventGoal[]>([
    {
      id: '1',
      event: '400m',
      targetTime: '47.5',
      currentTime: '48.2',
      unit: 'time',
      progress: 65,
      meets: [
        { id: '1', performance: '48.2', date: '2025-05-17', improvement: 0.3 },
        { id: '2', performance: '48.5', date: '2025-05-10', improvement: 0.1 },
        { id: '3', performance: '48.6', date: '2025-04-28', improvement: 0.2 }
      ]
    },
    {
      id: '2',
      event: '800m',
      targetTime: '1:50.0',
      currentTime: '1:52.8',
      unit: 'time',
      progress: 40,
      meets: [
        { id: '1', performance: '1:52.8', date: '2025-05-10', improvement: 0.5 },
        { id: '2', performance: '1:53.3', date: '2025-04-28', improvement: 0.2 }
      ]
    },
    {
      id: '3',
      event: '200m',
      targetTime: '21.8',
      currentTime: '22.1',
      unit: 'time',
      progress: 55,
      meets: [
        { id: '3', performance: '22.1', date: '2025-04-28', improvement: 0.1 }
      ]
    }
  ])

  const [newMeet, setNewMeet] = useState({
    name: '',
    date: '',
    resultsLink: ''
  })

  const [newGoal, setNewGoal] = useState({
    event: '',
    targetTime: '',
    unit: 'time' as 'time' | 'distance'
  })

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'athlete'
    setUserRole(role)
  }, [])

  const addMeet = () => {
    if (newMeet.name && newMeet.date && newMeet.resultsLink) {
      const meet: Meet = {
        id: Date.now().toString(),
        name: newMeet.name,
        date: newMeet.date,
        resultsLink: newMeet.resultsLink,
        verified: false
      }
      setMeets([meet, ...meets])
      setNewMeet({ name: '', date: '', resultsLink: '' })
      setShowAddMeet(false)
    }
  }

  const addGoal = () => {
    if (newGoal.event && newGoal.targetTime) {
      const goal: EventGoal = {
        id: Date.now().toString(),
        event: newGoal.event,
        targetTime: newGoal.targetTime,
        currentTime: newGoal.targetTime, // Will be updated with actual performances
        unit: newGoal.unit,
        progress: 0,
        meets: []
      }
      setGoals([...goals, goal])
      setNewGoal({ event: '', targetTime: '', unit: 'time' })
      setShowAddGoal(false)
    }
  }

  const verifyMeet = (meetId: string) => {
    setMeets(meets.map(meet => 
      meet.id === meetId ? { ...meet, verified: true } : meet
    ))
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatTime = (time: string) => {
    if (time.includes(':')) return time
    return time
  }

  return (
    
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/athletes" className="flex items-center">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/athletes" className="text-gray-900 font-semibold hover:text-gray-700">Rankings</Link>
                <Link href="/athletes/search-colleges" className="text-gray-900 font-semibold hover:text-gray-700">Find Colleges</Link>
                <Link href="/athletes/recruiting" className="text-gray-900 font-semibold hover:text-gray-700">Recruiting</Link>
                <Link href="/athletes/goals" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Goals</Link>
                <Link href="/athletes/videos" className="text-gray-900 font-semibold hover:text-gray-700">Videos</Link>
                <Link href="/athletes/update-pr" className="text-gray-900 font-semibold hover:text-gray-700">Update PR</Link>
                <Link href="/athletes/settings" className="text-gray-900 font-semibold hover:text-gray-700">Settings</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/athletes" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Goals & Progress</h1>
            <p className="text-xl text-gray-600">Track your performance trends and achieve your targets</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-trackrecruit-yellow" />
                <span className="text-3xl font-black text-gray-900">{goals.length}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Active Goals</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-trackrecruit-yellow" />
                <span className="text-3xl font-black text-gray-900">
                  {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Avg Progress</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-trackrecruit-yellow" />
                <span className="text-3xl font-black text-gray-900">{meets.length}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Meets Tracked</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-trackrecruit-yellow" />
                <span className="text-3xl font-black text-gray-900">
                  {meets.filter(m => m.verified).length}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Verified Results</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Goals List */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Event Goals</h2>
                  <button
                    onClick={() => setShowAddGoal(!showAddGoal)}
                    className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </button>
                </div>

                {/* Add Goal Form */}
                {showAddGoal && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Event (e.g., 400m, Long Jump)"
                        value={newGoal.event}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal({...newGoal, event: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <input
                        type="text"
                        placeholder="Target (e.g., 47.5, 23'0&quot;)"
                        value={newGoal.targetTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal({...newGoal, targetTime: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <select
                        value={newGoal.unit}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewGoal({...newGoal, unit: e.target.value as 'time' | 'distance'})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="time">Time</option>
                        <option value="distance">Distance</option>
                      </select>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={addGoal}
                        className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                      >
                        Add Goal
                      </button>
                      <button
                        onClick={() => setShowAddGoal(false)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Goals */}
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:border-trackrecruit-yellow transition">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{goal.event}</h3>
                          <p className="text-sm text-gray-600">
                            Current: {formatTime(goal.currentTime)} → Target: {formatTime(goal.targetTime)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-gray-900">{goal.progress}%</div>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(goal.progress)} transition-all duration-300`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setActiveEvent(activeEvent === goal.id ? null : goal.id)}
                          className="text-trackrecruit-yellow hover:text-yellow-600 font-medium text-sm flex items-center"
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          {activeEvent === goal.id ? 'Hide Details' : 'View Progress'}
                        </button>
                        <div className="text-sm text-gray-500">
                          {goal.meets.length} performances
                        </div>
                      </div>

                      {/* Detailed Progress */}
                      {activeEvent === goal.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-3">Performance Trend</h4>
                          <div className="space-y-2">
                            {goal.meets.map((meet, index) => (
                              <div key={meet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-xs">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{formatTime(meet.performance)}</p>
                                    <p className="text-xs text-gray-600">{meet.date}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {meet.improvement > 0 && (
                                    <p className="text-sm text-green-600 font-medium">
                                      -{meet.improvement}s
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Simple Progress Chart */}
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-end justify-between h-32">
                              {goal.meets.map((meet, index) => (
                                <div key={meet.id} className="flex flex-col items-center flex-1">
                                  <div 
                                    className="w-8 bg-trackrecruit-yellow rounded-t"
                                    style={{ 
                                      height: `${100 - (index * 20)}%`,
                                      minHeight: '20px'
                                    }}
                                  />
                                  <span className="text-xs text-gray-600 mt-2">
                                    {formatTime(meet.performance)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">Performance Trend (Lower is Better)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meets List */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Meet Results</h2>
                  <button
                    onClick={() => setShowAddMeet(!showAddMeet)}
                    className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Meet
                  </button>
                </div>

                {/* Add Meet Form */}
                {showAddMeet && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Meet Name"
                        value={newMeet.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMeet({...newMeet, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <input
                        type="date"
                        value={newMeet.date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMeet({...newMeet, date: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <input
                        type="url"
                        placeholder="Results Link (Milesplit/Athletic.net)"
                        value={newMeet.resultsLink}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMeet({...newMeet, resultsLink: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={addMeet}
                        className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                      >
                        Add Meet
                      </button>
                      <button
                        onClick={() => setShowAddMeet(false)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Meets */}
                <div className="space-y-3">
                  {meets.map((meet) => (
                    <div key={meet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{meet.name}</h4>
                          <p className="text-sm text-gray-600">{meet.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {meet.verified ? (
                          <span className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => verifyMeet(meet.id)}
                            className="flex items-center text-orange-600 hover:text-orange-700 text-sm"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Verify
                          </button>
                        )}
                        <a
                          href={meet.resultsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        >
                          <LinkIcon className="w-4 h-4 mr-1" />
                          Results
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Target */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Next Target</h3>
                {goals.length > 0 && (
                  <div>
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-xl mx-auto mb-2">
                        <Target className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-gray-900">{goals[0].event}</h4>
                      <p className="text-2xl font-black text-gray-900 mt-1">{formatTime(goals[0].targetTime)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Current: {formatTime(goals[0].currentTime)}</p>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(goals[0].progress)} transition-all duration-300`}
                          style={{ width: `${goals[0].progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{goals[0].progress}% Complete</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {meets.slice(0, 3).map((meet) => (
                    <div key={meet.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{meet.name}</p>
                        <p className="text-xs text-gray-600">{meet.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div className="bg-trackrecruit-yellow rounded-xl shadow-lg border-4 border-gray-900 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Keep Pushing! 🚀</h3>
                <p className="text-gray-800 text-sm">
                  You're making great progress towards your goals. Every performance gets you closer to your targets!
                </p>
                <div className="mt-4 pt-4 border-t-2 border-gray-900">
                  <p className="text-xs text-gray-700">
                    "Success is the sum of small efforts repeated day in and day out."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}
