'use client'

import { useEffect, useState } from 'react'
import { Trophy, X, Star } from 'lucide-react'

interface UnlockedSchool {
  id: string
  name: string
  division: string
  standardType: string
  event: string
}

interface SchoolUnlockModalProps {
  unlockedSchools: UnlockedSchool[]
  onClose: () => void
}

export default function SchoolUnlockModal({ unlockedSchools, onClose }: SchoolUnlockModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (unlockedSchools.length > 0) {
      setIsVisible(true)
    }
  }, [unlockedSchools])

  if (unlockedSchools.length === 0) return null

  const currentSchool = unlockedSchools[currentIndex]

  const handleNext = () => {
    if (currentIndex < unlockedSchools.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }
  }

  const getStandardColor = (type: string) => {
    switch (type) {
      case 'elite': return 'text-yellow-500'
      case 'scholarship': return 'text-blue-500'
      case 'walk-on': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStandardLabel = (type: string) => {
    switch (type) {
      case 'elite': return 'ELITE STANDARD'
      case 'scholarship': return 'SCHOLARSHIP STANDARD'
      case 'walk-on': return 'WALK-ON STANDARD'
      default: return type.toUpperCase()
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleNext} />
      
      {/* Modal */}
      <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border-4 border-trackrecruit-yellow max-w-2xl w-full mx-4 transform transition-all duration-500 ${isVisible ? 'scale-100 rotate-0' : 'scale-50 rotate-12'}`}>
        {/* Close button */}
        <button
          onClick={handleNext}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-trackrecruit-yellow/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative p-12 text-center">
          {/* Trophy Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-trackrecruit-yellow/30 rounded-full blur-xl animate-ping" />
              <div className="relative bg-trackrecruit-yellow rounded-full p-6">
                <Trophy className="w-16 h-16 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
            SCHOOL UNLOCKED!
          </h2>

          {/* School Name */}
          <div className="mb-6">
            <h3 className="text-4xl font-black text-trackrecruit-yellow mb-2">
              {currentSchool.name}
            </h3>
            <p className="text-xl text-gray-300">
              {currentSchool.division} • {currentSchool.event}
            </p>
          </div>

          {/* Standard Type Badge */}
          <div className="mb-8 flex justify-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getStandardColor(currentSchool.standardType)} border-current`}>
              <Star className="w-5 h-5" />
              <span className="font-black text-lg">
                {getStandardLabel(currentSchool.standardType)}
              </span>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
            Your performance meets the {currentSchool.standardType} standard for {currentSchool.name}!
            {currentSchool.standardType === 'scholarship' && ' You may be eligible for athletic scholarship opportunities.'}
            {currentSchool.standardType === 'elite' && ' You have elite-level talent for this program!'}
          </p>

          {/* Progress indicator */}
          {unlockedSchools.length > 1 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">
                School {currentIndex + 1} of {unlockedSchools.length}
              </p>
              <div className="flex gap-2 justify-center">
                {unlockedSchools.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-12 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-trackrecruit-yellow' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleNext}
            className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition transform hover:scale-105 border-4 border-gray-900 shadow-xl"
          >
            {currentIndex < unlockedSchools.length - 1 ? 'NEXT SCHOOL →' : 'AWESOME! 🎉'}
          </button>
        </div>
      </div>
    </div>
  )
}
