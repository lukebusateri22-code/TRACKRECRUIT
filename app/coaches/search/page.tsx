'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MessageSquare, Phone, MapPin, Calendar, Award } from 'lucide-react'

interface Athlete {
  id: string
  name: string
  gender: 'Men' | 'Women'
  event: string
  pr: string
  location: string
  class: string
  gpa: string
  hasAccount: boolean
  contactEmail?: string
  contactPhone?: string
}

export default function AthleteSearch() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState<string>('coach')

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All')
  const [selectedEvent, setSelectedEvent] = useState('All Events')
  const [selectedClass, setSelectedClass] = useState('All')
  const [minGPA, setMinGPA] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'coach'
    setUserRole(role)
    
    // Load mock data
    loadMockAthletes()
  }, [])

  useEffect(() => {
    filterAthletes()
  }, [athletes, searchTerm, selectedGender, selectedEvent, selectedClass, minGPA])

  const loadMockAthletes = () => {
    const mockAthletes: Athlete[] = [
      { id: '1', name: 'Sarah Johnson', gender: 'Women', event: '400m', pr: '55.2s', location: 'Boston, MA', class: '2027', gpa: '3.9', hasAccount: true, contactEmail: 'sarah.j@email.com' },
      { id: '2', name: 'Marcus Williams', gender: 'Men', event: '110mH', pr: '14.2s', location: 'Atlanta, GA', class: '2027', gpa: '3.6', hasAccount: false, contactPhone: '555-0123' },
      { id: '3', name: 'Emily Chen', gender: 'Women', event: 'Long Jump', pr: '19\'8"', location: 'San Diego, CA', class: '2027', gpa: '4.0', hasAccount: true, contactEmail: 'emily.c@email.com' },
      { id: '4', name: 'Jordan Davis', gender: 'Men', event: '400m', pr: '48.2s', location: 'Chicago, IL', class: '2027', gpa: '3.8', hasAccount: false, contactPhone: '555-0124' },
      { id: '5', name: 'Alex Martinez', gender: 'Women', event: '800m', pr: '2:08.5', location: 'Austin, TX', class: '2026', gpa: '3.7', hasAccount: true, contactEmail: 'alex.m@email.com' },
      { id: '6', name: 'Taylor Brown', gender: 'Men', event: 'Shot Put', pr: '52\'4"', location: 'Seattle, WA', class: '2028', gpa: '3.5', hasAccount: false },
      { id: '7', name: 'Jessica Lee', gender: 'Women', event: '100m', pr: '11.8s', location: 'Orlando, FL', class: '2027', gpa: '3.9', hasAccount: true, contactEmail: 'jessica.l@email.com' },
      { id: '8', name: 'Ryan Wilson', gender: 'Men', event: '1500m', pr: '4:15.2', location: 'Denver, CO', class: '2026', gpa: '3.4', hasAccount: false, contactPhone: '555-0125' },
    ]
    
    setAthletes(mockAthletes)
  }

  const filterAthletes = () => {
    let filtered = athletes

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(athlete => 
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Gender filter
    if (selectedGender !== 'All') {
      filtered = filtered.filter(athlete => athlete.gender === selectedGender)
    }

    // Event filter
    if (selectedEvent !== 'All Events') {
      filtered = filtered.filter(athlete => athlete.event === selectedEvent)
    }

    // Class filter
    if (selectedClass !== 'All') {
      filtered = filtered.filter(athlete => athlete.class === selectedClass)
    }

    // GPA filter
    if (minGPA) {
      filtered = filtered.filter(athlete => parseFloat(athlete.gpa) >= parseFloat(minGPA))
    }

    setFilteredAthletes(filtered)
  }

  const handleMessage = (athlete: Athlete) => {
    if (athlete.hasAccount) {
      // Navigate to messaging system
      window.location.href = `/messages?athlete=${athlete.id}`
    } else {
      // Show contact info for non-account users
      alert(`Contact Information:\n${athlete.contactEmail || athlete.contactPhone || 'No contact info available'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/coaches/dashboard" className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/coaches/dashboard" className="text-gray-900 font-semibold hover:text-gray-700">Dashboard</Link>
              <Link href="/coaches/search" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Search Athletes</Link>
              <Link href="/coaches/messages" className="text-gray-900 font-semibold hover:text-gray-700">Messages</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Search Athletes</h1>
          <p className="text-gray-600">Find recruits that match your program needs</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, event, location..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as 'All' | 'Men' | 'Women')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="All">All</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            {/* Event */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option>All Events</option>
                <option>100m</option>
                <option>400m</option>
                <option>800m</option>
                <option>1500m</option>
                <option>110mH</option>
                <option>Long Jump</option>
                <option>Shot Put</option>
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Class Year</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="All">All</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min GPA</label>
              <input
                type="number"
                value={minGPA}
                onChange={(e) => setMinGPA(e.target.value)}
                placeholder="3.0"
                min="0"
                max="4"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Results ({filteredAthletes.length} athletes)
            </h3>
          </div>
          
          {filteredAthletes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No athletes found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAthletes.map((athlete) => (
                <div key={athlete.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold">
                        {athlete.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Athlete Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-gray-900">{athlete.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            athlete.gender === 'Women' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {athlete.gender}
                          </span>
                          {!athlete.hasAccount && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                              No Account
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            {athlete.event}
                          </span>
                          <span className="font-semibold">{athlete.pr}</span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {athlete.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Class of {athlete.class}
                          </span>
                          <span>GPA: {athlete.gpa}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMessage(athlete)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                          athlete.hasAccount 
                            ? 'bg-trackrecruit-yellow text-gray-900 hover:bg-yellow-400' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {athlete.hasAccount ? (
                          <>
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Message
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 inline mr-1" />
                            Contact
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
