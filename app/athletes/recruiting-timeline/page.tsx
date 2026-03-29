'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, DollarSign, CheckCircle, Clock, AlertCircle, Plus, X } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function RecruitingTimeline() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'deadlines' | 'visits' | 'offers'>('timeline')
  const [showAddModal, setShowAddModal] = useState(false)

  const timelineEvents = [
    {
      id: 1,
      type: 'offer',
      school: 'University of Michigan',
      date: '2026-03-15',
      status: 'pending',
      details: 'Partial scholarship offer - 40% tuition',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 2,
      type: 'visit',
      school: 'Ohio State University',
      date: '2026-04-05',
      status: 'scheduled',
      details: 'Official visit - Meet coaching staff and tour facilities',
      icon: MapPin,
      color: 'blue'
    },
    {
      id: 3,
      type: 'deadline',
      school: 'Penn State University',
      date: '2026-04-15',
      status: 'upcoming',
      details: 'Response deadline for scholarship offer',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      id: 4,
      type: 'visit',
      school: 'University of Illinois',
      date: '2026-02-20',
      status: 'completed',
      details: 'Unofficial visit - Campus tour',
      icon: CheckCircle,
      color: 'gray'
    }
  ]

  const upcomingDeadlines = [
    { school: 'Penn State', deadline: 'April 15, 2026', type: 'Scholarship Response', daysLeft: 19 },
    { school: 'Michigan', deadline: 'May 1, 2026', type: 'Commitment Decision', daysLeft: 35 },
    { school: 'NCAA', deadline: 'April 30, 2026', type: 'Eligibility Center Registration', daysLeft: 34 }
  ]

  const scheduledVisits = [
    { school: 'Ohio State University', date: 'April 5-7, 2026', type: 'Official Visit', status: 'Confirmed' },
    { school: 'University of Wisconsin', date: 'April 12-14, 2026', type: 'Official Visit', status: 'Pending' }
  ]

  const offers = [
    { school: 'University of Michigan', amount: '40% Tuition', value: '$24,000/year', status: 'Active', expires: 'May 1, 2026' },
    { school: 'Indiana University', amount: '50% Tuition', value: '$18,000/year', status: 'Active', expires: 'April 20, 2026' },
    { school: 'Purdue University', amount: 'Full Tuition', value: '$45,000/year', status: 'Declined', expires: 'March 1, 2026' }
  ]

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
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Recruiting Timeline</h1>
            <p className="text-xl text-gray-600">Track your recruiting journey in one place</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'timeline'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'deadlines'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Deadlines
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'visits'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-5 h-5 inline mr-2" />
            Visits
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'offers'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-5 h-5 inline mr-2" />
            Offers
          </button>
        </div>

        {/* Timeline View */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {timelineEvents.map((event) => {
              const Icon = event.icon
              return (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        event.color === 'green' ? 'bg-green-100' :
                        event.color === 'blue' ? 'bg-blue-100' :
                        event.color === 'orange' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          event.color === 'green' ? 'text-green-600' :
                          event.color === 'blue' ? 'text-blue-600' :
                          event.color === 'orange' ? 'text-orange-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{event.school}</h3>
                        <p className="text-gray-600 mb-2">{event.details}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'upcoming' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Deadlines View */}
        {activeTab === 'deadlines' && (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingDeadlines.map((deadline, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{deadline.school}</h3>
                    <p className="text-gray-600">{deadline.type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    deadline.daysLeft <= 7 ? 'bg-red-100 text-red-800' :
                    deadline.daysLeft <= 30 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {deadline.daysLeft} days left
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{deadline.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visits View */}
        {activeTab === 'visits' && (
          <div className="space-y-6">
            {scheduledVisits.map((visit, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{visit.school}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="font-semibold">{visit.date}</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                        {visit.type}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      visit.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offers View */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            {offers.map((offer, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-lg border-2 p-6 ${
                offer.status === 'Active' ? 'border-green-500' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.school}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Scholarship Amount</p>
                        <p className="text-xl font-black text-trackrecruit-yellow">{offer.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Value</p>
                        <p className="text-xl font-black text-gray-900">{offer.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.status}
                      </span>
                      {offer.status === 'Active' && (
                        <span className="text-sm text-gray-600">Expires: {offer.expires}</span>
                      )}
                    </div>
                  </div>
                  {offer.status === 'Active' && (
                    <div className="flex flex-col space-y-2">
                      <button className="px-6 py-2 bg-trackrecruit-yellow text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition">
                        Accept
                      </button>
                      <button className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </RoleGuard>
  )
}
