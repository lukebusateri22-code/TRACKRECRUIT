'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, TrendingUp, MessageSquare, Calendar, Video, Star, Eye, Target, Search, GraduationCap, X, Mail, Phone, MapPin, Calendar as CalendarIcon, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AthleteDashboard() {
  const [userRole, setUserRole] = useState<string>('athlete')
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Mock user data - in real app this would come from auth context
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    school: 'Lincoln High School',
    graduationYear: '2025',
    location: 'Austin, TX',
    state: 'TX',
    events: ['400m', '800m', 'Long Jump'],
    prs: [
      { event: '400m', time: '48.2', date: '2024-03-15' },
      { event: '800m', time: '1:52.8', date: '2024-03-10' },
      { event: 'Long Jump', distance: '22\'4"', date: '2024-02-28' }
    ],
    gpa: '3.8',
    sat: '1350',
    act: '29',
    bio: 'Dedicated track and field athlete with a passion for competition and academics. Looking to compete at the collegiate level while pursuing a degree in engineering.',
    profileImage: null // Would be URL if they uploaded one
  }

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'athlete'
    setUserRole(role)
  }, [])

  const quickActions = [
    {
      title: 'Find Colleges',
      description: 'Search for colleges that match your profile',
      icon: Search,
      href: '/athletes/search-colleges',
      color: 'bg-blue-500'
    },
    {
      title: 'Update PR',
      description: 'Add your latest personal records',
      icon: Trophy,
      href: '/athletes/update-pr',
      color: 'bg-green-500'
    },
    {
      title: 'Recruiting',
      description: 'Track your recruiting progress',
      icon: GraduationCap,
      href: '/athletes/recruiting',
      color: 'bg-purple-500'
    },
    {
      title: 'Upload Video',
      description: 'Add highlight videos for coaches',
      icon: Video,
      href: '/athletes/videos',
      color: 'bg-red-500'
    },
    {
      title: 'Goals',
      description: 'Set and track performance goals',
      icon: Target,
      href: '/athletes/goals',
      color: 'bg-orange-500'
    },
    {
      title: 'Rankings',
      description: 'View state and national rankings',
      icon: TrendingUp,
      href: '/athletes/rankings',
      color: 'bg-indigo-500'
    }
  ]

  const stats = [
    {
      label: 'NCAA D1 Programs',
      value: '431',
      change: 'Browse rankings',
      icon: Trophy,
      color: 'text-purple-600',
      link: '/athletes/national-rankings'
    },
    {
      label: 'Conferences',
      value: '34+',
      change: 'View all data',
      icon: TrendingUp,
      color: 'text-blue-600',
      link: '/athletes/conference-info'
    },
    {
      label: 'Saved Schools',
      value: '15',
      change: '5 matches',
      icon: Star,
      color: 'text-yellow-600',
      link: '/athletes/search-colleges'
    },
    {
      label: 'Profile Complete',
      value: '92%',
      change: 'Add videos',
      icon: Target,
      color: 'text-orange-600',
      link: '/athletes/settings'
    }
  ]

  const supabase = createClient()
  const [nationalRankings, setNationalRankings] = useState<any[]>([])
  const [loadingRankings, setLoadingRankings] = useState(true)

  useEffect(() => {
    loadNationalRankings()
  }, [])

  const loadNationalRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('national_team_rankings')
        .select('*')
        .eq('gender', 'Men')
        .single()
      
      if (error) throw error
      if (data && (data as any).rankings) {
        setNationalRankings((data as any).rankings.slice(0, 10))
      }
    } catch (err) {
      console.error('Error loading rankings:', err)
    } finally {
      setLoadingRankings(false)
    }
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
                <Link href="/athletes/national-rankings" className="text-gray-900 font-semibold hover:text-gray-700">National Rankings</Link>
                <Link href="/athletes/conference-info" className="text-gray-900 font-semibold hover:text-gray-700">Conference Info</Link>
                <Link href="/athletes/search-colleges" className="text-gray-900 font-semibold hover:text-gray-700">Find Colleges</Link>
                <Link href="/athletes/recruiting" className="text-gray-900 font-semibold hover:text-gray-700">Recruiting</Link>
                <Link href="/athletes/goals" className="text-gray-900 font-semibold hover:text-gray-700">Goals</Link>
                <Link href="/athletes/videos" className="text-gray-900 font-semibold hover:text-gray-700">Videos</Link>
                <Link href="/athletes/update-pr" className="text-gray-900 font-semibold hover:text-gray-700">Update PR</Link>
                <Link href="/athletes/settings" className="text-gray-900 font-semibold hover:text-gray-700">Settings</Link>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-sm hover:bg-gray-800 transition"
                >
                  {userData.profileImage ? (
                    <img src={userData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    `${userData.firstName[0]}${userData.lastName[0]}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-ki py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Athlete Dashboard</h1>
            <p className="text-xl text-gray-600">Manage your recruiting journey</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Link 
                key={index} 
                href={stat.link}
                className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-trackrecruit-yellow transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-3xl font-black text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mr-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">{action.title}</h3>
                  </div>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Conference Info & National Rankings */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Conference Info Widget */}
            <Link href="/athletes/conference-info" className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Conference Info</h3>
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">Learn about conference scoring and see top 8 rankings per event</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">📊 8th place scores • 1st place wins</p>
              </div>
            </Link>

            {/* National Rankings Widget */}
            <Link href="/athletes/national-rankings" className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">College Track Ranking</h3>
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              {loadingRankings ? (
                <p className="text-gray-500">Loading rankings...</p>
              ) : nationalRankings.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-2">Top NCAA D1 Programs:</p>
                  {nationalRankings.slice(0, 5).map((team: any) => (
                    <div key={team.rank} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{team.rank}. {team.team}</span>
                    </div>
                  ))}
                  <p className="text-xs text-blue-600 font-medium mt-3">View all 214 teams →</p>
                </div>
              ) : (
                <p className="text-gray-500">Rankings coming soon</p>
              )}
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Coach from University of Texas viewed your profile</p>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">New message from Coach Smith</p>
                  <span className="text-xs text-gray-500">5h ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Profile completeness increased to 92%</p>
                  <span className="text-xs text-gray-500">1d ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Update PR times</p>
                      <p className="text-xs text-gray-500">After next meet</p>
                    </div>
                  </div>
                  <span className="text-xs text-orange-600 font-medium">Due Soon</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload highlight video</p>
                      <p className="text-xs text-gray-500">State championship</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Optional</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Respond to messages</p>
                      <p className="text-xs text-gray-500">3 unread messages</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Urgent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your College Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-6 mb-8">
                  <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-3xl">
                    {userData.profileImage ? (
                      <img src={userData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      `${userData.firstName[0]}${userData.lastName[0]}`
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {userData.firstName} {userData.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {userData.location}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Class of {userData.graduationYear}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                  </div>
                  <Link
                    href="/athletes/edit"
                    className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    Edit Profile
                  </Link>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-trackrecruit-yellow" />
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {userData.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Phone:</span> {userData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-trackrecruit-yellow" />
                      Academic Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">School:</span> {userData.school}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">GPA:</span> {userData.gpa}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">SAT:</span> {userData.sat}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">ACT:</span> {userData.act}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Events & Personal Records */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-trackrecruit-yellow" />
                    Events & Personal Records
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {userData.prs.map((pr, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <h5 className="font-bold text-gray-900 mb-1">{pr.event}</h5>
                        <p className="text-lg font-black text-trackrecruit-yellow mb-1">
                          {pr.time || pr.distance}
                        </p>
                        <p className="text-sm text-gray-500">{pr.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Visibility Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is the profile that college coaches will see when they view your information. 
                    Keep it updated and professional to make the best impression.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}
