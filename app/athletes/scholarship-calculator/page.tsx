'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, DollarSign, TrendingUp, AlertCircle, Calculator, Award } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function ScholarshipCalculator() {
  const [selectedSchool, setSelectedSchool] = useState('michigan')
  const [event, setEvent] = useState('400m')
  const [time, setTime] = useState('48.2')
  const [gpa, setGpa] = useState('3.8')
  const [sat, setSat] = useState('1340')

  const schools = [
    { id: 'michigan', name: 'University of Michigan', tuition: 32000, division: 'D1' },
    { id: 'ohio-state', name: 'Ohio State University', tuition: 28000, division: 'D1' },
    { id: 'penn-state', name: 'Penn State University', tuition: 30000, division: 'D1' },
    { id: 'indiana', name: 'Indiana University', tuition: 26000, division: 'D1' }
  ]

  const calculateScholarship = () => {
    const school = schools.find(s => s.id === selectedSchool)
    if (!school) return { percentage: 0, amount: 0, total: 0 }

    // Performance-based calculation
    let performanceScore = 0
    if (event === '400m') {
      const timeFloat = parseFloat(time)
      if (timeFloat < 47.0) performanceScore = 100
      else if (timeFloat < 48.0) performanceScore = 80
      else if (timeFloat < 49.0) performanceScore = 60
      else if (timeFloat < 50.0) performanceScore = 40
      else performanceScore = 20
    }

    // Academic bonus
    const gpaFloat = parseFloat(gpa)
    const satInt = parseInt(sat)
    let academicBonus = 0
    if (gpaFloat >= 3.8 && satInt >= 1300) academicBonus = 20
    else if (gpaFloat >= 3.5 && satInt >= 1200) academicBonus = 10
    else if (gpaFloat >= 3.0) academicBonus = 5

    const totalPercentage = Math.min(100, performanceScore + academicBonus)
    const annualAmount = (school.tuition * totalPercentage) / 100
    const fourYearTotal = annualAmount * 4

    return {
      percentage: totalPercentage,
      amount: annualAmount,
      total: fourYearTotal,
      tuition: school.tuition
    }
  }

  const scholarship = calculateScholarship()
  const selectedSchoolData = schools.find(s => s.id === selectedSchool)

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center">
            <Calculator className="w-10 h-10 mr-3" />
            Scholarship Calculator
          </h1>
          <p className="text-xl text-gray-600">Estimate your athletic scholarship based on performance and academics</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select School</label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none font-semibold"
                >
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Event</label>
                <select
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none font-semibold"
                >
                  <option value="100m">100m</option>
                  <option value="200m">200m</option>
                  <option value="400m">400m</option>
                  <option value="800m">800m</option>
                  <option value="1500m">1500m</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Record</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="48.2"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none font-semibold"
                />
                <p className="text-xs text-gray-600 mt-1">Enter time in seconds (e.g., 48.2)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GPA</label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="3.8"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SAT Score</label>
                <input
                  type="text"
                  value={sat}
                  onChange={(e) => setSat(e.target.value)}
                  placeholder="1340"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estimated Scholarship</h2>
              
              <div className="bg-white rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Scholarship Percentage</p>
                <p className="text-6xl font-black text-gray-900">{scholarship.percentage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${scholarship.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Annual Tuition</p>
                  <p className="text-2xl font-black text-gray-900">${scholarship.tuition.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Annual Scholarship</p>
                  <p className="text-2xl font-black text-green-600">${Math.round(scholarship.amount).toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Your Annual Cost</p>
                  <p className="text-2xl font-black text-gray-900">${Math.round(scholarship.tuition - scholarship.amount).toLocaleString()}</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-trackrecruit-yellow">4-Year Total Scholarship</p>
                  <p className="text-3xl font-black text-trackrecruit-yellow">${Math.round(scholarship.total).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How It's Calculated</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-900">Performance Score</span>
                  </div>
                  <span className="text-lg font-black text-blue-600">
                    {parseFloat(time) < 47.0 ? '100%' : parseFloat(time) < 48.0 ? '80%' : parseFloat(time) < 49.0 ? '60%' : '40%'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-900">Academic Bonus</span>
                  </div>
                  <span className="text-lg font-black text-green-600">
                    {parseFloat(gpa) >= 3.8 && parseInt(sat) >= 1300 ? '+20%' : parseFloat(gpa) >= 3.5 ? '+10%' : '+5%'}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is an estimate based on typical scholarship ranges. Actual offers may vary based on team needs, recruiting budget, and other factors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">💡 Tips to Maximize Your Scholarship</h3>
          <ul className="space-y-2 text-yellow-900">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Improve your times:</strong> Every 0.5s improvement in the 400m can increase your scholarship by 10-20%</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Maintain strong academics:</strong> A GPA above 3.8 and SAT above 1300 can add 20% to your offer</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Apply early:</strong> Schools have larger budgets at the start of recruiting season</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Consider multiple events:</strong> Being versatile (400m + 800m) makes you more valuable</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </RoleGuard>
  )
}
