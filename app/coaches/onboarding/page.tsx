'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Settings, Filter, Target, CheckCircle } from 'lucide-react'

export default function CoachOnboarding() {
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [preferences, setPreferences] = useState({
    // Event preferences
    preferredEvents: [] as string[],
    
    // Academic preferences
    minGPA: '',
    minACT: '',
    minSAT: '',
    
    // Geographic preferences
    preferredStates: [] as string[],
    
    // Class year preferences
    targetClassYears: [] as string[],
    
    // Gender preference
    genderPreference: 'both' as 'men' | 'women' | 'both'
  })

  const events = [
    '100m', '200m', '400m', '800m', '1500m', '1600m', 'Mile', '3000m', '3200m', '5000m', '10000m',
    '100mH', '110mH', '400mH', '3000mSC',
    'High Jump', 'Pole Vault', 'Long Jump', 'Triple Jump',
    'Shot Put', 'Discus', 'Hammer', 'Javelin',
    'Heptathlon', 'Decathlon'
  ]

  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

  const currentYear = new Date().getFullYear()
  const classYears = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4]

  const toggleEvent = (event: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredEvents: prev.preferredEvents.includes(event)
        ? prev.preferredEvents.filter(e => e !== event)
        : [...prev.preferredEvents, event]
    }))
  }

  const toggleState = (state: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredStates: prev.preferredStates.includes(state)
        ? prev.preferredStates.filter(s => s !== state)
        : [...prev.preferredStates, state]
    }))
  }

  const toggleClassYear = (year: number) => {
    const yearStr = year.toString()
    setPreferences(prev => ({
      ...prev,
      targetClassYears: prev.targetClassYears.includes(yearStr)
        ? prev.targetClassYears.filter(y => y !== yearStr)
        : [...prev.targetClassYears, yearStr]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) throw new Error('Not authenticated')

      // Get profile ID
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profileData) throw new Error('Profile not found')

      // Update coach profile with preferences
      const { error: updateError } = await supabase
        .from('coach_profiles')
        .update({
          preferred_events: preferences.preferredEvents,
          min_gpa: preferences.minGPA ? parseFloat(preferences.minGPA) : null,
          min_act: preferences.minACT ? parseInt(preferences.minACT) : null,
          min_sat: preferences.minSAT ? parseInt(preferences.minSAT) : null,
          preferred_states: preferences.preferredStates,
          target_class_years: preferences.targetClassYears,
          gender_preference: preferences.genderPreference,
          onboarding_completed: true,
          invitation_accepted_at: new Date().toISOString()
        } as any)
        .eq('profile_id', (profileData as any).id)

      if (updateError) throw updateError

      // Redirect to coach dashboard
      router.push('/coaches/dashboard')
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Welcome to TrackRecruit!</h1>
          <p className="text-gray-300">Set your recruiting preferences to find the perfect athletes</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Event Preferences */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Event Preferences
              </h2>
              <p className="text-gray-600 mb-4">Select the events you're recruiting for (select multiple)</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {events.map(event => (
                  <button
                    key={event}
                    onClick={() => toggleEvent(event)}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                      preferences.preferredEvents.includes(event)
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Preference */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-6 h-6 mr-2" />
                Gender Preference
              </h2>
              <div className="flex space-x-4">
                {['men', 'women', 'both'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => setPreferences({ ...preferences, genderPreference: gender as any })}
                    className={`flex-1 px-6 py-3 rounded-lg font-bold capitalize transition ${
                      preferences.genderPreference === gender
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Standards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Minimum Academic Standards (Optional)
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Min GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    value={preferences.minGPA}
                    onChange={(e) => setPreferences({ ...preferences, minGPA: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="3.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Min ACT</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={preferences.minACT}
                    onChange={(e) => setPreferences({ ...preferences, minACT: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Min SAT</label>
                  <input
                    type="number"
                    min="400"
                    max="1600"
                    value={preferences.minSAT}
                    onChange={(e) => setPreferences({ ...preferences, minSAT: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            {/* Class Year Preferences */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Target Class Years</h2>
              <p className="text-gray-600 mb-4">Select which graduation years you're recruiting</p>
              <div className="flex space-x-2">
                {classYears.map(year => (
                  <button
                    key={year}
                    onClick={() => toggleClassYear(year)}
                    className={`flex-1 px-4 py-3 rounded-lg font-bold transition ${
                      preferences.targetClassYears.includes(year.toString())
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Geographic Preferences */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Geographic Preferences (Optional)</h2>
              <p className="text-gray-600 mb-4">Select states you want to recruit from (leave empty for all states)</p>
              <div className="grid grid-cols-6 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {states.map(state => (
                  <button
                    key={state}
                    onClick={() => toggleState(state)}
                    className={`px-2 py-2 rounded font-semibold text-sm transition ${
                      preferences.preferredStates.includes(state)
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={loading || preferences.preferredEvents.length === 0}
                className="w-full bg-trackrecruit-yellow text-gray-900 px-6 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  'Saving Preferences...'
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Complete Setup & Start Recruiting
                  </>
                )}
              </button>
              {preferences.preferredEvents.length === 0 && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Please select at least one event to continue
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>You can update these preferences anytime from your dashboard</p>
        </div>
      </div>
    </div>
  )
}
