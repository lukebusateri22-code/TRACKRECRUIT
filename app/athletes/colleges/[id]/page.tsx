'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Users, DollarSign, TrendingUp, GraduationCap, ExternalLink, Mail, Phone, Award, Target } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'
import { createClient } from '@/lib/supabase/client'

export default function CollegeDetailPage() {
  const params = useParams()
  const collegeId = params.id as string
  
  const [college, setCollege] = useState<any>(null)
  const [coaches, setCoaches] = useState<any[]>([])
  const [recruitingStandards, setRecruitingStandards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    if (collegeId) {
      loadCollegeData()
    }
  }, [collegeId])

  const loadCollegeData = async () => {
    try {
      // Load college info
      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', collegeId)
        .single()

      if (collegeError) throw collegeError
      setCollege(collegeData)

      // Load coach contacts
      const { data: coachData } = await supabase
        .from('college_coach_contacts')
        .select('*')
        .eq('college_id', collegeId)
        .order('is_verified', { ascending: false })

      setCoaches(coachData || [])

      // Load recruiting standards
      const { data: standardsData } = await supabase
        .from('recruiting_standards')
        .select('*')
        .eq('college_id', collegeId)
        .order('event')

      setRecruitingStandards(standardsData || [])

    } catch (err) {
      console.error('Error loading college data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading college information...</p>
        </div>
      </div>
    )
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College not found</h2>
          <Link href="/athletes/colleges" className="text-blue-600 hover:text-blue-800">
            ← Back to colleges
          </Link>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRole="athlete">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link
                href="/athletes/colleges"
                className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">{college.name}</h1>
                <div className="flex items-center text-gray-700 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{college.city}, {college.state}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Facts */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Facts</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Division</p>
                      <p className="font-bold text-gray-900">{college.ncaa_division}</p>
                    </div>
                  </div>
                  {college.conference && (
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-purple-600 mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Conference</p>
                        <p className="font-bold text-gray-900">{college.conference}</p>
                      </div>
                    </div>
                  )}
                  {college.total_enrollment && (
                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-green-600 mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Enrollment</p>
                        <p className="font-bold text-gray-900">{college.total_enrollment.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {college.acceptance_rate && (
                    <div className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-yellow-600 mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Acceptance Rate</p>
                        <p className="font-bold text-gray-900">{college.acceptance_rate}%</p>
                      </div>
                    </div>
                  )}
                  {college.graduation_rate && (
                    <div className="flex items-start">
                      <GraduationCap className="w-5 h-5 text-indigo-600 mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Graduation Rate</p>
                        <p className="font-bold text-gray-900">{college.graduation_rate}%</p>
                      </div>
                    </div>
                  )}
                  {college.region && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-red-600 mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Region</p>
                        <p className="font-bold text-gray-900">{college.region}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              {(college.tuition_in_state || college.tuition_out_state || college.room_and_board) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-6 h-6 mr-2" />
                    Cost of Attendance
                  </h2>
                  <div className="space-y-3">
                    {college.tuition_in_state && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">In-State Tuition</span>
                        <span className="font-bold text-gray-900">${college.tuition_in_state.toLocaleString()}/year</span>
                      </div>
                    )}
                    {college.tuition_out_state && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Out-of-State Tuition</span>
                        <span className="font-bold text-gray-900">${college.tuition_out_state.toLocaleString()}/year</span>
                      </div>
                    )}
                    {college.room_and_board && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Room & Board</span>
                        <span className="font-bold text-gray-900">${college.room_and_board.toLocaleString()}/year</span>
                      </div>
                    )}
                    {college.avg_financial_aid && (
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Avg. Financial Aid</span>
                        <span className="font-bold text-green-600">${college.avg_financial_aid.toLocaleString()}/year</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recruiting Standards */}
              {recruitingStandards.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    Recruiting Standards
                  </h2>
                  <p className="text-gray-600 mb-4">Performance standards for different levels of recruitment</p>
                  
                  <div className="space-y-4">
                    {recruitingStandards.map((standard) => (
                      <div key={standard.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900">{standard.event}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            {standard.gender}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {standard.walk_on_standard && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Walk-On</p>
                              <p className="font-bold text-gray-900">{standard.walk_on_standard}</p>
                            </div>
                          )}
                          {standard.scholarship_standard && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Scholarship</p>
                              <p className="font-bold text-green-600">{standard.scholarship_standard}</p>
                            </div>
                          )}
                          {standard.competitive_standard && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Competitive</p>
                              <p className="font-bold text-purple-600">{standard.competitive_standard}</p>
                            </div>
                          )}
                        </div>
                        {standard.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{standard.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    Recruiting Standards
                  </h2>
                  <p className="text-gray-600">Recruiting standards for this program are not yet available.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Track Programs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Track Programs</h3>
                <div className="space-y-2">
                  {college.has_mens_track && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-900">Men's Track & Field</span>
                    </div>
                  )}
                  {college.has_womens_track && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-900">Women's Track & Field</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coach Contacts */}
              {coaches.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Coaching Staff</h3>
                  <div className="space-y-4">
                    {coaches.map((coach) => (
                      <div key={coach.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{coach.first_name} {coach.last_name}</p>
                            {coach.title && (
                              <p className="text-sm text-gray-600">{coach.title}</p>
                            )}
                          </div>
                          {coach.is_verified && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                              Verified
                            </span>
                          )}
                        </div>
                        {coach.email && (
                          <a href={`mailto:${coach.email}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-1">
                            <Mail className="w-4 h-4 mr-1" />
                            {coach.email}
                          </a>
                        )}
                        {coach.phone && (
                          <a href={`tel:${coach.phone}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <Phone className="w-4 h-4 mr-1" />
                            {coach.phone}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Links</h3>
                <div className="space-y-2">
                  {college.website_url && (
                    <a
                      href={college.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      College Website
                    </a>
                  )}
                  {college.athletics_url && (
                    <a
                      href={college.athletics_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Athletics Website
                    </a>
                  )}
                  {college.track_roster_url && (
                    <a
                      href={college.track_roster_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Track & Field Roster
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
