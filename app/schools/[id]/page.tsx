'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Trophy, Users, MessageSquare, Star, CheckCircle, XCircle, TrendingUp, Award, GraduationCap, FileText, DollarSign } from 'lucide-react'
import { getCollegeById } from '@/lib/colleges'

export default function SchoolProfile() {
  const params = useParams()
  const school = getCollegeById(params.id as string)

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">School Not Found</h1>
          <Link href="/search" className="text-blue-600 hover:underline">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const athleteProfile = {
    events: {
      '400m': '48.2s',
      '800m': '1:52.8'
    },
    gpa: 3.8,
    sat: 1340
  }

  const meetsRequirements = 
    parseFloat(athleteProfile.events['400m']) <= parseFloat(school.requirements['400m'].min) &&
    athleteProfile.gpa >= school.minGPA &&
    athleteProfile.sat >= school.minSAT

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Branded Header */}
      <div 
        className="border-b-4"
        style={{ 
          backgroundColor: school.primaryColor,
          borderColor: school.secondaryColor
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/athletes/eligible-schools" 
            className="flex items-center mb-4 hover:opacity-80 transition"
            style={{ color: school.secondaryColor }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-semibold">Back to Eligible Schools</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mr-6 border-4"
                style={{ 
                  backgroundColor: school.secondaryColor,
                  color: school.primaryColor,
                  borderColor: school.secondaryColor
                }}
              >
                {school.logo}
              </div>
              <div>
                <h1 
                  className="text-4xl font-black mb-2"
                  style={{ color: school.secondaryColor }}
                >
                  {school.name}
                </h1>
                <p 
                  className="text-xl mb-2"
                  style={{ color: school.secondaryColor, opacity: 0.9 }}
                >
                  {school.mascot} • {school.division} • {school.conference}
                </p>
                <div 
                  className="flex items-center text-sm"
                  style={{ color: school.secondaryColor, opacity: 0.8 }}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  {school.location}
                </div>
              </div>
            </div>
            
            {meetsRequirements ? (
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                YOU QUALIFY!
              </div>
            ) : (
              <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold flex items-center">
                <XCircle className="w-6 h-6 mr-2" />
                NOT ELIGIBLE
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Program Overview */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Program Overview</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: `${school.primaryColor}15` }}
                >
                  <Users className="w-8 h-8 mx-auto mb-2" style={{ color: school.primaryColor }} />
                  <div className="text-3xl font-black text-gray-900">{school.teamSize}</div>
                  <p className="text-sm text-gray-600">Team Size</p>
                </div>
                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: `${school.primaryColor}15` }}
                >
                  <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: school.primaryColor }} />
                  <div className="text-3xl font-black text-gray-900">{school.scholarships}</div>
                  <p className="text-sm text-gray-600">Scholarships</p>
                </div>
                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: `${school.primaryColor}15` }}
                >
                  <Award className="w-8 h-8 mx-auto mb-2" style={{ color: school.primaryColor }} />
                  <div className="text-3xl font-black text-gray-900">{school.conference}</div>
                  <p className="text-sm text-gray-600">Conference</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Recent Achievements</h3>
                <ul className="space-y-2">
                  {school.recentAchievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <Trophy className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: school.primaryColor }} />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {school.facilities.map((facility, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: school.primaryColor }}
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Requirements */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Performance Requirements</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">400m Range</span>
                    <span className="font-black text-gray-900">
                      {school.requirements['400m'].max} - {school.requirements['400m'].min}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Your PR: {athleteProfile.events['400m']}</span>
                    {parseFloat(athleteProfile.events['400m']) <= parseFloat(school.requirements['400m'].min) ? (
                      <span className="text-green-600 font-bold flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Meets Standard
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        Need {(parseFloat(athleteProfile.events['400m']) - parseFloat(school.requirements['400m'].min)).toFixed(1)}s improvement
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">800m Range</span>
                    <span className="font-black text-gray-900">
                      {school.requirements['800m'].max} - {school.requirements['800m'].min}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Your PR: {athleteProfile.events['800m']}</span>
                    <span className="text-green-600 font-bold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Meets Standard
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Minimum GPA</p>
                  <p className="text-2xl font-black text-gray-900">{school.minGPA}</p>
                  <p className="text-xs text-gray-500">Your GPA: {athleteProfile.gpa}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Minimum SAT</p>
                  <p className="text-2xl font-black text-gray-900">{school.minSAT}</p>
                  <p className="text-xs text-gray-500">Your SAT: {athleteProfile.sat}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Division</p>
                  <p className="text-2xl font-black text-gray-900">{school.division}</p>
                  <p className="text-xs text-gray-500">{school.conference}</p>
                </div>
              </div>
            </div>

            {/* Coaching Staff */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Coaching Staff</h2>
              <div className="flex items-center mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mr-4"
                  style={{ 
                    backgroundColor: school.primaryColor,
                    color: school.secondaryColor
                  }}
                >
                  {school.headCoach.split(' ')[1][0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{school.headCoach}</h3>
                  <p className="text-gray-600">Head Coach</p>
                  <a href={`mailto:${school.coachEmail}`} className="text-sm hover:underline" style={{ color: school.primaryColor }}>
                    {school.coachEmail}
                  </a>
                </div>
              </div>
              <a 
                href={`https://${school.teamWebsite}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline"
                style={{ color: school.primaryColor }}
              >
                Visit Team Website →
              </a>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div 
              className="rounded-xl shadow-lg p-6 text-white"
              style={{ backgroundColor: school.primaryColor }}
            >
              <h3 className="text-2xl font-black mb-4">Take Action</h3>
              
              {meetsRequirements ? (
                <div className="space-y-3">
                  <Link
                    href={`/messages?school=${school.id}`}
                    className="block w-full px-6 py-3 rounded-lg font-bold text-center transition hover:opacity-90"
                    style={{ 
                      backgroundColor: school.secondaryColor,
                      color: school.primaryColor
                    }}
                  >
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    Message Coach
                  </Link>
                  <button
                    className="block w-full bg-white bg-opacity-20 px-6 py-3 rounded-lg font-bold text-center hover:bg-opacity-30 transition"
                  >
                    <Star className="w-5 h-5 inline mr-2" />
                    Save School
                  </button>
                  <button
                    className="block w-full bg-white bg-opacity-20 px-6 py-3 rounded-lg font-bold text-center hover:bg-opacity-30 transition"
                  >
                    <GraduationCap className="w-5 h-5 inline mr-2" />
                    Request Info
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-red-500 bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg p-4 mb-4">
                    <p className="font-bold mb-2">Not Eligible Yet</p>
                    <p className="text-sm opacity-90">
                      You don't meet the performance requirements to contact this school. Keep training!
                    </p>
                  </div>
                  <button
                    disabled
                    className="block w-full bg-gray-500 bg-opacity-50 px-6 py-3 rounded-lg font-bold text-center cursor-not-allowed"
                  >
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    Cannot Contact
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <Link href={`/messages/${school.id}`} className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition">
                  <MessageSquare className="w-6 h-6 mr-3" style={{ color: school.primaryColor }} />
                  <span className="font-semibold text-gray-900">Message Coach</span>
                </Link>
                <a 
                  href={`https://admissions.${school.id}.edu/apply`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition"
                >
                  <FileText className="w-6 h-6 mr-3" style={{ color: school.primaryColor }} />
                  <span className="font-semibold text-gray-900">Apply Now</span>
                </a>
                <Link href="/athletes/scholarship-calculator" className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition">
                  <DollarSign className="w-6 h-6 mr-3" style={{ color: school.primaryColor }} />
                  <span className="font-semibold text-gray-900">Calculate Scholarship</span>
                </Link>
                <button className="w-full flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition">
                  <Star className="w-6 h-6 mr-3" style={{ color: school.primaryColor }} />
                  <span className="font-semibold text-gray-900">Save School</span>
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conference:</span>
                  <span className="font-bold text-gray-900">{school.conference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Division:</span>
                  <span className="font-bold text-gray-900">{school.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Size:</span>
                  <span className="font-bold text-gray-900">{school.teamSize} athletes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scholarships:</span>
                  <span className="font-bold text-gray-900">{school.scholarships}</span>
                </div>
              </div>
            </div>

            <div 
              className="rounded-xl shadow-lg p-6"
              style={{ backgroundColor: `${school.primaryColor}10` }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">Why {school.shortName}?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: school.primaryColor }} />
                  <span>Competitive {school.conference} program</span>
                </li>
                <li className="flex items-start">
                  <Trophy className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: school.primaryColor }} />
                  <span>Strong track record of success</span>
                </li>
                <li className="flex items-start">
                  <GraduationCap className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: school.primaryColor }} />
                  <span>Excellent academic reputation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
