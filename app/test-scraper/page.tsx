'use client'

import { useState } from 'react'

export default function TestScraperPage() {
  const [url, setUrl] = useState('https://tx.milesplit.com/athletes/15635072-dillon-mitchell')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const testScraper = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/scrape-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: url,
          athleteProfileId: 'test-id',
          userId: 'test-user'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Test MileSplit Scraper</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-bold mb-2">MileSplit Profile URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4"
          />

          <button
            onClick={testScraper}
            disabled={loading}
            className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Scraper'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-bold">Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Scraper Results:</h2>
            
            <div className="mb-4">
              <h3 className="font-bold">Athlete Info:</h3>
              <pre className="bg-white p-4 rounded mt-2 text-sm">
                {JSON.stringify(result.athleteInfo, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-bold">PRs Found ({result.imported?.prs || 0}):</h3>
              <pre className="bg-white p-4 rounded mt-2 text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
