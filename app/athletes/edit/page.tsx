'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, Check, AlertCircle, Camera } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function EditProfile() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: 'Jordan',
    lastName: 'Davis',
    email: 'jordan.davis@email.com',
    phone: '(555) 123-4567',
    school: 'Lincoln High School',
    graduationYear: '2027',
    city: 'Los Angeles',
    state: 'CA',
    height: '6\'1"',
    weight: '165',
    gpa: '3.8',
    sat: '1340',
    act: '',
    instagram: '@jordandavis',
    twitter: '@jdavis400m',
    bio: 'State champion 400m runner looking to compete at the D1 level. Strong work ethic and team player.'
  })

  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.school.trim()) newErrors.school = 'High school is required'
    if (formData.gpa && (parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4.0)) {
      newErrors.gpa = 'GPA must be between 0.0 and 4.0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    console.log('Saving profile:', formData)
    // In production, this would save to Supabase
    
    // Show success toast
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 3000)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  
  return (
    <RoleGuard allowedRole="athlete">
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/athletes" className="flex items-center text-gray-900 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <h1 className="text-3xl font-black tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <button
              onClick={handleSave}
              className="bg-gray-900 text-trackrecruit-yellow px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-xl text-gray-600">Update your information to keep coaches informed</p>
        </div>

        {/* Success Toast */}
        {showSaveToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-slide-in">
            <Check className="w-6 h-6" />
            <div>
              <p className="font-bold">Profile Saved!</p>
              <p className="text-sm">Your changes have been saved successfully.</p>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  {Object.values(errors).map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Photo</h2>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-900"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-5xl">
                  JD
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className="bg-trackrecruit-yellow text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center mb-2 cursor-pointer">
                <Upload className="w-5 h-5 mr-2" />
                Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 5MB.</p>
              {profilePhoto && (
                <button 
                  onClick={() => setProfilePhoto(null)}
                  className="text-sm text-red-600 hover:text-red-800 mt-2"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value })
                  if (errors.firstName) {
                    const newErrors = { ...errors }
                    delete newErrors.firstName
                    setErrors(newErrors)
                  }
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-trackrecruit-yellow'
                }`}
              />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value })
                  if (errors.lastName) {
                    const newErrors = { ...errors }
                    delete newErrors.lastName
                    setErrors(newErrors)
                  }
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-trackrecruit-yellow'
                }`}
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) {
                    const newErrors = { ...errors }
                    delete newErrors.email
                    setErrors(newErrors)
                  }
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-trackrecruit-yellow'
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">School Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">High School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year</label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
              >
                <option value="2025">Class of 2025</option>
                <option value="2026">Class of 2026</option>
                <option value="2027">Class of 2027</option>
                <option value="2028">Class of 2028</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="CA"
              />
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Physical Stats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="6'1&quot;"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="165"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GPA</label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="3.8"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SAT (Optional)</label>
              <input
                type="text"
                value={formData.sat}
                onChange={(e) => setFormData({ ...formData, sat: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="1340"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ACT (Optional)</label>
              <input
                type="text"
                value={formData.act}
                onChange={(e) => setFormData({ ...formData, act: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="30"
              />
            </div>
          </div>
        </div>

        
        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter/X</label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bio</h2>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
            placeholder="Tell coaches about yourself, your goals, and what makes you a great fit for their program..."
          />
          <p className="text-sm text-gray-600 mt-2">{formData.bio.length}/500 characters</p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <Link href="/athletes" className="text-gray-600 hover:text-gray-900 font-semibold">
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
    </RoleGuard>
  )
}
