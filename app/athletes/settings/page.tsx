'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Link as LinkIcon, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function AthleteSettings() {
  const { profile } = useAuth()
  const supabase = createClient()
  
  const [mileSplitUrl, setMileSplitUrl] = useState('')
  const [athleticNetUrl, setAthleticNetUrl] = useState('')
  const [athleteProfileId, setAthleteProfileId] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadSettings()
    }
  }, [profile])

  const loadSettings = async () => {
    try {
      const { data: athleteProfile } = await supabase
        .from('athlete_profiles')
        .select('id, milesplit_url, athletic_net_url')
        .eq('profile_id', profile?.id)
        .single()

      if (athleteProfile) {
        setAthleteProfileId(athleteProfile.id)
        setMileSplitUrl(athleteProfile.milesplit_url || '')
        setAthleticNetUrl(athleteProfile.athletic_net_url || '')
      }
    } catch (err) {
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUrls = async () => {
    try {
      setError('')
      setSuccess('')

      const { error: updateError } = await supabase
        .from('athlete_profiles')
        .update({
          milesplit_url: mileSplitUrl || null,
          athletic_net_url: athleticNetUrl || null
        })
        .eq('id', athleteProfileId)

      if (updateError) throw updateError

      setSuccess('Profile links saved!')
    } catch (err: any) {
      setError(err.message || 'Failed to save links')
    }
  }

  const handleSync = async (url: string, source: 'milesplit' | 'athletic.net') => {
    if (!url) {
      setError(`Please add your ${source === 'milesplit' ? 'MileSplit' : 'Athletic.net'} URL first`)
      return
    }

    setSyncing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/scrape-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: url,
          athleteProfileId,
          userId: profile?.user_id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync profile')
      }

      setSuccess(`✓ Imported ${data.imported.prs} PRs and ${data.imported.meetResults} meet results from ${source}!`)
      
      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.href = '/athletes'
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to sync profile')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRole="athlete">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-trackrecruit-yellow border-b-4 border-gray-900 py-6">
          <div className="max-w-4xl mx-auto px-4">
            <Link href="/athletes" className="inline-flex items-center text-gray-900 font-bold mb-4 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Profile Settings</h1>
            <p className="text-gray-700 mt-2">Link your MileSplit or Athletic.net profile</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-3">🔗 Auto-Import Your Data</h3>
            <ol className="space-y-2 text-blue-800">
              <li><strong>1.</strong> Copy your MileSplit or Athletic.net profile URL</li>
              <li><strong>2.</strong> Paste it below and click Save</li>
              <li><strong>3.</strong> Click "Sync Now" to automatically import your PRs and meet results</li>
              <li><strong>4.</strong> Your data will be marked as verified ✓</li>
            </ol>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* MileSplit Section */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <LinkIcon className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-900">MileSplit Profile</h3>
            </div>
            
            <input
              type="url"
              value={mileSplitUrl}
              onChange={(e) => setMileSplitUrl(e.target.value)}
              placeholder="https://www.milesplit.com/athletes/12345-your-name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-trackrecruit-yellow focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSaveUrls}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Save URL
              </button>
              
              <button
                onClick={() => handleSync(mileSplitUrl, 'milesplit')}
                disabled={syncing || !mileSplitUrl}
                className="flex items-center gap-2 px-6 py-2 bg-trackrecruit-yellow text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition border-2 border-gray-900 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* Athletic.net Section */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <LinkIcon className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-900">Athletic.net Profile</h3>
            </div>
            
            <input
              type="url"
              value={athleticNetUrl}
              onChange={(e) => setAthleticNetUrl(e.target.value)}
              placeholder="https://www.athletic.net/athlete/12345/cross-country"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-trackrecruit-yellow focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSaveUrls}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Save URL
              </button>
              
              <button
                onClick={() => handleSync(athleticNetUrl, 'athletic.net')}
                disabled={syncing || !athleticNetUrl}
                className="flex items-center gap-2 px-6 py-2 bg-trackrecruit-yellow text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition border-2 border-gray-900 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
