'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function TestDatabasePage() {
  const [status, setStatus] = useState('Testing connection...')
  const [error, setError] = useState('')
  const [envVars, setEnvVars] = useState({})

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      const supabase = createClient()
      
      // Check environment variables
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      }
      setEnvVars(env as any)

      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').single()
      
      if (error) {
        if (error.code === '42P01') {
          setStatus('✅ Connection works, but tables not created')
          setError('Tables need to be created first')
        } else {
          setStatus('❌ Connection failed')
          setError(error.message)
        }
      } else {
        setStatus('✅ Connection successful')
        setError('')
      }
    } catch (err: any) {
      setStatus('❌ Connection failed')
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Connection Test</h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars as Record<string, string>).map(([key, value]: [string, string]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}:</span>
                <span className={`font-medium ${value === 'Set' ? 'text-green-600' : 'text-red-600'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h2>
          <div className="space-y-2">
            <div className="text-lg font-medium">{status}</div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>If environment variables are missing, check your .env.local file</li>
            <li>If connection fails, verify your Supabase URL and keys</li>
            <li>If tables not created, run the SQL script in Supabase Dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
