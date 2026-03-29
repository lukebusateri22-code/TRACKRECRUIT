'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, MessageSquare, Trophy, UserPlus, Calendar, Filter, Eye, Award, Heart, Share2 } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function NewsFeed() {
  const [filter, setFilter] = useState<'all' | 'schools' | 'athletes' | 'achievements'>('all')

  const feedItems = [
    {
      id: 1,
      type: 'school_interest',
      school: 'University of Michigan',
      action: 'viewed your profile',
      time: '2 hours ago',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 2,
      type: 'message',
      school: 'Ohio State University',
      action: 'sent you a message',
      time: '5 hours ago',
      icon: MessageSquare,
      color: 'green'
    },
    {
      id: 3,
      type: 'achievement',
      athlete: 'Marcus Lee',
      action: 'set a new PR in 100m (10.8s)',
      time: '1 day ago',
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'school_update',
      school: 'Penn State University',
      action: 'updated their recruiting requirements',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 5,
      type: 'connection',
      athlete: 'Alex Rivera',
      action: 'accepted your connection request',
      time: '2 days ago',
      icon: Award,
      color: 'green'
    },
    {
      id: 6,
      type: 'achievement',
      athlete: 'Jordan Davis',
      action: 'won State Championship 400m',
      time: '3 days ago',
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: 7,
      type: 'school_interest',
      school: 'University of Illinois',
      action: 'added you to their watchlist',
      time: '3 days ago',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 8,
      type: 'meet',
      meet: 'Regional Championship',
      action: 'Results posted - You placed 1st in 400m',
      time: '4 days ago',
      icon: Calendar,
      color: 'orange'
    }
  ]

  const filteredItems = filter === 'all' ? feedItems : feedItems.filter(item => {
    if (filter === 'schools') return item.type === 'school_interest' || item.type === 'school_update' || item.type === 'message'
    if (filter === 'athletes') return item.type === 'connection'
    if (filter === 'achievements') return item.type === 'achievement' || item.type === 'meet'
    return true
  })

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Activity Feed</h1>
          <p className="text-xl text-gray-600">Stay updated on your recruiting journey</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
              filter === 'all'
                ? 'bg-trackrecruit-yellow text-gray-900'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-trackrecruit-yellow'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter('schools')}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
              filter === 'schools'
                ? 'bg-trackrecruit-yellow text-gray-900'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-trackrecruit-yellow'
            }`}
          >
            School Updates
          </button>
          <button
            onClick={() => setFilter('athletes')}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
              filter === 'athletes'
                ? 'bg-trackrecruit-yellow text-gray-900'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-trackrecruit-yellow'
            }`}
          >
            Network
          </button>
          <button
            onClick={() => setFilter('achievements')}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
              filter === 'achievements'
                ? 'bg-trackrecruit-yellow text-gray-900'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-trackrecruit-yellow'
            }`}
          >
            Achievements
          </button>
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.color === 'blue' ? 'bg-blue-100' :
                    item.color === 'green' ? 'bg-green-100' :
                    item.color === 'yellow' ? 'bg-yellow-100' :
                    item.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      item.color === 'blue' ? 'text-blue-600' :
                      item.color === 'green' ? 'text-green-600' :
                      item.color === 'yellow' ? 'text-yellow-600' :
                      item.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">
                      <span className="font-bold">{item.school || item.athlete || item.meet}</span>
                      {' '}{item.action}
                    </p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Heart className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
    </RoleGuard>
  )
}
