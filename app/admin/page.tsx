'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, TrendingUp, AlertCircle, CheckCircle, BarChart3, MessageSquare, Shield, Eye, Ban, Search } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  const stats = {
    totalUsers: 2847,
    athletes: 2156,
    coaches: 691,
    verifiedUsers: 2103,
    pendingVerification: 127,
    activeToday: 456,
    messagesLast24h: 1234,
    profileViews: 8932
  }

  const recentUsers = [
    { id: 1, name: 'Jordan Davis', role: 'athlete', email: 'jordan@school.edu', status: 'verified', joined: '2h ago' },
    { id: 2, name: 'Coach Williams', role: 'coach', email: 'williams@university.edu', status: 'pending', joined: '4h ago' },
    { id: 3, name: 'Sarah Johnson', role: 'athlete', email: 'sarah@school.edu', status: 'verified', joined: '6h ago' },
    { id: 4, name: 'Coach Martinez', role: 'coach', email: 'martinez@college.edu', status: 'verified', joined: '8h ago' },
    { id: 5, name: 'Marcus Lee', role: 'athlete', email: 'marcus@school.edu', status: 'pending', joined: '10h ago' }
  ]

  const flaggedContent = [
    { id: 1, type: 'profile', user: 'John Smith', reason: 'Inappropriate content', severity: 'high', date: '1h ago' },
    { id: 2, type: 'message', user: 'Coach Brown', reason: 'Spam', severity: 'medium', date: '3h ago' },
    { id: 3, type: 'profile', user: 'Emily Chen', reason: 'Fake credentials', severity: 'high', date: '5h ago' }
  ]

  return (
    <RoleGuard allowedRole="admin">
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 border-b-4 border-trackrecruit-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-trackrecruit-yellow mr-3" />
              <h1 className="text-3xl font-black text-trackrecruit-yellow tracking-tight">ADMIN DASHBOARD</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/home" className="text-trackrecruit-yellow font-semibold hover:text-yellow-400">
                Back to Site
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('userRole')
                  window.location.href = '/home'
                }}
                className="text-trackrecruit-yellow font-semibold hover:text-yellow-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'overview'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'users'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'moderation'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Content Moderation
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'analytics'
                ? 'border-b-4 border-trackrecruit-yellow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-semibold text-green-600">+12%</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">+8%</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.verifiedUsers.toLocaleString()}</h3>
                <p className="text-gray-600">Verified Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-trackrecruit-yellow" />
                  <span className="text-sm font-semibold text-green-600">+24%</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.activeToday}</h3>
                <p className="text-gray-600">Active Today</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Urgent</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.pendingVerification}</h3>
                <p className="text-gray-600">Pending Verification</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Recent Users</h2>
                <div className="space-y-4">
                  {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{user.joined}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Flagged Content</h2>
                <div className="space-y-4">
                  {flaggedContent.map(item => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{item.user}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.severity === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <div className="flex gap-2">
                          <button className="text-sm font-bold text-blue-600 hover:underline">Review</button>
                          <button className="text-sm font-bold text-red-600 hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">All Users</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                  </div>
                  <select className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none">
                    <option>All Roles</option>
                    <option>Athletes</option>
                    <option>Coaches</option>
                  </select>
                  <select className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none">
                    <option>All Status</option>
                    <option>Verified</option>
                    <option>Pending</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Joined</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.joined}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-200 rounded" title="View Profile">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded" title="Suspend User">
                              <Ban className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Content Moderation Queue</h2>
              <div className="space-y-4">
                {flaggedContent.map(item => (
                  <div key={item.id} className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.severity === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.severity} priority
                          </span>
                          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-bold">
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.user}</h3>
                        <p className="text-gray-600 mb-3">Reason: {item.reason}</p>
                        <p className="text-sm text-gray-500">Flagged {item.date}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition">
                          Approve
                        </button>
                        <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition">
                          Remove
                        </button>
                        <button className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition">
                          Review Later
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  User Growth
                </h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 78, 82, 91, 88, 95, 100].map((height, idx) => (
                    <div key={idx} className="flex-1 bg-trackrecruit-yellow rounded-t-lg" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Platform Metrics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Athletes</span>
                      <span className="font-black text-gray-900">{stats.athletes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Coaches</span>
                      <span className="font-black text-gray-900">{stats.coaches}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Messages (24h)</span>
                      <span className="font-black text-gray-900">{stats.messagesLast24h}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-trackrecruit-yellow h-3 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Profile Views</span>
                      <span className="font-black text-gray-900">{stats.profileViews}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </RoleGuard>
  )
}
