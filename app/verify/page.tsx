'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Check, AlertCircle, Shield, FileText, Camera } from 'lucide-react'

export default function VerifyProfile() {
  const [userRole, setUserRole] = useState<'athlete' | 'coach' | null>(null)
  const [verificationStep, setVerificationStep] = useState(1)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [formData, setFormData] = useState({
    schoolEmail: '',
    coachEmail: '',
    schoolName: '',
    athleticDirectorEmail: '',
    idDocument: null as File | null,
    proofDocument: null as File | null
  })

  useState(() => {
    const role = localStorage.getItem('userRole') as 'athlete' | 'coach' | null
    setUserRole(role)
  })

  const handleFileUpload = (type: 'id' | 'proof', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, [`${type}Document`]: file })
      setUploadedDocs([...uploadedDocs, type])
    }
  }

  const handleSubmitVerification = () => {
    // In production, this would submit to backend for admin review
    alert('Verification submitted! You will receive an email within 24-48 hours.')
    if (userRole === 'athlete') {
      window.location.href = '/athletes'
    } else {
      window.location.href = '/coaches/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/home" className="flex items-center text-gray-900 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <h1 className="text-3xl font-black tracking-tight">TRACKRECRUIT</h1>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <Shield className="w-16 h-16 text-trackrecruit-yellow mx-auto mb-4" />
          <h1 className="text-4xl font-black text-gray-900 mb-2">Verify Your Profile</h1>
          <p className="text-xl text-gray-600">
            Help us maintain a safe and authentic community
          </p>
        </div>

        {/* Why Verification */}
        <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Why do we verify profiles?</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Protect athletes from fake coaches and recruiters</li>
                <li>• Ensure coaches are legitimate NCAA-compliant programs</li>
                <li>• Build trust in the TrackRecruit community</li>
                <li>• Comply with NCAA recruiting regulations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center ${verificationStep >= 1 ? 'text-trackrecruit-yellow' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${
                verificationStep >= 1 ? 'bg-trackrecruit-yellow border-gray-900 text-gray-900' : 'border-gray-300'
              }`}>
                {verificationStep > 1 ? <Check className="w-6 h-6" /> : '1'}
              </div>
              <span className="ml-2 font-bold hidden sm:inline">Contact Info</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${verificationStep >= 2 ? 'text-trackrecruit-yellow' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${
                verificationStep >= 2 ? 'bg-trackrecruit-yellow border-gray-900 text-gray-900' : 'border-gray-300'
              }`}>
                {verificationStep > 2 ? <Check className="w-6 h-6" /> : '2'}
              </div>
              <span className="ml-2 font-bold hidden sm:inline">Documents</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${verificationStep >= 3 ? 'text-trackrecruit-yellow' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${
                verificationStep >= 3 ? 'bg-trackrecruit-yellow border-gray-900 text-gray-900' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-bold hidden sm:inline">Review</span>
            </div>
          </div>

          {/* Step 1: Contact Information */}
          {verificationStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {userRole === 'athlete' ? 'Athlete Verification' : 'Coach Verification'}
              </h2>

              {userRole === 'athlete' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      School Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.schoolEmail}
                      onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                      placeholder="yourname@schoolname.edu"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                    <p className="text-xs text-gray-600 mt-1">We'll send a verification code to this email</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      High School Name *
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="Lincoln High School"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Coach Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.coachEmail}
                      onChange={(e) => setFormData({ ...formData, coachEmail: e.target.value })}
                      placeholder="coach@schoolname.edu"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                    <p className="text-xs text-gray-600 mt-1">Your coach can verify your profile faster</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Official School Email *
                    </label>
                    <input
                      type="email"
                      value={formData.schoolEmail}
                      onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                      placeholder="coach@university.edu"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                    <p className="text-xs text-gray-600 mt-1">Must be an official university email address</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      University/College Name *
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="University of Michigan"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Athletic Director Email *
                    </label>
                    <input
                      type="email"
                      value={formData.athleticDirectorEmail}
                      onChange={(e) => setFormData({ ...formData, athleticDirectorEmail: e.target.value })}
                      placeholder="ad@university.edu"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                    />
                    <p className="text-xs text-gray-600 mt-1">We'll verify your position with the athletic department</p>
                  </div>
                </>
              )}

              <button
                onClick={() => setVerificationStep(2)}
                disabled={!formData.schoolEmail || !formData.schoolName}
                className="w-full bg-trackrecruit-yellow text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Documents
              </button>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {verificationStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Verification Documents</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {userRole === 'athlete' ? 'Student ID or School Document *' : 'Staff ID or Credentials *'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-trackrecruit-yellow transition">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('id', e)}
                    className="hidden"
                    id="id-upload"
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    {uploadedDocs.includes('id') ? (
                      <div className="text-green-600">
                        <Check className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-bold">ID Document Uploaded</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="font-bold text-gray-900">Click to upload</p>
                        <p className="text-sm text-gray-600">JPG, PNG, or PDF up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {userRole === 'athlete' ? 'Recent Meet Results or Team Roster' : 'Coaching License or Employment Letter'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-trackrecruit-yellow transition">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('proof', e)}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer">
                    {uploadedDocs.includes('proof') ? (
                      <div className="text-green-600">
                        <Check className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-bold">Proof Document Uploaded</p>
                      </div>
                    ) : (
                      <>
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="font-bold text-gray-900">Click to upload</p>
                        <p className="text-sm text-gray-600">JPG, PNG, or PDF up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setVerificationStep(1)}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:border-gray-400 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setVerificationStep(3)}
                  disabled={uploadedDocs.length < 2}
                  className="flex-1 bg-trackrecruit-yellow text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Submit
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {verificationStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Your Information</h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-lg font-bold text-gray-900">{formData.schoolEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">School/University</p>
                  <p className="text-lg font-bold text-gray-900">{formData.schoolName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Documents Uploaded</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900">ID Document</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900">Proof Document</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>What happens next?</strong> Our team will review your documents within 24-48 hours. 
                  You'll receive an email once your profile is verified. You can still use TrackRecruit with limited features until verification is complete.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setVerificationStep(2)}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:border-gray-400 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitVerification}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Submit for Verification
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip for Now */}
        <div className="text-center">
          <button
            onClick={() => {
              if (userRole === 'athlete') {
                window.location.href = '/athletes'
              } else {
                window.location.href = '/coaches/dashboard'
              }
            }}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            Skip for now (limited features)
          </button>
        </div>
      </div>
    </div>
  )
}
