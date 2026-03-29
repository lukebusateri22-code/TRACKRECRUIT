'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function UpdatePR() {
  const [userRole, setUserRole] = useState<string>('athlete')
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'athlete'
    setUserRole(role)
    
    // Check if athlete has already visited Milesplit
    const visited = localStorage.getItem('milesplitVisited')
    if (visited) {
      setHasVisited(true)
    }
  }, [])

  const handleMilesplitRedirect = () => {
    // Mark that athlete is going to Milesplit
    localStorage.setItem('milesplitRedirect', 'true')
    
    // Open Milesplit in new tab
    window.open('https://www.milesplit.com', '_blank')
    
    // Mark as visited
    localStorage.setItem('milesplitVisited', 'true')
    setHasVisited(true)
  }

  const handleDataSync = () => {
    // In a real app, this would trigger the Milesplit scraper
    alert('Milesplit data sync initiated! Your PRs will be updated automatically.')
    window.location.href = '/athletes'
  }

  return (
    <RoleGuard allowedRole="athlete">
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/athletes" className="flex items-center">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/athletes" className="text-gray-900 font-semibold hover:text-gray-700">Rankings</Link>
                <Link href="/athletes/search-colleges" className="text-gray-900 font-semibold hover:text-gray-700">Find Colleges</Link>
                <Link href="/athletes/recruiting" className="text-gray-900 font-semibold hover:text-gray-700">Recruiting</Link>
                <Link href="/athletes/goals" className="text-gray-900 font-semibold hover:text-gray-700">Goals</Link>
                <Link href="/athletes/videos" className="text-gray-900 font-semibold hover:text-gray-700">Videos</Link>
                <Link href="/athletes/update-pr" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Update PR</Link>
                <Link href="/athletes/settings" className="text-gray-900 font-semibold hover:text-gray-700">Settings</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/athletes" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Update Personal Records</h1>
            <p className="text-xl text-gray-600">Keep your PRs current with verified Milesplit data</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">How PR Updates Work</h3>
                <p className="text-blue-800 mb-3">
                  TrackRecruit automatically syncs your personal records from Milesplit to ensure accuracy and verification. 
                  This prevents manual entry errors and maintains data integrity for college coaches.
                </p>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Click below to visit Milesplit and update your performances</li>
                  <li>• Your results will be automatically imported and verified</li>
                  <li>• Coaches will see only verified, current PRs</li>
                  <li>• Updates typically process within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            {!hasVisited ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ExternalLink className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Your Milesplit Profile</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Click the button below to visit Milesplit where you can update your performances and results. 
                  Once you've made changes, return here to sync your data with TrackRecruit.
                </p>
                
                <button
                  onClick={handleMilesplitRedirect}
                  className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit Milesplit to Update PRs
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Sync Your Data</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  You've visited Milesplit! Now sync your updated performances with TrackRecruit to ensure 
                  coaches see your most current personal records.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleDataSync}
                    className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition"
                  >
                    Sync Milesplit Data
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    <p>Updates typically process within 24 hours</p>
                    <button
                      onClick={() => {
                        localStorage.removeItem('milesplitVisited')
                        setHasVisited(false)
                      }}
                      className="text-blue-600 hover:underline mt-2"
                    >
                      Visit Milesplit Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current PRs Preview */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Current PRs</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { event: '400m', pr: '48.2s', date: 'May 17, 2025', verified: true },
                { event: '800m', pr: '1:52.8', date: 'May 10, 2025', verified: true },
                { event: '200m', pr: '22.1s', date: 'April 28, 2025', verified: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-900">{item.event}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{item.pr}</p>
                    {item.verified && (
                      <p className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              PRs are automatically imported from Milesplit. Last sync: 2 days ago
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
