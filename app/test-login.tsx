'use client'

import { useState, useEffect } from 'react'

export default function TestLogin() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    const verified = localStorage.getItem('isVerified')
    const master = localStorage.getItem('masterLogin')
    
    setStatus(`Current status: Role=${role}, Verified=${verified}, Master=${master}`)
  }, [])

  const handleAthleteLogin = () => {
    console.log('Athlete login test')
    localStorage.setItem('userRole', 'athlete')
    localStorage.setItem('isVerified', 'true')
    localStorage.setItem('masterLogin', 'true')
    window.location.href = '/athletes'
  }

  const handleCoachLogin = () => {
    console.log('Coach login test')
    localStorage.setItem('userRole', 'coach')
    localStorage.setItem('isVerified', 'true')
    localStorage.setItem('masterLogin', 'true')
    window.location.href = '/coaches/dashboard'
  }

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login Test Page</h1>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <p className="text-sm font-mono">{status}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleAthleteLogin}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Test Athlete Login
          </button>
          
          <button
            onClick={handleCoachLogin}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Test Coach Login
          </button>
          
          <button
            onClick={clearStorage}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Clear Storage
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Test URLs:</h2>
          <ul className="text-sm space-y-1">
            <li><a href="/login" className="text-blue-600">/login</a></li>
            <li><a href="/athletes" className="text-blue-600">/athletes</a></li>
            <li><a href="/coaches/dashboard" className="text-blue-600">/coaches/dashboard</a></li>
            <li><a href="/coaches/tffrs-analytics" className="text-blue-600">/coaches/tffrs-analytics</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
