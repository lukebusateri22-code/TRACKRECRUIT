'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { MapPin, School, GraduationCap, Award, Phone, Instagram, Twitter } from 'lucide-react'

export default function CompleteAthleteProfile() {
  const router = useRouter()
  const { profile, loading: authLoading, refreshProfile } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    // Basic Info
    schoolName: '',
    graduationYear: 2027,
    location: '',
    state: '',
    
    // Academics
    gpa: '',
    satScore: '',
    actScore: '',
    
    // Physical
    height: '',
    weight: '',
    
    // Contact & Social
    phone: '',
    instagram: '',
    twitter: '',
    bio: '',
    
    // Primary Events (we'll add PRs separately)
    primaryEvent: '',
    secondaryEvent: ''
  })

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const events = [
    '100m', '200m', '400m', '800m', '1500m', '1600m', '3000m', '3200m', '5000m',
    '110mH', '300mH', '400mH', '3000mSC',
    'High Jump', 'Pole Vault', 'Long Jump', 'Triple Jump',
    'Shot Put', 'Discus', 'Javelin', 'Hammer'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!profile) throw new Error('No profile found')

      // Create or update athlete profile
      const { data: athleteProfile, error: profileError } = await supabase
        .from('athlete_profiles')
        .upsert({
          profile_id: profile.id,
          school_name: formData.schoolName,
          graduation_year: formData.graduationYear,
          location: formData.location,
          state: formData.state,
          gpa: parseFloat(formData.gpa) || 0,
          sat_score: formData.satScore ? parseInt(formData.satScore) : null,
          act_score: formData.actScore ? parseInt(formData.actScore) : null,
          height: formData.height || null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          phone: formData.phone || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          bio: formData.bio || null,
        })
        .select()
        .single()

      if (profileError) throw profileError

      await refreshProfile()
      router.push('/verify')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold mb-4">No profile found</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-trackrecruit-yellow border-b-4 border-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900">Complete Your Athlete Profile</h1>
          <p className="text-gray-700 mt-2">Help coaches find you by completing your profile</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-trackrecruit-yellow' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-trackrecruit-yellow text-gray-900' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-semibold">Basic Info</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full ${step >= 2 ? 'bg-trackrecruit-yellow' : ''}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-trackrecruit-yellow' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-trackrecruit-yellow text-gray-900' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-semibold">Academics</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full ${step >= 3 ? 'bg-trackrecruit-yellow' : ''}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-trackrecruit-yellow' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-trackrecruit-yellow text-gray-900' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-semibold">Contact & Bio</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    High School Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="Lincoln High School"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="Portland"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Graduation Year
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                  >
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                    <option value="2028">Class of 2028</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Award className="w-4 h-4 inline mr-2" />
                      Primary Event
                    </label>
                    <select
                      value={formData.primaryEvent}
                      onChange={(e) => setFormData({ ...formData, primaryEvent: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      required
                    >
                      <option value="">Select Event</option>
                      {events.map(event => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Event (Optional)</label>
                    <select
                      value={formData.secondaryEvent}
                      onChange={(e) => setFormData({ ...formData, secondaryEvent: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    >
                      <option value="">Select Event</option>
                      {events.map(event => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Height (Optional)</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="5'10&quot;"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Weight (lbs, Optional)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="150"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition border-4 border-gray-900"
                >
                  Next: Academics →
                </button>
              </div>
            )}

            {/* Step 2: Academics */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">GPA (4.0 scale)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="3.75"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">SAT Score (Optional)</label>
                    <input
                      type="number"
                      min="400"
                      max="1600"
                      value={formData.satScore}
                      onChange={(e) => setFormData({ ...formData, satScore: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="1200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ACT Score (Optional)</label>
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={formData.actScore}
                      onChange={(e) => setFormData({ ...formData, actScore: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="28"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Academic information helps coaches assess NCAA eligibility and scholarship opportunities.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-900 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition border-4 border-gray-900"
                  >
                    Next: Contact Info →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Bio */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Social Media</h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-2" />
                      Instagram (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 inline mr-2" />
                      Twitter/X (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio (Optional)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    rows={4}
                    placeholder="Tell coaches about yourself, your goals, and what makes you unique..."
                  />
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Almost done!</strong> After completing your profile, you'll be able to add your PRs, meet results, and videos.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-900 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition border-4 border-gray-900 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Complete Profile →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
