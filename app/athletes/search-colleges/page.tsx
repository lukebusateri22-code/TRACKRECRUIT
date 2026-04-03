'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, MapPin, Trophy, GraduationCap, Star, TrendingUp, X, DollarSign, Users } from 'lucide-react'

export default function AthleteCollegeSearch() {
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedDivision, setSelectedDivision] = useState('All Divisions')
  const [selectedConference, setSelectedConference] = useState('All Conferences')
  const [selectedPriceRange, setSelectedPriceRange] = useState('Any Price')
  const [selectedSize, setSelectedSize] = useState('Any Size')

  const colleges = [
    {
      name: 'University of Texas',
      location: 'Austin, TX',
      state: 'TX',
      division: 'D1',
      conference: 'Big 12',
      priceRange: '$20k-30k',
      size: 'Large (15k+)',
      ranking: '#12',
      acceptanceRate: '32%',
      programs: ['Track & Field', 'Cross Country'],
      image: 'UT',
      matchScore: 94
    },
    {
      name: 'University of Florida',
      location: 'Gainesville, FL',
      state: 'FL',
      division: 'D1',
      conference: 'SEC',
      priceRange: '$15k-25k',
      size: 'Large (15k+)',
      ranking: '#8',
      acceptanceRate: '31%',
      programs: ['Track & Field', 'Cross Country'],
      image: 'UF',
      matchScore: 89
    },
    {
      name: 'Stanford University',
      location: 'Stanford, CA',
      state: 'CA',
      division: 'D1',
      conference: 'Pac-12',
      priceRange: '$50k+',
      size: 'Medium (5k-15k)',
      ranking: '#3',
      acceptanceRate: '4%',
      programs: ['Track & Field', 'Cross Country'],
      image: 'SU',
      matchScore: 87
    },
    {
      name: 'University of Oregon',
      location: 'Eugene, OR',
      state: 'OR',
      division: 'D1',
      conference: 'Pac-12',
      priceRange: '$25k-35k',
      size: 'Large (15k+)',
      ranking: '#15',
      acceptanceRate: '82%',
      programs: ['Track & Field', 'Cross Country'],
      image: 'UO',
      matchScore: 85
    },
    {
      name: 'University of Alabama',
      location: 'Tuscaloosa, AL',
      state: 'AL',
      division: 'D1',
      conference: 'SEC',
      priceRange: '$20k-30k',
      size: 'Large (15k+)',
      ranking: '#25',
      acceptanceRate: '53%',
      programs: ['Track & Field', 'Cross Country'],
      image: 'UA',
      matchScore: 82
    }
  ]

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = selectedState === 'All States' || college.state === selectedState
    const matchesDivision = selectedDivision === 'All Divisions' || college.division === selectedDivision
    const matchesConference = selectedConference === 'All Conferences' || college.conference === selectedConference
    const matchesPrice = selectedPriceRange === 'Any Price' || college.priceRange === selectedPriceRange
    const matchesSize = selectedSize === 'Any Size' || college.size === selectedSize
    
    return matchesSearch && matchesState && matchesDivision && matchesConference && matchesPrice && matchesSize
  })

  const states = ['All States', 'TX', 'FL', 'CA', 'OR', 'AL', 'GA', 'NC', 'VA', 'NY', 'PA', 'OH', 'MI', 'IL', 'WA']
  const divisions = ['All Divisions', 'D1', 'D2', 'D3', 'NAIA']
  const conferences = ['All Conferences', 'Big 12', 'SEC', 'Pac-12', 'ACC', 'Big Ten', 'American', 'Mountain West']
  const priceRanges = ['Any Price', '$0-15k', '$15k-25k', '$25k-35k', '$35k-50k', '$50k+']
  const sizes = ['Any Size', 'Small (<5k)', 'Medium (5k-15k)', 'Large (15k+)']

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
                <Link href="/athletes/rankings" className="text-gray-900 font-semibold hover:text-gray-700">Rankings</Link>
                <Link href="/athletes/search-colleges" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Find Colleges</Link>
                <Link href="/athletes/recruiting" className="text-gray-900 font-semibold hover:text-gray-700">Recruiting</Link>
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
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Find Colleges</h1>
            <p className="text-xl text-gray-600">Discover colleges that match your athletic and academic profile</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>

                {showFilters && (
                  <div className="space-y-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="College name or location..."
                          value={searchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <select
                        value={selectedState}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedState(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    {/* Division */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Division</label>
                      <select
                        value={selectedDivision}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDivision(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        {divisions.map(division => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                    </div>

                    {/* Conference */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Conference</label>
                      <select
                        value={selectedConference}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedConference(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        {conferences.map(conference => (
                          <option key={conference} value={conference}>{conference}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                      <select
                        value={selectedPriceRange}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        {priceRanges.map(price => (
                          <option key={price} value={price}>{price}</option>
                        ))}
                      </select>
                    </div>

                    {/* School Size */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">School Size</label>
                      <select
                        value={selectedSize}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSize(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedState('All States')
                        setSelectedDivision('All Divisions')
                        setSelectedConference('All Conferences')
                        setSelectedPriceRange('Any Price')
                        setSelectedSize('Any Size')
                      }}
                      className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {filteredColleges.length} Colleges Found
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    <option>Best Match</option>
                    <option>Ranking</option>
                    <option>Price</option>
                    <option>Location</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredColleges.map((college, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-xl">
                          {college.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-xl font-bold text-gray-900">{college.name}</h4>
                            <span className="bg-trackrecruit-yellow text-gray-900 px-2 py-1 rounded text-xs font-bold">
                              {college.matchScore}% Match
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {college.location}
                            </span>
                            <span className="flex items-center">
                              <Trophy className="w-4 h-4 mr-1" />
                              {college.division} • {college.conference}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {college.priceRange}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {college.size}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div>
                              <span className="font-bold text-gray-900">Ranking:</span>
                              <span className="text-gray-600 ml-1">{college.ranking}</span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-900">Acceptance:</span>
                              <span className="text-gray-600 ml-1">{college.acceptanceRate}</span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-900">Programs:</span>
                              <span className="text-gray-600 ml-1">{college.programs.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition">
                          View Details
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
                          Save School
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredColleges.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No colleges found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  )
}
