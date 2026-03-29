'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Trophy, Target, CheckCircle } from 'lucide-react'

export default function WelcomePage() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    primaryEvent: '',
    secondaryEvent: '',
    goals: [] as string[]
  })

  const events = ['100m', '200m', '400m', '800m', '1500m', '110mH', '400mH', 'Long Jump', 'Triple Jump', 'High Jump']
  const goalOptions = [
    'Compete at D1 level',
    'Get athletic scholarship',
    'Balance academics and athletics',
    'Improve my times',
    'Get recruited by top programs',
    'Find the right fit for me'
  ]

  const toggleGoal = (goal: string) => {
    if (profile.goals.includes(goal)) {
      setProfile({ ...profile, goals: profile.goals.filter(g => g !== goal) })
    } else {
      setProfile({ ...profile, goals: [...profile.goals, goal] })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-400">Step {step} of 3</span>
            <span className="text-sm font-semibold text-trackrecruit-yellow">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-trackrecruit-yellow transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-24 h-24 bg-trackrecruit-yellow rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-12 h-12 text-gray-900" />
            </div>
            <h1 className="text-5xl font-black mb-4">Welcome to TrackRecruit!</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's set up your profile so college coaches can find you. This will only take 2 minutes.
            </p>
            <div className="bg-gray-800 rounded-xl p-8 mb-8 text-left max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">What you'll do:</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-trackrecruit-yellow mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Choose your primary events</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-trackrecruit-yellow mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Set your recruiting goals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-trackrecruit-yellow mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Complete your athlete profile</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setStep(2)}
              className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Events */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black mb-4">What events do you compete in?</h1>
              <p className="text-xl text-gray-300">Select your primary and secondary events</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Primary Event</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {events.map((event) => (
                  <button
                    key={event}
                    onClick={() => setProfile({ ...profile, primaryEvent: event })}
                    className={`px-4 py-3 rounded-lg font-bold transition ${
                      profile.primaryEvent === event
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-4">Secondary Event (Optional)</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {events.filter(e => e !== profile.primaryEvent).map((event) => (
                  <button
                    key={event}
                    onClick={() => setProfile({ ...profile, secondaryEvent: event })}
                    className={`px-4 py-3 rounded-lg font-bold transition ${
                      profile.secondaryEvent === event
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-gray-400 hover:text-white font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!profile.primaryEvent}
                className="bg-trackrecruit-yellow text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Set Goals */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-trackrecruit-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-gray-900" />
              </div>
              <h1 className="text-4xl font-black mb-4">What are your recruiting goals?</h1>
              <p className="text-xl text-gray-300">Select all that apply</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-lg font-semibold text-left transition flex items-start ${
                      profile.goals.includes(goal)
                        ? 'bg-trackrecruit-yellow text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <CheckCircle className={`w-6 h-6 mr-3 mt-0.5 flex-shrink-0 ${
                      profile.goals.includes(goal) ? 'text-gray-900' : 'text-gray-500'
                    }`} />
                    <span>{goal}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-trackrecruit-yellow rounded-xl p-6 mb-8 text-gray-900">
              <h3 className="font-bold mb-2">You're all set!</h3>
              <p className="text-sm">
                Based on your selections, we'll help you find schools that match your {profile.primaryEvent} times and recruiting goals.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 text-gray-400 hover:text-white font-semibold"
              >
                Back
              </button>
              <Link
                href="/athletes"
                className="bg-trackrecruit-yellow text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition inline-flex items-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
