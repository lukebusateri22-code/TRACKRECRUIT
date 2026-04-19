'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, TrendingUp, AlertCircle, CheckCircle, BarChart3, MessageSquare, Shield, Eye, Ban, Search, UserX, UserCheck } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  created_at: string
  is_verified: boolean
}

interface FlaggedContent {
  id: string
  content_type: string
  reason: string
  severity: string
  created_at: string
  status: string
  reported_user_id: string
  profiles?: {
    first_name: string
    last_name: string
    email: string
  }
}

interface Stats {
  totalUsers: number
  athletes: number
  coaches: number
  activeUsers: number
  suspendedUsers: number
  bannedUsers: number
  pendingReports: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  
  // Real data from Supabase
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    athletes: 0,
    coaches: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    bannedUsers: 0,
    pendingReports: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const supabase = createClient()
      
      // Load stats
      const { data: statsData } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single()
      
      if (statsData) {
        setStats({
          totalUsers: statsData.total_users || 0,
          athletes: statsData.total_athletes || 0,
          coaches: statsData.total_coaches || 0,
          activeUsers: statsData.active_users || 0,
          suspendedUsers: statsData.suspended_users || 0,
          bannedUsers: statsData.banned_users || 0,
          pendingReports: statsData.pending_reports || 0
        })
      }
      
      // Load recent users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (usersData) {
        setUsers(usersData)
      }
      
      // Load flagged content
      const { data: flaggedData } = await supabase
        .from('flagged_content')
        .select(`
          *,
          profiles:reported_user_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (flaggedData) {
        setFlaggedContent(flaggedData)
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'reactivate') => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return
      
      let functionName = ''
      if (action === 'suspend') functionName = 'suspend_user'
      else if (action === 'ban') functionName = 'ban_user'
      else if (action === 'reactivate') functionName = 'reactivate_user'
      
      const { error } = await supabase.rpc(functionName, {
        p_user_id: userId,
        p_admin_id: user.id
      })
      
      if (error) throw error
      
      // Reload data
      await loadDashboardData()
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      alert(`Failed to ${action} user`)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const recentUsers = filteredUsers.slice(0, 5)

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
            {/* Quick Actions */}
            <div className="mb-8">
              <Link 
                href="/admin/create-coach"
                className="inline-flex items-center px-6 py-3 bg-trackrecruit-yellow text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                <Users className="w-5 h-5 mr-2" />
                Create Coach Account
              </Link>
            </div>

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
                  <span className="text-sm font-semibold text-green-600">Active</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.activeUsers.toLocaleString()}</h3>
                <p className="text-gray-600">Active Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Ban className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600">Suspended</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.suspendedUsers}</h3>
                <p className="text-gray-600">Suspended Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Reports</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stats.pendingReports}</h3>
                <p className="text-gray-600">Pending Reports</p>
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
                        <h3 className="font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : user.status === 'suspended'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{getTimeAgo(user.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Flagged Content</h2>
                <div className="space-y-4">
                  {flaggedContent.length > 0 ? flaggedContent.map(item => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">
                          {item.profiles?.first_name} {item.profiles?.last_name}
                        </span>
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
                        <span className="text-xs text-gray-500">{getTimeAgo(item.created_at)}</span>
                        <div className="flex gap-2">
                          <button className="text-sm font-bold text-blue-600 hover:underline">Review</button>
                          <button className="text-sm font-bold text-red-600 hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-8">No pending reports</p>
                  )}
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
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="athlete">Athletes</option>
                    <option value="coach">Coaches</option>
                    <option value="admin">Admins</option>
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-trackrecruit-yellow focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
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
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{user.first_name} {user.last_name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : user.status === 'suspended'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{getTimeAgo(user.created_at)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {user.status === 'active' ? (
                              <>
                                <button 
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="p-2 hover:bg-orange-100 rounded" 
                                  title="Suspend User"
                                >
                                  <Ban className="w-4 h-4 text-orange-600" />
                                </button>
                                <button 
                                  onClick={() => handleUserAction(user.id, 'ban')}
                                  className="p-2 hover:bg-red-100 rounded" 
                                  title="Ban User"
                                >
                                  <UserX className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            ) : (
                              <button 
                                onClick={() => handleUserAction(user.id, 'reactivate')}
                                className="p-2 hover:bg-green-100 rounded" 
                                title="Reactivate User"
                              >
                                <UserCheck className="w-4 h-4 text-green-600" />
                              </button>
                            )}
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
                {flaggedContent.length > 0 ? flaggedContent.map(item => (
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
                            {item.content_type}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.profiles?.first_name} {item.profiles?.last_name}
                        </h3>
                        <p className="text-gray-600 mb-3">Reason: {item.reason}</p>
                        <p className="text-sm text-gray-500">Flagged {getTimeAgo(item.created_at)}</p>
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
                )) : (
                  <p className="text-gray-500 text-center py-8">No flagged content to review</p>
                )}
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
