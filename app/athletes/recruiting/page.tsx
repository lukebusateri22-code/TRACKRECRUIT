'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar, DollarSign, MapPin, Trophy, Star, CheckCircle, XCircle, Clock, TrendingUp, Users, GraduationCap } from 'lucide-react'

interface School {
  id: string
  name: string
  conference: string
  division: string
  location: string
  cost: string
  offerStatus: 'offered' | 'interested' | 'applied' | 'no-response'
  deadline: string
  ranking: number
  logo: string
}

interface TimelineEvent {
  id: string
  school: string
  action: string
  date: string
  type: 'offer' | 'visit' | 'application' | 'contact' | 'deadline'
}

export default function Recruiting() {
  const [userRole, setUserRole] = useState<string>('athlete')
  const [activeView, setActiveView] = useState<'timeline' | 'compare'>('timeline')
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [showAddSchool, setShowAddSchool] = useState(false)

  const [schools, setSchools] = useState<School[]>([
    {
      id: '1',
      name: 'University of Michigan',
      conference: 'Big Ten',
      division: 'D1',
      location: 'Ann Arbor, MI',
      cost: '$31,000/year',
      offerStatus: 'offered',
      deadline: '2025-11-15',
      ranking: 1,
      logo: 'UM'
    },
    {
      id: '2',
      name: 'Ohio State University',
      conference: 'Big Ten',
      division: 'D1',
      location: 'Columbus, OH',
      cost: '$29,000/year',
      offerStatus: 'interested',
      deadline: '2025-12-01',
      ranking: 2,
      logo: 'OSU'
    },
    {
      id: '3',
      name: 'University of Oregon',
      conference: 'Pac-12',
      division: 'D1',
      location: 'Eugene, OR',
      cost: '$35,000/year',
      offerStatus: 'applied',
      deadline: '2025-11-30',
      ranking: 3,
      logo: 'UO'
    },
    {
      id: '4',
      name: 'University of Florida',
      conference: 'SEC',
      division: 'D1',
      location: 'Gainesville, FL',
      cost: '$28,000/year',
      offerStatus: 'no-response',
      deadline: '2025-12-15',
      ranking: 4,
      logo: 'UF'
    },
    {
      id: '5',
      name: 'Stanford University',
      conference: 'Pac-12',
      division: 'D1',
      location: 'Stanford, CA',
      cost: '$56,000/year',
      offerStatus: 'interested',
      deadline: '2025-11-20',
      ranking: 5,
      logo: 'SU'
    }
  ])

  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: '1',
      school: 'University of Michigan',
      action: 'Received athletic scholarship offer',
      date: '2025-10-15',
      type: 'offer'
    },
    {
      id: '2',
      school: 'University of Oregon',
      action: 'Submitted application',
      date: '2025-10-10',
      type: 'application'
    },
    {
      id: '3',
      school: 'Ohio State University',
      action: 'Coach expressed interest',
      date: '2025-10-05',
      type: 'contact'
    },
    {
      id: '4',
      school: 'University of Florida',
      action: 'Application deadline approaching',
      date: '2025-12-15',
      type: 'deadline'
    }
  ])

  const [newSchool, setNewSchool] = useState({
    name: '',
    conference: '',
    division: '',
    location: '',
    cost: '',
    deadline: ''
  })

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'athlete'
    setUserRole(role)
  }, [])

  const toggleSchoolSelection = (schoolId: string) => {
    setSelectedSchools(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    )
  }

  const addSchool = () => {
    if (newSchool.name && newSchool.conference && newSchool.division) {
      const school: School = {
        id: Date.now().toString(),
        name: newSchool.name,
        conference: newSchool.conference,
        division: newSchool.division,
        location: newSchool.location,
        cost: newSchool.cost,
        offerStatus: 'interested',
        deadline: newSchool.deadline,
        ranking: schools.length + 1,
        logo: newSchool.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      }
      
      setSchools([...schools, school])
      
      // Add to timeline
      const timelineEvent: TimelineEvent = {
        id: Date.now().toString(),
        school: newSchool.name,
        action: 'Added to recruiting list',
        date: new Date().toISOString().split('T')[0],
        type: 'contact'
      }
      setTimeline([timelineEvent, ...timeline])
      
      setNewSchool({ name: '', conference: '', division: '', location: '', cost: '', deadline: '' })
      setShowAddSchool(false)
    }
  }

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'offered': return 'bg-green-100 text-green-800'
      case 'interested': return 'bg-blue-100 text-blue-800'
      case 'applied': return 'bg-yellow-100 text-yellow-800'
      case 'no-response': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'offer': return <Trophy className="w-4 h-4" />
      case 'visit': return <MapPin className="w-4 h-4" />
      case 'application': return <GraduationCap className="w-4 h-4" />
      case 'contact': return <Users className="w-4 h-4" />
      case 'deadline': return <Clock className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'offer': return 'bg-green-100 text-green-800 border-green-200'
      case 'visit': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'application': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'contact': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const selectedSchoolsData = schools.filter(s => selectedSchools.includes(s.id))

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
                <Link href="/athletes/recruiting" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Recruiting</Link>
                <Link href="/athletes/goals" className="text-gray-900 font-semibold hover:text-gray-700">Goals</Link>
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
            <h1 className="text-4xl font-black text-gray-900 mb-2">Recruiting</h1>
            <p className="text-xl text-gray-600">Track your recruiting journey and compare schools</p>
          </div>

          {/* View Toggle */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6 inline-flex">
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeView === 'timeline' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Timeline & Rankings
            </button>
            <button
              onClick={() => setActiveView('compare')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeView === 'compare' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Compare Schools
            </button>
          </div>

          {activeView === 'timeline' ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Timeline */}
              <div className="lg:col-span-2 space-y-6">
                {/* Add School Button */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recruiting Timeline</h2>
                    <button
                      onClick={() => setShowAddSchool(!showAddSchool)}
                      className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add School
                    </button>
                  </div>

                  {/* Add School Form */}
                  {showAddSchool && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="School Name"
                          value={newSchool.name}
                          onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="Conference (e.g., Big Ten)"
                          value={newSchool.conference}
                          onChange={(e) => setNewSchool({...newSchool, conference: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="Division (e.g., D1, D2, D3)"
                          value={newSchool.division}
                          onChange={(e) => setNewSchool({...newSchool, division: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={newSchool.location}
                          onChange={(e) => setNewSchool({...newSchool, location: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="Annual Cost"
                          value={newSchool.cost}
                          onChange={(e) => setNewSchool({...newSchool, cost: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                        <input
                          type="date"
                          value={newSchool.deadline}
                          onChange={(e) => setNewSchool({...newSchool, deadline: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={addSchool}
                          className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                        >
                          Add School
                        </button>
                        <button
                          onClick={() => setShowAddSchool(false)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timeline Events */}
                  <div className="space-y-4">
                    {timeline.map((event) => (
                      <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-gray-900">{event.school}</h4>
                            <span className="text-sm text-gray-500">{event.date}</span>
                          </div>
                          <p className="text-gray-700 mt-1">{event.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 10 Rankings */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Your Top Schools Ranking</h2>
                  <div className="space-y-3">
                    {schools.slice(0, 10).map((school, index) => (
                      <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{school.name}</h4>
                            <p className="text-sm text-gray-600">{school.conference} • {school.division}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOfferStatusColor(school.offerStatus)}`}>
                            {school.offerStatus.replace('-', ' ')}
                          </span>
                          {school.deadline && (
                            <span className="text-sm text-gray-500">
                              Due: {school.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recruiting Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Schools Tracking</span>
                      <span className="font-bold text-gray-900">{schools.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Offers Received</span>
                      <span className="font-bold text-green-600">
                        {schools.filter(s => s.offerStatus === 'offered').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Applications Sent</span>
                      <span className="font-bold text-blue-600">
                        {schools.filter(s => s.offerStatus === 'applied').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Upcoming Deadlines</span>
                      <span className="font-bold text-orange-600">
                        {schools.filter(s => s.deadline && new Date(s.deadline) > new Date()).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
                  <div className="space-y-3">
                    {schools
                      .filter(s => s.deadline && new Date(s.deadline) > new Date())
                      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                      .slice(0, 5)
                      .map((school) => (
                        <div key={school.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{school.name}</p>
                              <p className="text-xs text-gray-600">{school.conference}</p>
                            </div>
                            <span className="text-sm font-bold text-red-600">
                              {school.deadline}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Compare Schools View */
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Compare Schools</h2>
                <p className="text-gray-600 mb-4">Select schools to compare side by side</p>
                
                {/* School Selection */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {schools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => toggleSchoolSelection(school.id)}
                      className={`p-4 rounded-lg border-2 transition ${
                        selectedSchools.includes(school.id)
                          ? 'border-trackrecruit-yellow bg-yellow-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-xs">
                          {school.logo}
                        </div>
                        {selectedSchools.includes(school.id) && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm text-left">{school.name}</h4>
                      <p className="text-xs text-gray-600 text-left">{school.conference}</p>
                    </button>
                  ))}
                </div>

                {selectedSchools.length > 0 && (
                  <button
                    onClick={() => setActiveView('timeline')}
                    className="bg-trackrecruit-yellow text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    Back to Timeline
                  </button>
                )}
              </div>

              {/* Comparison Table */}
              {selectedSchools.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Feature</th>
                        {selectedSchoolsData.map((school) => (
                          <th key={school.id} className="text-center py-3 px-4 font-bold text-gray-900">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-sm mb-2">
                                {school.logo}
                              </div>
                              {school.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-700">Conference</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center text-gray-900">{school.conference}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-700">Division</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center text-gray-900">{school.division}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-700">Location</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center text-gray-900">{school.location}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-700">Annual Cost</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center text-gray-900">{school.cost}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-700">Your Ranking</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-trackrecruit-yellow rounded-full font-bold text-sm">
                              {school.ranking}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-700">Offer Status</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOfferStatusColor(school.offerStatus)}`}>
                              {school.offerStatus.replace('-', ' ')}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-gray-700">Deadline</td>
                        {selectedSchoolsData.map((school) => (
                          <td key={school.id} className="py-3 px-4 text-center text-gray-900">{school.deadline}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedSchools.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Select Schools to Compare</h3>
                  <p className="text-gray-600">Choose 2 or more schools from the list above to see detailed comparisons</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    
  )
}
