'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

export default function NationalRankingsPage() {
  const [rankings, setRankings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women'>('Men')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    loadRankings()
  }, [selectedGender])

  const loadRankings = async () => {
    setLoading(true)
    try {
      // Create client without auth to avoid lock issues
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      )
      
      const { data, error } = await supabase
        .from('national_team_rankings')
        .select('*')
        .eq('gender', selectedGender)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      
      if (data && (data as any).rankings) {
        setRankings((data as any).rankings)
      }
    } catch (err) {
      console.error('Error loading rankings:', err)
      setRankings([])
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(rankings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRankings = rankings.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
                <h1 className="text-3xl font-black text-gray-900">National College Rankings</h1>
                <p className="text-gray-700 mt-1">NCAA Division I Track & Field Team Rankings</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Gender Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border-2 border-gray-900 rounded-lg p-1 inline-flex">
              <button
                onClick={() => {
                  setSelectedGender('Men')
                  setCurrentPage(1)
                }}
                className={`px-8 py-3 rounded-lg font-bold transition ${
                  selectedGender === 'Men'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Men's Teams
              </button>
              <button
                onClick={() => {
                  setSelectedGender('Women')
                  setCurrentPage(1)
                }}
                className={`px-8 py-3 rounded-lg font-bold transition ${
                  selectedGender === 'Women'
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Women's Teams
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading rankings...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Available</h3>
              <p className="text-gray-600 mb-4">Rankings data will be available soon</p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://web4.ustfccca.org/iz/tfri/collection/17387"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  View Men's Rankings
                </a>
                <a
                  href="https://web4.ustfccca.org/iz/tfri/collection/17388"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition"
                >
                  View Women's Rankings
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Rankings Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className={`px-6 py-4 ${selectedGender === 'Men' ? 'bg-blue-600' : 'bg-pink-600'} text-white`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {selectedGender === 'Men' ? "Men's" : "Women's"} NCAA Division I Rankings
                    </h2>
                    <span className="text-sm opacity-90">
                      Showing {startIndex + 1}-{Math.min(endIndex, rankings.length)} of {rankings.length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-900 bg-gray-50">
                        <th className="text-left py-4 px-6 font-bold text-gray-900 w-20">Rank</th>
                        <th className="text-left py-4 px-6 font-bold text-gray-900">School</th>
                        <th className="text-right py-4 px-6 font-bold text-gray-900 w-32">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRankings.map((team: any, idx: number) => {
                        const actualRank = startIndex + idx + 1
                        return (
                          <tr
                            key={idx}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                              actualRank <= 3 ? 'bg-yellow-50' : ''
                            }`}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                {actualRank === 1 && (
                                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                                    <Trophy className="w-5 h-5 text-gray-900" />
                                  </div>
                                )}
                                {actualRank === 2 && (
                                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                    <Trophy className="w-5 h-5 text-gray-700" />
                                  </div>
                                )}
                                {actualRank === 3 && (
                                  <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                                    <Trophy className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <span className={`text-2xl font-black ${
                                  actualRank <= 3 ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {actualRank}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`text-lg ${
                                actualRank <= 3 ? 'font-black text-gray-900' : 'font-semibold text-gray-800'
                              }`}>
                                {team.team}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              {team.points && (
                                <span className="text-lg font-bold text-gray-900">
                                  {team.points}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border-2 border-gray-300 hover:border-trackrecruit-yellow disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg font-bold transition ${
                            currentPage === page
                              ? 'bg-trackrecruit-yellow text-gray-900 border-2 border-gray-900'
                              : 'border-2 border-gray-300 text-gray-700 hover:border-trackrecruit-yellow'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border-2 border-gray-300 hover:border-trackrecruit-yellow disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">About These Rankings</h3>
                <p className="text-blue-800 text-sm">
                  These rankings are compiled by the U.S. Track & Field and Cross Country Coaches Association (USTFCCCA) 
                  and represent the top NCAA Division I programs based on recent performance and team strength.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
  )
}
