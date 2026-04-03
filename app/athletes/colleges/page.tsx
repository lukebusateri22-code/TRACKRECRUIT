'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Users, DollarSign, TrendingUp, ArrowLeft, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface College {
  id: string
  name: string
  city: string
  state: string
  ncaa_division: string
  conference: string
  region: string
  total_enrollment?: number
  acceptance_rate?: number
  tuition_out_state?: number
  has_mens_track: boolean
  has_womens_track: boolean
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [filteredColleges, setFilteredColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    division: 'all',
    conference: 'all',
    region: 'all',
    state: 'all'
  })

  const supabase = createClient()

  useEffect(() => {
    loadColleges()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, filters, colleges])

  const loadColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name')

      if (error) throw error
      setColleges(data || [])
    } catch (err) {
      console.error('Error loading colleges:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...colleges]

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(query) ||
        college.city.toLowerCase().includes(query) ||
        college.state.toLowerCase().includes(query) ||
        college.conference?.toLowerCase().includes(query)
      )
    }

    // Division filter
    if (filters.division !== 'all') {
      filtered = filtered.filter(c => c.ncaa_division === filters.division)
    }

    // Conference filter
    if (filters.conference !== 'all') {
      filtered = filtered.filter(c => c.conference === filters.conference)
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter(c => c.region === filters.region)
    }

    // State filter
    if (filters.state !== 'all') {
      filtered = filtered.filter(c => c.state === filters.state)
    }

    setFilteredColleges(filtered)
  }

  const uniqueConferences = Array.from(new Set(colleges.map(c => c.conference).filter(Boolean))).sort()
  const uniqueRegions = Array.from(new Set(colleges.map(c => c.region).filter(Boolean))).sort()
  const uniqueStates = Array.from(new Set(colleges.map(c => c.state))).sort()

  return (
    
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link
                href="/athletes"
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Explore Colleges</h1>
                <p className="text-gray-700 mt-1">Find the perfect college track & field program</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by college name, city, or conference..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none text-lg"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Division</label>
                <select
                  value={filters.division}
                  onChange={(e) => setFilters({ ...filters, division: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                >
                  <option value="all">All Divisions</option>
                  <option value="D1">NCAA D1</option>
                  <option value="D2">NCAA D2</option>
                  <option value="D3">NCAA D3</option>
                  <option value="NAIA">NAIA</option>
                  <option value="NJCAA">NJCAA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Conference</label>
                <select
                  value={filters.conference}
                  onChange={(e) => setFilters({ ...filters, conference: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                >
                  <option value="all">All Conferences</option>
                  {uniqueConferences.map(conf => (
                    <option key={conf} value={conf}>{conf}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                >
                  <option value="all">All Regions</option>
                  {uniqueRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                >
                  <option value="all">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredColleges.length}</span> of{' '}
                <span className="font-bold text-gray-900">{colleges.length}</span> colleges
              </p>
              {(searchQuery || filters.division !== 'all' || filters.conference !== 'all' || filters.region !== 'all' || filters.state !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({ division: 'all', conference: 'all', region: 'all', state: 'all' })
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* College List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading colleges...</p>
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No colleges found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilters({ division: 'all', conference: 'all', region: 'all', state: 'all' })
                }}
                className="bg-trackrecruit-yellow text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => (
                <Link
                  key={college.id}
                  href={`/athletes/colleges/${college.id}`}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-trackrecruit-yellow hover:shadow-lg transition"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{college.city}, {college.state}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Division:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                        {college.ncaa_division}
                      </span>
                    </div>
                    {college.conference && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Conference:</span>
                        <span className="text-sm font-semibold text-gray-900">{college.conference}</span>
                      </div>
                    )}
                    {college.region && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Region:</span>
                        <span className="text-sm font-semibold text-gray-900">{college.region}</span>
                      </div>
                    )}
                  </div>

                  {(college.total_enrollment || college.acceptance_rate || college.tuition_out_state) && (
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      {college.total_enrollment && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {college.total_enrollment.toLocaleString()} students
                        </div>
                      )}
                      {college.acceptance_rate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {college.acceptance_rate}% acceptance rate
                        </div>
                      )}
                      {college.tuition_out_state && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          ${college.tuition_out_state.toLocaleString()}/year
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {college.has_mens_track && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                          Men's Track
                        </span>
                      )}
                      {college.has_womens_track && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs font-bold">
                          Women's Track
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    
  )
}
