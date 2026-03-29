'use client'

// @ts-nocheck
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Trophy, School, Calendar, MapPin, Link as LinkIcon } from 'lucide-react'

export default function AthleteOnboarding() {
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()
  
  const [step, setStep] = useState(1) // 1 = Profile Info, 2 = Review/Complete Info
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [importedPRs, setImportedPRs] = useState<Array<{event: string, performance: string, date?: string, meetName?: string, location?: string}>>([])
  const [manualPRs, setManualPRs] = useState<Array<{event: string, performance: string}>>([{event: '', performance: ''}])
  
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
    schoolName: '',
    graduationYear: new Date().getFullYear() + 1,
    city: '',
    state: ''
  })

  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

  const handleNext = () => {
    if (!formData.schoolName || !formData.city || !formData.state) {
      setError('Please fill in all required fields')
      return
    }
    setStep(2)
  }

  const handleSubmit = async () => {
    console.log(' HANDLESUBMIT CALLED - NEW CODE RUNNING')
    setLoading(true)
    setError('')

    try {
      console.log('Starting onboarding save...')
      
      // Get user - use from context if available
      console.log('Checking user...')
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      console.log('User from session:', user?.id)
      if (!user) throw new Error('Not authenticated')
      
      // BYPASS profile check - create profile directly if needed
      console.log('Creating/getting profile directly...')
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email || '',
          first_name: formData.schoolName.split(' ')[0] || 'Athlete',
          last_name: 'User',
          role: 'athlete',
          is_verified: false
        } as any, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select('id')
        .single()
      
      if (profileError && profileError.code !== '23505') {
        console.error('Profile upsert error:', profileError)
        throw new Error('Could not create profile: ' + profileError.message)
      }
      
      const profileId = (profileData as any)?.id
      console.log('Profile ID:', profileId)
      
      if (!profileId) {
        throw new Error('Could not get profile ID')
      }

      console.log('Checking for athlete profile with profile_id:', profileId)
      
      let existingProfile = null
      let checkError = null
      
      try {
        const result = await supabase
          .from('athlete_profiles')
          .select('id')
          .eq('profile_id', profileId)
          .maybeSingle()
        
        existingProfile = result.data
        checkError = result.error
        
        console.log('Athlete profile check result:', { existingProfile, checkError })
      } catch (err) {
        console.error('Exception checking athlete profile:', err)
        throw err
      }

      if (checkError) {
        console.error('Error checking athlete profile:', checkError)
        throw checkError
      }

      let athleteProfileId = (existingProfile as any)?.id
      console.log('Existing athlete profile ID:', athleteProfileId)

      if (!athleteProfileId) {
        console.log('Creating new athlete profile...')
        console.log('Inserting athlete profile with data:', {
          profile_id: profileId,
          school_name: formData.schoolName,
          graduation_year: parseInt(formData.graduationYear.toString()),
          city: formData.city,
          state: formData.state
        })
        
        const { data: newProfile, error: profileError } = await supabase
          .from('athlete_profiles')
          .insert({
            profile_id: profileId,
            school_name: formData.schoolName,
            graduation_year: parseInt(formData.graduationYear.toString()),
            city: formData.city,
            state: formData.state
          } as any)
          .select()
          .single()
        
        console.log('Insert result:', { newProfile, profileError })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw profileError
        }
        athleteProfileId = (newProfile as any).id
        console.log('Created athlete profile:', athleteProfileId)
      } else {
        console.log('Updating existing athlete profile...')
        const { error: updateError } = await supabase
          .from('athlete_profiles')
          .update({
            school_name: formData.schoolName,
            graduation_year: parseInt(formData.graduationYear.toString()),
            city: formData.city,
            state: formData.state
          } as any)
          .eq('id', athleteProfileId)

        if (updateError) {
          console.error('Profile update error:', updateError)
          throw updateError
        }
        console.log('Updated athlete profile')
      }

      // Save imported PRs
      if (importedPRs.length > 0 && athleteProfileId) {
        console.log('Saving scraped PRs:', importedPRs.length)
        const scrapedPRsToInsert = importedPRs.map(pr => ({
          athlete_profile_id: athleteProfileId,
          event: pr.event,
          performance: pr.performance,
          date: pr.date || new Date().toISOString().split('T')[0],
          meet_name: pr.meetName || 'Personal Record',
          location: pr.location || 'Unknown',
          is_personal_best: true,
          verification_status: 'verified',
          source_url: null
        }))

        const { error: scrapedPRsError } = await supabase
          .from('personal_records')
          .insert(scrapedPRsToInsert)

        if (scrapedPRsError) {
          console.error('Error saving scraped PRs:', scrapedPRsError)
        } else {
          console.log('Saved scraped PRs successfully')
        }
      }

      // Save manually entered PRs
      const validPRs = manualPRs.filter(pr => pr.event && pr.performance)
      console.log('Valid manual PRs to save:', validPRs.length)
      
      if (validPRs.length > 0 && athleteProfileId) {
        const prsToInsert = validPRs.map(pr => ({
          athlete_profile_id: athleteProfileId,
          event: pr.event,
          performance: pr.performance,
          is_verified: false,
          verification_status: 'pending'
        }))

        const { error: prsError } = await supabase
          .from('personal_records')
          .insert(prsToInsert)

        if (prsError) {
          console.error('Error saving PRs:', prsError)
        } else {
          console.log('Saved manual PRs successfully')
        }
      }

      console.log('Redirecting to dashboard...')
      router.push('/athletes')
    } catch (err: any) {
      console.error('Onboarding save error:', err)
      setError(err.message || 'Failed to save profile')
      setLoading(false)
    } finally {
      // Don't set loading to false here if redirect is happening
      // setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-trackrecruit-yellow/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-trackrecruit-yellow mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-trackrecruit-yellow/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">Welcome to TrackRecruit!</h1>
            <p className="text-gray-300">Let's set up your athlete profile</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-white">Step {step} of 2</span>
              <span className="text-sm text-gray-300">{step === 1 ? 'Basic Information' : 'Complete Your Profile'}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-trackrecruit-yellow h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    School Name
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
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="Austin"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State
                    </label>
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
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Graduation Year
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    required
                  >
                    {[new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                    <p className="text-red-800 font-bold">Error:</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-bold hover:bg-yellow-400 transition"
                >
                  Next Step
                </button>
              </>
            )}

            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">

                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-blue-800 font-bold">
                      <Trophy className="w-4 h-4 inline mr-2" />
                      Add Your PRs
                    </p>
                    <button
                      type="button"
                      onClick={() => setManualPRs([...manualPRs, {event: '', performance: ''}])}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      + Add PR
                    </button>
                  </div>
                  <div className="space-y-2">
                    {manualPRs.map((pr, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pr.event}
                          onChange={(e) => {
                            const updated = [...manualPRs]
                            updated[idx].event = e.target.value
                            setManualPRs(updated)
                          }}
                          className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                          placeholder="Event (e.g., 100m, 400m)"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={pr.performance}
                            onChange={(e) => {
                              const updated = [...manualPRs]
                              updated[idx].performance = e.target.value
                              setManualPRs(updated)
                            }}
                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                            placeholder="Time/Mark (e.g., 11.30)"
                          />
                          {manualPRs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setManualPRs(manualPRs.filter((_, i) => i !== idx))}
                              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-blue-700 text-sm mt-2">Add your personal records to showcase your achievements!</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-2" />
                    High School Name *
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    placeholder="Sheldon King High School"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Graduation Year *
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    required
                  >
                    {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                      placeholder="Memphis"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
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

                {error && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                    <p className="text-red-800 font-bold">Error:</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-900 py-4 rounded-lg font-bold hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Complete Setup'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
