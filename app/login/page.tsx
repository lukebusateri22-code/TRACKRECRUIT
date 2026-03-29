'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleMasterLogin = (role: 'athlete' | 'coach') => {
    // Bypass authentication for testing
    console.log(`Master login: ${role}`)
    localStorage.setItem('userRole', role)
    localStorage.setItem('isVerified', 'true')
    localStorage.setItem('masterLogin', 'true')
    
    // Force redirect with window.location to avoid any routing issues
    if (role === 'athlete') {
      window.location.href = '/athletes'
    } else if (role === 'coach') {
      window.location.href = '/coaches/dashboard'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check for master login shortcuts (case insensitive)
    if (email.toLowerCase() === 'testathlete@gmail.com' && password === 'Test123') {
      console.log('Master athlete login detected')
      handleMasterLogin('athlete')
      return
    }
    
    if (email.toLowerCase() === 'testcoach@gmail.com' && password === 'Test123') {
      console.log('Master coach login detected')
      handleMasterLogin('coach')
      return
    }

    try {
      const { user } = await signIn(email, password)
      
      // Auth context will handle setting role in localStorage
      // Redirect will happen automatically based on role
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'athlete') {
        router.push('/athletes')
      } else if (userRole === 'coach') {
        router.push('/coaches/dashboard')
      } else if (userRole === 'admin') {
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <div className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/home" className="flex items-center text-gray-900 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <h1 className="text-2xl font-black tracking-tight">TRACKRECRUIT</h1>
          </Link>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Log in to your TrackRecruit account</p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-trackrecruit-yellow rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition border-4 border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            {/* Master Login Shortcuts */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500 mb-4">Quick Access (Testing)</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Athlete button clicked')
                    handleMasterLogin('athlete')
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  type="button"
                >
                  👟 Athlete Login
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Coach button clicked')
                    handleMasterLogin('coach')
                  }}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  type="button"
                >
                  📋 Coach Login
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center">
                <p>TestAthlete@gmail.com / Test123</p>
                <p>TestCoach@gmail.com / Test123</p>
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="mt-2 text-red-600 hover:underline"
                >
                  Clear All Data / Logout
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-bold text-blue-600 hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By logging in, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
