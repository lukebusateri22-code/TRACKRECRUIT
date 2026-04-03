'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Trophy, School, Calendar, MapPin, GraduationCap, Phone, Mail, FileText, Link as LinkIcon, Upload } from 'lucide-react'

export default function AthleteOnboarding() {
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Basic Info
    schoolName: '',
    graduationYear: new Date().getFullYear() + 1,
    city: '',
    state: '',
    
    // Performance Records (Optional)
    milesplitLink: '',
    
    // Academics
    gpa: '',
    act: '',
    sat: '',
    academicDocuments: null as File | null,
    
    // Contact Information
    phoneNumber: '',
    email: '',
    preferredContact: 'email',
    
    // Bio (Optional)
    bio: ''
  })

  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, academicDocuments: e.target.files[0] })
    }
  }

  const validateStep = (currentStep: number) => {
    setError('')
    
    if (currentStep === 1) {
      if (!formData.schoolName || !formData.city || !formData.state) {
        setError('Please fill in all required fields')
        return false
      }
    } else if (currentStep === 2) {
      if (!formData.gpa && !formData.act && !formData.sat) {
        setError('Please provide at least one academic metric (GPA, ACT, or SAT)')
        return false
      }
    } else if (currentStep === 3) {
      if (!formData.phoneNumber || !formData.email) {
        setError('Please provide both phone number and email')
        return false
      }
    }
    
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return
    
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) throw new Error('Not authenticated')
      
      // Create/update profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email || formData.email,
          first_name: user.user_metadata?.first_name || 'Athlete',
          last_name: user.user_metadata?.last_name || 'User',
          role: 'athlete',
          is_verified: false
        } as any, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select('id')
        .single()
      
      if (profileError && profileError.code !== '23505') {
        throw new Error('Could not create profile: ' + profileError.message)
      }
      
      const profileId = (profileData as any)?.id
      if (!profileId) throw new Error('Could not get profile ID')

      // Create athlete profile with all new fields
      const athleteData = {
        profile_id: profileId,
        high_school: formData.schoolName,
        graduation_year: formData.graduationYear,
        city: formData.city,
        state: formData.state,
        milesplit_link: formData.milesplitLink || null,
        has_verified_prs: formData.milesplitLink ? false : null,
        can_message_coaches: !!formData.milesplitLink,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        act_score: formData.act ? parseInt(formData.act) : null,
        sat_score: formData.sat ? parseInt(formData.sat) : null,
        has_verified_academics: !!formData.academicDocuments,
        phone_number: formData.phoneNumber,
        contact_email: formData.email,
        preferred_contact: formData.preferredContact,
        bio: formData.bio || null,
        onboarding_completed: true
      }

      const { error: athleteError } = await supabase
        .from('athlete_profiles')
        .upsert(athleteData as any, {
          onConflict: 'profile_id'
        })
      
      if (athleteError) {
        throw new Error('Could not save athlete profile: ' + athleteError.message)
      }

      // If academic documents uploaded, handle file upload
      if (formData.academicDocuments) {
        const fileName = `${profileId}/academics/${Date.now()}_${formData.academicDocuments.name}`
        const { error: uploadError } = await supabase.storage
          .from('athlete-documents')
          .upload(fileName, formData.academicDocuments)
        
        if (uploadError) {
          console.error('Document upload error:', uploadError)
        }
      }

      // Redirect to athlete dashboard
      router.push('/athletes')
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Step {step} of 4</span>
        <span className="text-sm text-gray-300">
          {step === 1 && 'Basic Information'}
          {step === 2 && 'Academic Information'}
          {step === 3 && 'Contact Information'}
          {step === 4 && 'Performance Records & Bio'}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-trackrecruit-yellow h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Welcome to TrackRecruit!</h1>
          <p className="text-gray-300">Let's set up your athlete profile</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <School className="w-4 h-4 mr-2" />
                  High School Name *
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="Lincoln High School"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="Los Angeles"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Graduation Year *
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4].map(offset => {
                    const year = new Date().getFullYear() + offset
                    return <option key={year} value={year}>{year}</option>
                  })}
                </select>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                Next Step
              </button>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Provide at least one academic metric. Upload documents to verify your academics.
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  GPA (4.0 scale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="3.8"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">
                    ACT Score
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={formData.act}
                    onChange={(e) => setFormData({ ...formData, act: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="32"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">
                    SAT Score
                  </label>
                  <input
                    type="number"
                    min="400"
                    max="1600"
                    value={formData.sat}
                    onChange={(e) => setFormData({ ...formData, sat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                    placeholder="1450"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Academic Documents (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload transcript or test scores to verify your academics
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="athlete@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Preferred Contact Method *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Phone</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="both"
                      checked={formData.preferredContact === 'both'}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Both</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Performance Records & Bio */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-900">
                  <strong>MileSplit Link (Optional):</strong> Provide your MileSplit profile to verify your PRs and unlock the ability to message coaches. Without it, coaches can still reach out to you, but you'll see "Unverified PRs" on your profile.
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  MileSplit Profile Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.milesplitLink}
                  onChange={(e) => setFormData({ ...formData, milesplitLink: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="https://www.milesplit.com/athletes/..."
                />
                <p className="text-xs text-gray-600 mt-1">
                  We'll scrape your PRs from MileSplit to verify your performances
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Bio (Optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trackrecruit-yellow focus:border-transparent"
                  placeholder="Tell coaches about yourself, your goals, and what makes you unique..."
                />
                <p className="text-xs text-gray-600 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {loading ? 'Completing Setup...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
