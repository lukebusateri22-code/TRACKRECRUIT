'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, School, Trophy, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateCoachAccount() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    schoolName: '',
    conference: '',
    tempPassword: ''
  })

  const conferences = [
    'ACC', 'American', 'Atlantic 10', 'Big 12', 'Big East', 'Big Sky', 'Big South', 
    'Big Ten', 'Big West', 'C-USA', 'CAA', 'Horizon', 'Ivy League', 'MAAC', 'MAC', 
    'MEAC', 'Missouri Valley', 'Mountain West', 'Northeast', 'Ohio Valley', 
    'Pac-12', 'Patriot League', 'SEC', 'Southern', 'Southland', 'Summit League', 
    'Sun Belt', 'SWAC', 'WAC', 'WCC'
  ]

  const generateTempPassword = () => {
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
    setFormData({ ...formData, tempPassword: password })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate all fields
      if (!formData.email || !formData.firstName || !formData.lastName || 
          !formData.schoolName || !formData.conference || !formData.tempPassword) {
        throw new Error('Please fill in all fields')
      }

      // Create auth user with admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'coach'
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'coach',
          is_verified: true
        } as any)
        .select('id')
        .single()

      if (profileError) throw profileError

      // Create coach profile
      const { error: coachError } = await supabase
        .from('coach_profiles')
        .insert({
          profile_id: (profileData as any).id,
          school_name: formData.schoolName,
          conference: formData.conference,
          created_by_admin: true,
          invitation_sent_at: new Date().toISOString(),
          onboarding_completed: false
        } as any)

      if (coachError) throw coachError

      setSuccess(`✅ Coach account created successfully!
      
Email: ${formData.email}
Temporary Password: ${formData.tempPassword}

Send these credentials to the coach. They'll be prompted to change their password on first login.`)

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        schoolName: '',
        conference: '',
        tempPassword: ''
      })

    } catch (err: any) {
      console.error('Error creating coach account:', err)
      setError(err.message || 'Failed to create coach account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Create Coach Account</h1>
              <p className="text-gray-700 mt-1">Set up a new college coach profile</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium whitespace-pre-line">{success}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coach Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Coach Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="coach@university.edu"
                  required
                />
              </div>
            </div>

            {/* School Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <School className="w-5 h-5 mr-2" />
                School Information
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="University of Michigan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Conference *
                </label>
                <select
                  value={formData.conference}
                  onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  required
                >
                  <option value="">Select Conference</option>
                  {conferences.map(conf => (
                    <option key={conf} value={conf}>{conf}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Temporary Password */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Temporary Password
              </h2>

              <div className="flex space-x-4">
                <input
                  type="text"
                  value={formData.tempPassword}
                  onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent font-mono"
                  placeholder="Click generate or enter manually"
                  required
                />
                <button
                  type="button"
                  onClick={generateTempPassword}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition"
                >
                  Generate
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                The coach will be required to change this password on first login
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-trackrecruit-yellow text-gray-900 px-6 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Coach Account'}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">📧 After Creating Account:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Copy the email and temporary password</li>
            <li>Send credentials to the coach via email</li>
            <li>Coach logs in and is prompted to change password</li>
            <li>Coach completes onboarding (sets preferences)</li>
            <li>Coach can start searching athletes</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
