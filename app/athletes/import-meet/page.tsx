'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, FileText, Check, AlertCircle, Trophy, Calendar } from 'lucide-react'

export default function ImportMeet() {
  const [importMethod, setImportMethod] = useState<'athletic.net' | 'milesplit' | 'manual'>('athletic.net')
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [previewResults, setPreviewResults] = useState<any[]>([])

  const handleImport = () => {
    setImporting(true)
    
    // Simulate import process
    setTimeout(() => {
      setPreviewResults([
        { event: '400m', time: '48.2s', place: '1st', meet: 'State Championship', date: '2025-05-17', isPR: true },
        { event: '800m', time: '1:52.8', place: '3rd', meet: 'State Championship', date: '2025-05-17', isPR: true },
        { event: '4x400m Relay', time: '3:18.4', place: '2nd', meet: 'State Championship', date: '2025-05-17', isPR: false }
      ])
      setImporting(false)
      setImportSuccess(true)
    }, 2000)
  }

  const handleConfirmImport = () => {
    // In production, this would save to database
    alert('Results imported successfully!')
    setImportSuccess(false)
    setPreviewResults([])
    setImportUrl('')
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Import Meet Results</h1>
          <p className="text-xl text-gray-600">Automatically import your race results from Athletic.net or MileSplit</p>
        </div>

        {/* Import Method Selection */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Import Method</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setImportMethod('athletic.net')}
              className={`p-6 rounded-lg border-2 transition ${
                importMethod === 'athletic.net'
                  ? 'border-trackrecruit-yellow bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-gray-900 mb-1">Athletic.net</h3>
                <p className="text-sm text-gray-600">Import from Athletic.net profile</p>
              </div>
            </button>

            <button
              onClick={() => setImportMethod('milesplit')}
              className={`p-6 rounded-lg border-2 transition ${
                importMethod === 'milesplit'
                  ? 'border-trackrecruit-yellow bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-red-600" />
                <h3 className="font-bold text-gray-900 mb-1">MileSplit</h3>
                <p className="text-sm text-gray-600">Import from MileSplit profile</p>
              </div>
            </button>

            <button
              onClick={() => setImportMethod('manual')}
              className={`p-6 rounded-lg border-2 transition ${
                importMethod === 'manual'
                  ? 'border-trackrecruit-yellow bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <h3 className="font-bold text-gray-900 mb-1">Manual Entry</h3>
                <p className="text-sm text-gray-600">Enter results manually</p>
              </div>
            </button>
          </div>

          {importMethod !== 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {importMethod === 'athletic.net' ? 'Athletic.net Profile URL' : 'MileSplit Profile URL'}
                </label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder={
                    importMethod === 'athletic.net'
                      ? 'https://www.athletic.net/athlete/12345678'
                      : 'https://www.milesplit.com/athletes/12345678'
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                />
              </div>

              <button
                onClick={handleImport}
                disabled={!importUrl || importing}
                className="w-full bg-trackrecruit-yellow text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Importing Results...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Import Results
                  </>
                )}
              </button>

              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">API Integration Required</p>
                  <p>Automatic imports require API access to Athletic.net/MileSplit. This feature will be available after backend integration.</p>
                </div>
              </div>
            </div>
          )}

          {importMethod === 'manual' && (
            <Link
              href="/athletes/meets"
              className="block w-full bg-trackrecruit-yellow text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition text-center"
            >
              Go to Meet Results Page
            </Link>
          )}
        </div>

        {/* Preview Results */}
        {importSuccess && previewResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-500 p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Check className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Import Preview</h2>
                <p className="text-gray-600">Review results before adding to your profile</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {previewResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900">
                      {result.place.replace(/[^\d]/g, '')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{result.event}</h3>
                      <p className="text-sm text-gray-600">{result.meet} • {result.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{result.time}</p>
                    {result.isPR && (
                      <span className="text-xs font-bold text-green-600">NEW PR!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmImport}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm & Import
              </button>
              <button
                onClick={() => {
                  setImportSuccess(false)
                  setPreviewResults([])
                }}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:border-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Copy Your Profile URL</h3>
                <p className="text-gray-600">Go to your Athletic.net or MileSplit profile and copy the URL from your browser</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Paste & Import</h3>
                <p className="text-gray-600">Paste the URL above and click Import. We'll automatically fetch your meet results</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Review & Confirm</h3>
                <p className="text-gray-600">Preview the imported results and confirm to add them to your TrackRecruit profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
