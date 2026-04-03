'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Check, ExternalLink, MapPin, Users, DollarSign, Trophy, GraduationCap } from 'lucide-react'

export default function CompareSchools() {
  const [selectedSchools, setSelectedSchools] = useState([
    {
      id: 'michigan',
      name: 'University of Michigan',
      location: 'Ann Arbor, MI',
      division: 'D1',
      conference: 'Big Ten',
      tuition: '$32,000/year',
      teamSize: 45,
      requirements: { '400m': '48.5s', '800m': '1:53.0', gpa: 3.5, sat: 1300 },
      facilities: ['Indoor track', 'Outdoor track', 'Weight room', 'Sports medicine'],
      scholarships: 'Full & Partial available',
      coachContact: 'coach.anderson@umich.edu',
      applicationLink: 'https://admissions.umich.edu/apply'
    },
    {
      id: 'ohio-state',
      name: 'Ohio State University',
      location: 'Columbus, OH',
      division: 'D1',
      conference: 'Big Ten',
      tuition: '$28,000/year',
      teamSize: 52,
      requirements: { '400m': '48.0s', '800m': '1:52.5', gpa: 3.3, sat: 1250 },
      facilities: ['Indoor track', 'Outdoor track', 'Weight room', 'Recovery center'],
      scholarships: 'Full & Partial available',
      coachContact: 'coach.williams@osu.edu',
      applicationLink: 'https://undergrad.osu.edu/apply'
    }
  ])

  const availableSchools = [
    { id: 'penn-state', name: 'Penn State University' },
    { id: 'indiana', name: 'Indiana University' },
    { id: 'wisconsin', name: 'University of Wisconsin' },
    { id: 'illinois', name: 'University of Illinois' }
  ]

  const addSchool = (schoolId: string) => {
    // In real app, fetch school data
    console.log('Add school:', schoolId)
  }

  const removeSchool = (schoolId: string) => {
    setSelectedSchools(selectedSchools.filter(s => s.id !== schoolId))
  }

  return (
    
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
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Compare Schools</h1>
          <p className="text-xl text-gray-600">Side-by-side comparison of programs</p>
        </div>

        {/* Add School Dropdown */}
        {selectedSchools.length < 4 && (
          <div className="mb-8">
            <select
              onChange={(e) => addSchool(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none font-semibold"
            >
              <option value="">+ Add School to Compare</option>
              {availableSchools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-bold">Category</th>
                  {selectedSchools.map(school => (
                    <th key={school.id} className="px-6 py-4 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-black text-lg">{school.name}</div>
                          <div className="text-sm text-gray-300 font-normal">{school.location}</div>
                        </div>
                        <button
                          onClick={() => removeSchool(school.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Division & Conference */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">Division & Conference</td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">{school.division}</div>
                      <div className="text-sm text-gray-600">{school.conference}</div>
                    </td>
                  ))}
                </tr>

                {/* Tuition */}
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Annual Tuition
                  </td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-xl font-black text-gray-900">{school.tuition}</div>
                    </td>
                  ))}
                </tr>

                {/* Team Size */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team Size
                  </td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">{school.teamSize} athletes</div>
                    </td>
                  ))}
                </tr>

                {/* Performance Requirements */}
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    400m Requirement
                  </td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-xl font-black text-trackrecruit-yellow">{school.requirements['400m']}</div>
                      <div className="text-xs text-green-600 font-semibold mt-1">✓ You qualify (48.2s)</div>
                    </td>
                  ))}
                </tr>

                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    800m Requirement
                  </td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-xl font-black text-trackrecruit-yellow">{school.requirements['800m']}</div>
                      <div className="text-xs text-green-600 font-semibold mt-1">✓ You qualify (1:52.8)</div>
                    </td>
                  ))}
                </tr>

                {/* Academic Requirements */}
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    GPA Requirement
                  </td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">{school.requirements.gpa}</div>
                      <div className="text-xs text-green-600 font-semibold mt-1">✓ You qualify (3.8)</div>
                    </td>
                  ))}
                </tr>

                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    SAT Requirement
                  </td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">{school.requirements.sat}</div>
                      <div className="text-xs text-green-600 font-semibold mt-1">✓ You qualify (1340)</div>
                    </td>
                  ))}
                </tr>

                {/* Facilities */}
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Facilities</td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <ul className="space-y-1">
                        {school.facilities.map((facility, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            {facility}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Scholarships */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">Scholarships</td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">{school.scholarships}</div>
                      <Link href="/athletes/scholarship-calculator" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                        Calculate your offer →
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* Contact & Apply */}
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Actions</td>
                  {selectedSchools.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <div className="space-y-2">
                        <a
                          href={`mailto:${school.coachContact}`}
                          className="block text-center px-4 py-2 bg-trackrecruit-yellow text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition"
                        >
                          Contact Coach
                        </a>
                        <a
                          href={school.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">You Qualify</h3>
            <p className="text-3xl font-black text-green-600">{selectedSchools.length}/{selectedSchools.length}</p>
            <p className="text-sm text-green-700 mt-2">All selected schools match your profile</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Avg. Tuition</h3>
            <p className="text-3xl font-black text-blue-600">$30,000</p>
            <p className="text-sm text-blue-700 mt-2">Before scholarships</p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Best Fit</h3>
            <p className="text-xl font-black text-yellow-600">Ohio State</p>
            <p className="text-sm text-yellow-700 mt-2">Based on your performance</p>
          </div>
        </div>
      </div>
    </div>
    
  )
}
