'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function DebugDatabasePage() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    debugDatabase()
  }, [])

  const debugDatabase = async () => {
    try {
      addLog('🔍 Starting database debug...')
      const supabase = createClient()

      // Test 1: Check environment variables
      addLog(`📋 NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`)
      addLog(`📋 NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`)

      // Test 2: Check if tables exist
      addLog('🔍 Checking if tffrs_conferences table exists...')
      const { data: conferences, error: confError } = await supabase
        .from('tffrs_conferences')
        .select('count')
        .limit(1)

      if (confError) {
        addLog(`❌ tffrs_conferences error: ${confError.message} (Code: ${confError.code})`)
      } else {
        addLog('✅ tffrs_conferences table exists and accessible')
      }

      // Test 3: Check teams table
      addLog('🔍 Checking if tffrs_teams table exists...')
      const { data: teams, error: teamsError } = await supabase
        .from('tffrs_teams')
        .select('count')
        .limit(1)

      if (teamsError) {
        addLog(`❌ tffrs_teams error: ${teamsError.message} (Code: ${teamsError.code})`)
      } else {
        addLog('✅ tffrs_teams table exists and accessible')
      }

      // Test 4: Check performances table
      addLog('🔍 Checking if tffrs_performances table exists...')
      const { data: performances, error: perfError } = await supabase
        .from('tffrs_performances')
        .select('count')
        .limit(1)

      if (perfError) {
        addLog(`❌ tffrs_performances error: ${perfError.message} (Code: ${perfError.code})`)
      } else {
        addLog('✅ tffrs_performances table exists and accessible')
      }

      // Test 5: Try to load actual conferences
      addLog('🔍 Loading actual conferences...')
      const { data: actualConferences, error: loadError } = await supabase
        .from('tffrs_conferences')
        .select('id, url, conference_name, scraped_at')
        .order('scraped_at', { ascending: false })

      if (loadError) {
        addLog(`❌ Load conferences error: ${loadError.message} (Code: ${loadError.code})`)
      } else {
        addLog(`✅ Loaded ${actualConferences?.length || 0} conferences`)
        if (actualConferences && actualConferences.length > 0) {
          actualConferences.forEach((conf: any, i: number) => {
            addLog(`   ${i + 1}. ${conf.conference_name || 'No name'} (${conf.url})`)
          })
        }
      }

      // Test 6: Check authentication
      addLog('🔍 Checking authentication status...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        addLog(`❌ Auth error: ${authError.message}`)
      } else if (user) {
        addLog(`✅ User authenticated: ${user.email}`)
      } else {
        addLog('⚠️ No user authenticated (anonymous access)')
      }

    } catch (error: any) {
      addLog(`💥 Unexpected error: ${error.message}`)
    } finally {
      setLoading(false)
      addLog('🏁 Debug complete')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Debug Console</h1>
        
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm h-96 overflow-y-auto">
          {loading && <div>Running diagnostics...</div>}
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>

        <button
          onClick={debugDatabase}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Run Debug Again
        </button>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Common Issues:</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>42P01 = Table doesn't exist (run SQL script)</li>
            <li>42501 = RLS policy violation (check authentication)</li>
            <li>Connection timeout = Wrong URL/keys</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
