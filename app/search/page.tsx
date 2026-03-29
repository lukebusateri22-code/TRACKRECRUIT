'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Trophy, GraduationCap, Star, TrendingUp, X } from 'lucide-react'

export default function SearchPage() {
  const [searchType, setSearchType] = useState<'athletes' | 'colleges'>('colleges')
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedClassYear, setSelectedClassYear] = useState('All Years')
  const [selectedGPA, setSelectedGPA] = useState('Any GPA')
  const [selectedEventCategories, setSelectedEventCategories] = useState<string[]>([])

  const athletes = [
    { name: 'Sarah Johnson', location: 'Boston, MA', state: 'MA', class: '2027', event: '1500m', eventCategory: 'Distance', pr: '4:32.1', gpa: '3.9', sat: '1420', image: 'SJ' },
    { name: 'Marcus Williams', location: 'Atlanta, GA', state: 'GA', class: '2027', event: '110mH', eventCategory: 'Hurdles', pr: '14.2s', gpa: '3.6', sat: '1280', image: 'MW' },
    { name: 'Emily Chen', location: 'San Diego, CA', state: 'CA', class: '2027', event: 'Long Jump', eventCategory: 'Jumps', pr: '19\'8"', gpa: '4.0', sat: '1480', image: 'EC' },
    { name: 'Jordan Davis', location: 'Chicago, IL', state: 'IL', class: '2027', event: '400m', eventCategory: 'Sprints', pr: '48.2s', gpa: '3.8', sat: '1340', image: 'JD' },
    { name: 'Alex Martinez', location: 'Houston, TX', state: 'TX', class: '2027', event: '800m', eventCategory: 'Distance', pr: '1:54.3', gpa: '3.7', sat: '1310', image: 'AM' },
    { name: 'Taylor Brown', location: 'Seattle, WA', state: 'WA', class: '2027', event: '3000m', eventCategory: 'Distance', pr: '9:12.5', gpa: '3.9', sat: '1390', image: 'TB' },
    { name: 'Chris Johnson', location: 'Miami, FL', state: 'FL', class: '2026', event: '200m', eventCategory: 'Sprints', pr: '21.5s', gpa: '3.5', sat: '1250', image: 'CJ' },
    { name: 'Maya Patel', location: 'Austin, TX', state: 'TX', class: '2026', event: '400mH', eventCategory: 'Hurdles', pr: '58.3s', gpa: '3.9', sat: '1420', image: 'MP' },
    { name: 'Brandon Lee', location: 'Los Angeles, CA', state: 'CA', class: '2028', event: '100m', eventCategory: 'Sprints', pr: '10.9s', gpa: '3.4', sat: '1180', image: 'BL' },
  ]

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.event.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = selectedState === 'All States' || athlete.state === selectedState
    const matchesClass = selectedClassYear === 'All Years' || athlete.class === selectedClassYear
    const matchesGPA = selectedGPA === 'Any GPA' || (
      selectedGPA === '4.0' ? athlete.gpa === '4.0' :
      selectedGPA === '3.8+' ? parseFloat(athlete.gpa) >= 3.8 :
      selectedGPA === '3.5+' ? parseFloat(athlete.gpa) >= 3.5 :
      selectedGPA === '3.0 - 3.5' ? parseFloat(athlete.gpa) >= 3.0 && parseFloat(athlete.gpa) < 3.5 :
      selectedGPA === '2.5 - 3.0' ? parseFloat(athlete.gpa) >= 2.5 && parseFloat(athlete.gpa) < 3.0 :
      true
    )
    const matchesEventCategory = selectedEventCategories.length === 0 || 
                                selectedEventCategories.includes(athlete.eventCategory)
    
    return matchesSearch && matchesState && matchesClass && matchesGPA && matchesEventCategory
  })

  const handleEventCategoryToggle = (category: string) => {
    setSelectedEventCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedState('All States')
    setSelectedClassYear('All Years')
    setSelectedGPA('Any GPA')
    setSelectedEventCategories([])
  }

  const activeFiltersCount = [
    selectedState !== 'All States',
    selectedClassYear !== 'All Years',
    selectedGPA !== 'Any GPA',
    selectedEventCategories.length > 0
  ].filter(Boolean).length

  const colleges = [
    { name: 'University of Michigan', location: 'Ann Arbor, MI', division: 'D1', conference: 'Big Ten', scholarships: '12.6', image: 'UM' },
    { name: 'Ohio State University', location: 'Columbus, OH', division: 'D1', conference: 'Big Ten', scholarships: '12.6', image: 'OSU' },
    { name: 'Penn State University', location: 'State College, PA', division: 'D1', conference: 'Big Ten', scholarships: '12.6', image: 'PSU' },
    { name: 'University of Illinois', location: 'Champaign, IL', division: 'D1', conference: 'Big Ten', scholarships: '12.6', image: 'UI' },
    { name: 'University of Wisconsin', location: 'Madison, WI', division: 'D1', conference: 'Big Ten', scholarships: '12.6', image: 'UW' },
    { name: 'Northwestern University', location: 'Evanston, IL', division: 'D1', conference: 'Big Ten', scholarships: '12.6', image: 'NU' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/athletes" className="text-gray-900 font-semibold">Dashboard</Link>
              <Link href="/search" className="text-gray-900 font-semibold">Search</Link>
              <Link href="/messages" className="text-gray-900 font-semibold">Messages</Link>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Discover Your Perfect Match</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchType('colleges')}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                searchType === 'colleges'
                  ? 'bg-trackrecruit-yellow text-gray-900 border-2 border-gray-900'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-400'
              }`}
            >
              Search Colleges
            </button>
            <button
              onClick={() => setSearchType('athletes')}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                searchType === 'athletes'
                  ? 'bg-trackrecruit-yellow text-gray-900 border-2 border-gray-900'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-400'
              }`}
            >
              Search Athletes
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'colleges' ? 'Search colleges by name, location, or conference...' : 'Search athletes by name, event, or location...'}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:border-trackrecruit-yellow focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-900 text-trackrecruit-yellow px-6 py-4 rounded-lg font-bold hover:bg-gray-800 transition flex items-center relative"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {showFilters && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="md:hidden">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {searchType === 'colleges' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Division</label>
                      <div className="space-y-2">
                        {['D1', 'D2', 'D3', 'NAIA', 'JUCO'].map(div => (
                          <label key={div} className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked={div === 'D1'} />
                            <span className="text-sm text-gray-700">{div}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Conference</label>
                      <select className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm">
                        <option>All Conferences</option>
                        <option>Big Ten</option>
                        <option>SEC</option>
                        <option>ACC</option>
                        <option>Pac-12</option>
                        <option>Big 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Region</label>
                      <select className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm">
                        <option>All Regions</option>
                        <option>Midwest</option>
                        <option>Northeast</option>
                        <option>South</option>
                        <option>West</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">School Size</label>
                      <select className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm">
                        <option>Any Size</option>
                        <option>Small (&lt;5,000)</option>
                        <option>Medium (5,000-15,000)</option>
                        <option>Large (&gt;15,000)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Event Category</label>
                      <div className="space-y-2">
                        {['Sprints', 'Distance', 'Hurdles', 'Jumps', 'Throws', 'Multi'].map(event => (
                          <label key={event} className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="mr-2" 
                              checked={selectedEventCategories.includes(event)}
                              onChange={() => handleEventCategoryToggle(event)}
                            />
                            <span className="text-sm text-gray-700">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Performance Range</label>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Event</label>
                          <select className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm">
                            <option value="">Select Event</option>
                            <option value="100m">100m</option>
                            <option value="200m">200m</option>
                            <option value="400m">400m</option>
                            <option value="800m">800m</option>
                            <option value="1500m">1500m</option>
                            <option value="110mH">110m Hurdles</option>
                            <option value="400mH">400m Hurdles</option>
                            <option value="LJ">Long Jump</option>
                            <option value="TJ">Triple Jump</option>
                            <option value="HJ">High Jump</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">Min PR</label>
                            <input 
                              type="text" 
                              placeholder="e.g., 47.0"
                              className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">Max PR</label>
                            <input 
                              type="text" 
                              placeholder="e.g., 50.0"
                              className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 italic">Enter times in seconds (e.g., 48.5) or distances in feet/meters</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Quick Filters</label>
                      <div className="space-y-2">
                        <button className="w-full p-2 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm font-semibold text-blue-900 hover:bg-blue-100 transition text-left">
                          Sub-48 400m runners
                        </button>
                        <button className="w-full p-2 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm font-semibold text-blue-900 hover:bg-blue-100 transition text-left">
                          Sub-1:55 800m runners
                        </button>
                        <button className="w-full p-2 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm font-semibold text-blue-900 hover:bg-blue-100 transition text-left">
                          Sub-4:30 1500m runners
                        </button>
                        <button className="w-full p-2 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm font-semibold text-blue-900 hover:bg-blue-100 transition text-left">
                          20'+ Long Jumpers
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Class Year</label>
                      <select 
                        className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm"
                        value={selectedClassYear}
                        onChange={(e) => setSelectedClassYear(e.target.value)}
                      >
                        <option>All Years</option>
                        <option>2025</option>
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">GPA Range</label>
                      <select 
                        className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm"
                        value={selectedGPA}
                        onChange={(e) => setSelectedGPA(e.target.value)}
                      >
                        <option>Any GPA</option>
                        <option>4.0</option>
                        <option>3.8+</option>
                        <option>3.5+</option>
                        <option>3.0 - 3.5</option>
                        <option>2.5 - 3.0</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">State</label>
                      <select 
                        className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option>All States</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        <option value="IL">Illinois</option>
                        <option value="GA">Georgia</option>
                        <option value="MA">Massachusetts</option>
                        <option value="WA">Washington</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="OH">Ohio</option>
                        <option value="MI">Michigan</option>
                      </select>
                    </div>
                  </div>
                )}

                <button 
                  onClick={clearFilters}
                  className="w-full mt-6 bg-white border-2 border-gray-200 text-gray-900 px-4 py-3 rounded-lg font-bold hover:border-gray-400 transition"
                >
                  Clear All Filters
                </button>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-center text-gray-600 mt-2">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                  </p>
                )}
              </div>
            </div>
          )}

          <div className={showFilters ? 'md:col-span-3' : 'md:col-span-4'}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{searchType === 'colleges' ? colleges.length : filteredAthletes.length}</span> results
              </p>
              <select className="p-2 border-2 border-gray-200 rounded-lg text-sm font-semibold">
                <option>Best Match</option>
                <option>Newest First</option>
                <option>Alphabetical</option>
              </select>
            </div>

            <div className="space-y-4">
              {searchType === 'colleges' ? (
                colleges.map((college, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center text-trackrecruit-yellow font-black text-lg mr-4">
                          {college.image}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {college.location}
                            </span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm font-semibold text-gray-900">{college.division}</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{college.conference}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-trackrecruit-yellow transition">
                        <Star className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Scholarships</p>
                        <p className="text-lg font-bold text-gray-900">{college.scholarships}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Team Size</p>
                        <p className="text-lg font-bold text-gray-900">45-60</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Match Score</p>
                        <p className="text-lg font-bold text-trackrecruit-yellow">87%</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/colleges/${idx}`} className="flex-1 bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold text-center hover:bg-yellow-400 transition">
                        View Program
                      </Link>
                      <button className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                        Contact Coach
                      </button>
                    </div>
                  </div>
                ))
              ) : filteredAthletes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No athletes found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button 
                    onClick={clearFilters}
                    className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredAthletes.map((athlete, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:border-trackrecruit-yellow transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-lg mr-4">
                          {athlete.image}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{athlete.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {athlete.location}
                            </span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm font-semibold text-gray-900">Class of {athlete.class}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-trackrecruit-yellow transition">
                        <Star className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Event</p>
                        <p className="text-sm font-bold text-gray-900">{athlete.event}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">PR</p>
                        <p className="text-sm font-bold text-gray-900">{athlete.pr}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">GPA</p>
                        <p className="text-sm font-bold text-gray-900">{athlete.gpa}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-1">SAT</p>
                        <p className="text-sm font-bold text-gray-900">{athlete.sat}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/athletes/${idx}`} className="flex-1 bg-trackrecruit-yellow text-gray-900 px-4 py-2 rounded-lg font-bold text-center hover:bg-yellow-400 transition">
                        View Profile
                      </Link>
                      <button className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                        Message
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
