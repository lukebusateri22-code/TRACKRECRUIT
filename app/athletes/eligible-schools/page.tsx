'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, GraduationCap, MapPin, TrendingUp, Star, Filter, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react'

export default function EligibleSchools() {
  const [selectedEvent, setSelectedEvent] = useState('400m')

  const athleteProfile = {
    name: 'Jordan Davis',
    events: {
      '400m': '48.2s',
      '800m': '1:52.8'
    },
    gpa: 3.8,
    sat: 1340,
    class: '2027'
  }

  const schools = [
    {
      name: 'University of Michigan',
      division: 'D1',
      conference: 'Big Ten',
      location: 'Ann Arbor, MI',
      requirements: {
        '400m': { min: '49.0s', max: '46.0s' },
        '800m': { min: '1:55.0', max: '1:48.0' },
        minGPA: 3.5,
        minSAT: 1200
      },
      eligible: true,
      matchScore: 95,
      canContact: true,
      reason: 'You meet all performance and academic requirements'
    },
    {
      name: 'Penn State University',
      division: 'D1',
      conference: 'Big Ten',
      location: 'University Park, PA',
      requirements: {
        '400m': { min: '48.5s', max: '45.5s' },
        '800m': { min: '1:54.0', max: '1:47.0' },
        minGPA: 3.4,
        minSAT: 1250
      },
      eligible: true,
      matchScore: 92,
      canContact: true,
      reason: 'Strong match for their program standards'
    },
    {
      name: 'Ohio State University',
      division: 'D1',
      conference: 'Big Ten',
      location: 'Columbus, OH',
      requirements: {
        '400m': { min: '47.5s', max: '45.0s' },
        '800m': { min: '1:52.0', max: '1:46.0' },
        minGPA: 3.6,
        minSAT: 1300
      },
      eligible: false,
      matchScore: 78,
      canContact: false,
      reason: '400m time needs to be 47.5s or faster (currently 48.2s)'
    },
    {
      name: 'University of Oregon',
      division: 'D1',
      conference: 'Pac-12',
      location: 'Eugene, OR',
      requirements: {
        '400m': { min: '47.0s', max: '44.5s' },
        '800m': { min: '1:50.0', max: '1:45.0' },
        minGPA: 3.7,
        minSAT: 1350
      },
      eligible: false,
      matchScore: 72,
      canContact: false,
      reason: '400m time needs to be 47.0s or faster (currently 48.2s)'
    },
    {
      name: 'University of Wisconsin',
      division: 'D1',
      conference: 'Big Ten',
      location: 'Madison, WI',
      requirements: {
        '400m': { min: '49.5s', max: '46.5s' },
        '800m': { min: '1:56.0', max: '1:49.0' },
        minGPA: 3.3,
        minSAT: 1180
      },
      eligible: true,
      matchScore: 96,
      canContact: true,
      reason: 'Excellent fit for their program'
    },
    {
      name: 'Indiana University',
      division: 'D1',
      conference: 'Big Ten',
      location: 'Bloomington, IN',
      requirements: {
        '400m': { min: '50.0s', max: '47.0s' },
        '800m': { min: '1:57.0', max: '1:50.0' },
        minGPA: 3.2,
        minSAT: 1150
      },
      eligible: true,
      matchScore: 98,
      canContact: true,
      reason: 'Top prospect for their program'
    },
    {
      name: 'Stanford University',
      division: 'D1',
      conference: 'Pac-12',
      location: 'Stanford, CA',
      requirements: {
        '400m': { min: '46.5s', max: '44.0s' },
        '800m': { min: '1:49.0', max: '1:44.0' },
        minGPA: 3.9,
        minSAT: 1450
      },
      eligible: false,
      matchScore: 65,
      canContact: false,
      reason: '400m time needs to be 46.5s or faster and SAT needs to be 1450+ (currently 1340)'
    }
  ]

  const eligibleSchools = schools.filter(s => s.eligible)
  const ineligibleSchools = schools.filter(s => !s.eligible)

  return (
    
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/athletes" className="flex items-center text-gray-900 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <h1 className="text-3xl font-black tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/athletes" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                Dashboard
              </Link>
              <Link href="/search" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                Search Schools
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Schools You Can Contact</h1>
          <p className="text-xl text-gray-600">
            Based on your performance times and academics, here are schools where you meet the recruiting standards
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Your Profile</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">400m PR:</span>
                <span className="font-bold text-gray-900">{athleteProfile.events['400m']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">800m PR:</span>
                <span className="font-bold text-gray-900">{athleteProfile.events['800m']}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">GPA:</span>
                <span className="font-bold text-gray-900">{athleteProfile.gpa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">SAT:</span>
                <span className="font-bold text-gray-900">{athleteProfile.sat}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-lg border-2 border-green-500 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-4xl font-black text-green-600">{eligibleSchools.length}</span>
            </div>
            <p className="text-sm font-semibold text-green-800">Schools You Can Contact</p>
            <p className="text-xs text-green-700 mt-1">You meet their performance standards</p>
          </div>

          <div className="bg-red-50 rounded-xl shadow-lg border-2 border-red-500 p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <span className="text-4xl font-black text-red-600">{ineligibleSchools.length}</span>
            </div>
            <p className="text-sm font-semibold text-red-800">Schools Out of Reach</p>
            <p className="text-xs text-red-700 mt-1">Need to improve times to contact</p>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-8 flex items-start">
          <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-900 font-semibold mb-1">How School Matching Works</p>
            <p className="text-blue-800 text-sm">
              Each school sets minimum performance standards for their program. You can only message schools where you meet their requirements. 
              Keep training and updating your PRs to unlock more schools!
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            Schools You Can Contact ({eligibleSchools.length})
          </h2>

          <div className="space-y-6">
            {eligibleSchools.map((school, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-green-500 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 mr-3">{school.name}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                        ELIGIBLE
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {school.division} • {school.conference} • {school.location}
                    </p>
                    <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg inline-flex">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {school.reason}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-4xl font-black text-green-600 mb-1">
                      {school.matchScore}%
                    </div>
                    <p className="text-xs text-gray-600">Match Score</p>
                  </div>
                </div>

                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Their Performance Requirements:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">400m Range:</span>
                      <span className="font-bold text-gray-900">
                        {school.requirements['400m'].max} - {school.requirements['400m'].min}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">800m Range:</span>
                      <span className="font-bold text-gray-900">
                        {school.requirements['800m'].max} - {school.requirements['800m'].min}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Min GPA:</span>
                      <span className="font-bold text-gray-900">{school.requirements.minGPA}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Min SAT:</span>
                      <span className="font-bold text-gray-900">{school.requirements.minSAT}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link 
                    href={`/schools/${school.name.toLowerCase().replace(/\s+/g, '-').replace('university-of-', '')}`}
                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition text-center"
                  >
                    View School Profile
                  </Link>
                  <Link
                    href={`/messages/${school.name.toLowerCase().replace(/\s+/g, '-').replace('university-of-', '')}`}
                    className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Message Coach
                  </Link>
                  <button className="bg-gray-100 text-gray-900 p-3 rounded-lg hover:bg-gray-200 transition">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
            Schools Currently Out of Reach ({ineligibleSchools.length})
          </h2>

          <div className="space-y-6">
            {ineligibleSchools.map((school, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-red-300 p-6 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 mr-3">{school.name}</h3>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                        NOT ELIGIBLE
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {school.division} • {school.conference} • {school.location}
                    </p>
                    <div className="flex items-center text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg inline-flex">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {school.reason}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-4xl font-black text-red-600 mb-1">
                      {school.matchScore}%
                    </div>
                    <p className="text-xs text-gray-600">Match Score</p>
                  </div>
                </div>

                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Their Performance Requirements:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">400m Range:</span>
                      <span className="font-bold text-gray-900">
                        {school.requirements['400m'].max} - {school.requirements['400m'].min}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">800m Range:</span>
                      <span className="font-bold text-gray-900">
                        {school.requirements['800m'].max} - {school.requirements['800m'].min}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link 
                    href={`/schools/${school.name.toLowerCase().replace(/\s+/g, '-').replace('university-of-', '')}`}
                    className="flex-1 bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-bold text-center"
                  >
                    View School Profile
                  </Link>
                  <button 
                    disabled
                    className="bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-bold cursor-not-allowed flex items-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Cannot Contact
                  </button>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Keep training!</strong> Update your PRs when you improve to unlock this school.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  )
}
