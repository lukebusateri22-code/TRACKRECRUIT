'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function CoachPreferences() {
  const [saved, setSaved] = useState(false)
  const [preferences, setPreferences] = useState({
    // Sprint Events
    sprint100m: { min: '', max: '', enabled: false },
    sprint200m: { min: '', max: '', enabled: false },
    sprint400m: { min: '', max: '', enabled: false },
    
    // Middle Distance
    middle800m: { min: '', max: '', enabled: false },
    middle1500m: { min: '', max: '', enabled: false },
    middle1mile: { min: '', max: '', enabled: false },
    
    // Distance
    distance3000m: { min: '', max: '', enabled: false },
    distance5000m: { min: '', max: '', enabled: false },
    
    // Hurdles
    hurdles110mH: { min: '', max: '', enabled: false },
    hurdles400mH: { min: '', max: '', enabled: false },
    
    // Field Events
    longJump: { min: '', max: '', enabled: false },
    tripleJump: { min: '', max: '', enabled: false },
    highJump: { min: '', max: '', enabled: false },
    poleVault: { min: '', max: '', enabled: false },
    shotPut: { min: '', max: '', enabled: false },
    discus: { min: '', max: '', enabled: false },
    javelin: { min: '', max: '', enabled: false },
    
    // Academic Requirements
    minGPA: '2.5',
    minSAT: '900',
    minACT: '18',
    
    // Other Preferences
    graduationYears: ['2025', '2026', '2027'],
    regions: [] as string[],
    allowAthleteContact: true
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateEventPreference = (event: string, field: string, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [event]: {
        ...prev[event as keyof typeof prev] as any,
        [field]: value
      }
    }))
  }

  const eventCategories = [
    {
      name: 'Sprint Events',
      events: [
        { key: 'sprint100m', label: '100m', unit: 'seconds', example: '10.50' },
        { key: 'sprint200m', label: '200m', unit: 'seconds', example: '21.50' },
        { key: 'sprint400m', label: '400m', unit: 'seconds', example: '48.00' }
      ]
    },
    {
      name: 'Middle Distance',
      events: [
        { key: 'middle800m', label: '800m', unit: 'min:sec', example: '1:55.00' },
        { key: 'middle1500m', label: '1500m', unit: 'min:sec', example: '4:00.00' },
        { key: 'middle1mile', label: '1 Mile', unit: 'min:sec', example: '4:20.00' }
      ]
    },
    {
      name: 'Distance Events',
      events: [
        { key: 'distance3000m', label: '3000m', unit: 'min:sec', example: '8:45.00' },
        { key: 'distance5000m', label: '5000m', unit: 'min:sec', example: '15:30.00' }
      ]
    },
    {
      name: 'Hurdles',
      events: [
        { key: 'hurdles110mH', label: '110m Hurdles', unit: 'seconds', example: '14.50' },
        { key: 'hurdles400mH', label: '400m Hurdles', unit: 'seconds', example: '54.00' }
      ]
    },
    {
      name: 'Field Events',
      events: [
        { key: 'longJump', label: 'Long Jump', unit: 'feet-inches', example: '22-06' },
        { key: 'tripleJump', label: 'Triple Jump', unit: 'feet-inches', example: '45-00' },
        { key: 'highJump', label: 'High Jump', unit: 'feet-inches', example: '6-06' },
        { key: 'poleVault', label: 'Pole Vault', unit: 'feet-inches', example: '15-00' },
        { key: 'shotPut', label: 'Shot Put', unit: 'feet-inches', example: '50-00' },
        { key: 'discus', label: 'Discus', unit: 'feet', example: '150-00' },
        { key: 'javelin', label: 'Javelin', unit: 'feet', example: '180-00' }
      ]
    }
  ]

  return (
    <RoleGuard allowedRole="coach">
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/coaches" className="flex items-center text-gray-900 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <h1 className="text-3xl font-black tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/coaches" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                Dashboard
              </Link>
              <Link href="/search" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                Search Athletes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Recruiting Preferences</h1>
          <p className="text-xl text-gray-600">
            Set your program's performance standards and requirements. Only athletes who meet these criteria will be able to contact you and appear in your search results.
          </p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <p className="text-green-800 font-semibold">Preferences saved successfully!</p>
          </div>
        )}

        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-8 flex items-start">
          <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-900 font-semibold mb-1">Important: Performance Thresholds</p>
            <p className="text-yellow-800 text-sm">
              Athletes who don't meet your minimum standards won't be able to message you directly and won't appear in your search results. 
              Set realistic standards to ensure you don't miss potential recruits who could develop.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {eventCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
              <div className="space-y-6">
                {category.events.map((event) => {
                  const pref = preferences[event.key as keyof typeof preferences] as any
                  return (
                    <div key={event.key} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={pref?.enabled || false}
                            onChange={(e) => updateEventPreference(event.key, 'enabled', e.target.checked)}
                            className="w-5 h-5 text-trackrecruit-yellow rounded mr-3"
                          />
                          <label className="text-lg font-bold text-gray-900">{event.label}</label>
                        </div>
                        <span className="text-sm text-gray-500">Example: {event.example}</span>
                      </div>
                      
                      {pref?.enabled && (
                        <div className="ml-8 grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Minimum Performance (Slowest/Shortest)
                            </label>
                            <input
                              type="text"
                              value={pref.min}
                              onChange={(e) => updateEventPreference(event.key, 'min', e.target.value)}
                              placeholder={`e.g., ${event.example}`}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Athletes must be at least this good</p>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Maximum Performance (Fastest/Longest) - Optional
                            </label>
                            <input
                              type="text"
                              value={pref.max}
                              onChange={(e) => updateEventPreference(event.key, 'max', e.target.value)}
                              placeholder="Leave blank for no limit"
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Optional upper limit</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Requirements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum GPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={preferences.minGPA}
                  onChange={(e) => setPreferences(prev => ({ ...prev, minGPA: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum SAT (Optional)
                </label>
                <input
                  type="number"
                  value={preferences.minSAT}
                  onChange={(e) => setPreferences(prev => ({ ...prev, minSAT: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum ACT (Optional)
                </label>
                <input
                  type="number"
                  value={preferences.minACT}
                  onChange={(e) => setPreferences(prev => ({ ...prev, minACT: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Graduation Years (Class of)
                </label>
                <div className="flex flex-wrap gap-3">
                  {['2025', '2026', '2027', '2028'].map((year) => (
                    <label key={year} className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-trackrecruit-yellow">
                      <input
                        type="checkbox"
                        checked={preferences.graduationYears.includes(year)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferences(prev => ({ ...prev, graduationYears: [...prev.graduationYears, year] }))
                          } else {
                            setPreferences(prev => ({ ...prev, graduationYears: prev.graduationYears.filter(y => y !== year) }))
                          }
                        }}
                        className="w-4 h-4 text-trackrecruit-yellow rounded mr-2"
                      />
                      <span className="font-semibold text-gray-900">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.allowAthleteContact}
                    onChange={(e) => setPreferences(prev => ({ ...prev, allowAthleteContact: e.target.checked }))}
                    className="w-5 h-5 text-trackrecruit-yellow rounded mr-3"
                  />
                  <div>
                    <span className="text-lg font-bold text-gray-900">Allow qualified athletes to contact me</span>
                    <p className="text-sm text-gray-600">Athletes who meet your standards can send you messages</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div>
            <p className="text-sm text-gray-600">
              These preferences will filter your search results and determine who can contact you.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-trackrecruit-yellow text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
    </RoleGuard>
  )
}
