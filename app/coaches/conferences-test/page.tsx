'use client'

import Link from 'next/link'
import { Trophy, ArrowLeft, Plus } from 'lucide-react'

export default function ConferencesTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/coaches/dashboard" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Conference Library</h1>
                <p className="text-gray-700 mt-1">Manage your TFFRS conferences</p>
              </div>
            </div>
            <Link
              href="/coaches/tffrs-analytics"
              className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Conference
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Message */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <Trophy className="w-8 h-8 text-trackrecruit-yellow mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Conference System Ready</h2>
          </div>
          <p className="text-gray-600 mb-6">
            The conference management system is set up and ready to use. Once you scrape your first conference, 
            it will appear here with full management capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">🎯 Auto-Scraping</h3>
              <p className="text-sm text-gray-600">
                Conferences are automatically scraped every Sunday at 2 AM UTC
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">📊 Analytics</h3>
              <p className="text-sm text-gray-600">
                Visual charts and detailed team performance analysis
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">🔄 Weekly Updates</h3>
              <p className="text-sm text-gray-600">
                Fresh data automatically updated every week
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Conferences Yet</h3>
          <p className="text-gray-600 mb-6">
            Start by scraping your first TFFRS conference to build your library
          </p>
          <Link
            href="/coaches/tffrs-analytics"
            className="inline-flex items-center bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Scrape First Conference
          </Link>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-3">🚀 Quick Start Guide</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Go to Conference Analytics and enter a TFFRS URL</li>
            <li>Click "Analyze Conference" to scrape the data</li>
            <li>The conference will automatically appear in this library</li>
            <li>Every Sunday at 2 AM UTC, all conferences update automatically</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
