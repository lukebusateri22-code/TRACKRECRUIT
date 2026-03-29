'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { School, MapPin, Phone, Users, Award } from 'lucide-react'

export default function CompleteCoachProfile() {
  const router = useRouter()
  const { profile, loading: authLoading, refreshProfile } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      setProfileLoading(false)
    } else {
      // If profile doesn't load after 3 seconds, show form anyway
      const timeout = setTimeout(() => {
        setProfileLoading(false)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [profile])

  const [formData, setFormData] = useState({
    universityName: '',
    position: '',
    conference: '',
    phone: '',
    officeLocation: '',
    bio: '',
    
    // Recruiting preferences
    primaryEvents: [] as string[],
    targetGraduationYears: [] as number[],
    minGPA: '',
    preferredStates: [] as string[]
  })

  const positions = [
    'Head Coach',
    'Assistant Coach',
    'Distance Coach',
    'Sprints/Hurdles Coach',
    'Jumps Coach',
    'Throws Coach',
    'Multi-Events Coach',
    'Recruiting Coordinator'
  ]

  const conferences = [
    'ACC', 'American', 'ASUN', 'Atlantic 10', 'Big 12', 'Big East', 'Big Sky', 'Big South',
    'Big Ten', 'Big West', 'C-USA', 'CAA', 'Horizon', 'Ivy League', 'MAAC', 'MAC',
    'MEAC', 'Missouri Valley', 'Mountain West', 'Northeast', 'OVC', 'Pac-12',
    'Patriot League', 'SEC', 'Southern', 'Southland', 'Summit League', 'Sun Belt',
    'SWAC', 'The American', 'WAC', 'West Coast', 'Independent'
  ]

  const events = [
    '100m', '200m', '400m', '800m', '1500m', '1600m', '3000m', '3200m', '5000m',
    '110mH', '300mH', '400mH', '3000mSC',
    'High Jump', 'Pole Vault', 'Long Jump', 'Triple Jump',
    'Shot Put', 'Discus', 'Javelin', 'Hammer'
  ]

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      primaryEvents: prev.primaryEvents.includes(event)
        ? prev.primaryEvents.filter(e => e !== event)
        : [...prev.primaryEvents, event]
    }))
  }

  const toggleYear = (year: number) => {
    setFormData(prev => ({
      ...prev,
      targetGraduationYears: prev.targetGraduationYears.includes(year)
        ? prev.targetGraduationYears.filter(y => y !== year)
        : [...prev.targetGraduationYears, year]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get user from session instead of profile context
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      // Get or create profile
      let profileId = profile?.id
      
      if (!profileId) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()
        
        profileId = existingProfile?.id
      }
      
      if (!profileId) throw new Error('Profile not found. Please try logging out and back in.')

      // Create or update coach profile
      const { error: profileError } = await supabase
        .from('coach_profiles')
        .upsert({
          profile_id: profileId,
          university_name: formData.universityName,
          position: formData.position,
          conference_name: formData.conference || null,
          phone: formData.phone || null,
          office_location: formData.officeLocation || null,
          bio: formData.bio || null,
        })
        .select()
        .single()

      if (profileError) throw profileError

      await refreshProfile()
      router.push('/coaches/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-trackrecruit-yellow border-b-4 border-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900">Complete Your Coach Profile</h1>
          <p className="text-gray-700 mt-2">Set up your profile to start recruiting athletes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    University/College Name
                  </label>
                  <input
                    type="text"
                    value={formData.universityName}
                    onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="University of Michigan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Award className="w-4 h-4 inline mr-2" />
                    Position/Title
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Athletic Conference
                  </label>
                  <select
                    value={formData.conference}
                    onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    required
                  >
                    <option value="">Select Conference</option>
                    {conferences.map(conf => (
                      <option key={conf} value={conf}>{conf}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Office Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.officeLocation}
                      onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="Athletic Center, Room 205"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    rows={4}
                    placeholder="Tell athletes about your coaching philosophy, program, and what you're looking for in recruits..."
                  />
                </div>
              </div>
            </div>

            {/* Recruiting Preferences */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                <Users className="w-6 h-6 inline mr-2" />
                Recruiting Preferences (Optional)
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Primary Events You Recruit</label>
                  <div className="grid grid-cols-3 gap-2">
                    {events.map(event => (
                      <button
                        key={event}
                        type="button"
                        onClick={() => toggleEvent(event)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                          formData.primaryEvents.includes(event)
                            ? 'bg-trackrecruit-yellow text-gray-900 border-2 border-gray-900'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Target Graduation Years</label>
                  <div className="flex gap-2">
                    {[2025, 2026, 2027, 2028].map(year => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => toggleYear(year)}
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                          formData.targetGraduationYears.includes(year)
                            ? 'bg-trackrecruit-yellow text-gray-900 border-2 border-gray-900'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Minimum GPA Requirement</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    value={formData.minGPA}
                    onChange={(e) => setFormData({ ...formData, minGPA: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="3.0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can update your recruiting preferences anytime from your dashboard. These help us match you with the right athletes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition border-4 border-gray-900 disabled:opacity-50"
            >
              {loading ? 'Saving Profile...' : 'Complete Profile & Start Recruiting →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
