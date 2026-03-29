'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Trophy, TrendingUp, Users, Search, MessageSquare, Target, Star, Award, Video, GraduationCap, Calendar, MapPin } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'national' | 'state'>('national')

  const topRankings = {
    national: [
      { rank: 1, name: 'Michael Thompson', school: 'Long Beach Poly', event: '400m', time: '46.8s', state: 'CA' },
      { rank: 2, name: 'David Martinez', school: 'DeSoto High', event: '400m', time: '47.1s', state: 'TX' },
      { rank: 3, name: 'Chris Johnson', school: 'Oak Park', event: '400m', time: '47.4s', state: 'MI' },
      { rank: 4, name: 'Jordan Davis', school: 'Lincoln High', event: '400m', time: '48.2s', state: 'CA' },
      { rank: 5, name: 'Tyler Brown', school: 'Westlake', event: '400m', time: '48.3s', state: 'GA' }
    ],
    state: [
      { rank: 1, name: 'Jordan Davis', school: 'Lincoln High', event: '400m', time: '48.2s', state: 'CA' },
      { rank: 2, name: 'Alex Rivera', school: 'Mountain View', event: '400m', time: '48.5s', state: 'CA' },
      { rank: 3, name: 'Marcus Lee', school: 'Serra High', event: '400m', time: '48.9s', state: 'CA' },
      { rank: 4, name: 'Kevin Park', school: 'Mater Dei', event: '400m', time: '49.1s', state: 'CA' },
      { rank: 5, name: 'Brandon Chen', school: 'Arcadia', event: '400m', time: '49.3s', state: 'CA' }
    ]
  }

  const featuredAthletes = [
    { name: 'Sarah Martinez', event: '1500m', pr: '4:32.1', school: 'Austin HS', rank: 2, commits: ['Stanford', 'Harvard', 'UCLA'] },
    { name: 'Marcus Williams', event: '110mH', pr: '14.2s', school: 'DeSoto HS', rank: 3, commits: ['Texas', 'Oklahoma', 'LSU'] },
    { name: 'Emily Chen', event: 'Long Jump', pr: '19\'8"', school: 'Monta Vista', rank: 5, commits: ['USC', 'Oregon', 'Washington'] }
  ]

  const features = [
    {
      icon: Trophy,
      title: 'Performance Tracking',
      description: 'Track your personal records and performance data. No manual data entry required.',
      color: 'bg-yellow-500'
    },
    {
      icon: Video,
      title: 'Video Uploads',
      description: 'Upload highlight videos and game film. Coaches see what you can do.',
      color: 'bg-red-500'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set performance goals, track meets, and visualize your progress.',
      color: 'bg-orange-500'
    },
    {
      icon: Search,
      title: 'College Search',
      description: 'Find colleges that match your athletic and academic profile.',
      color: 'bg-blue-500'
    },
    {
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Message college coaches directly. Build relationships.',
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Live Rankings',
      description: 'National and state rankings. See where you stack up.',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/home" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">
                Home
              </Link>
              <Link href="/about" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                About
              </Link>
              <Link href="/contact" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                Contact
              </Link>
              <Link href="/login" className="text-gray-900 font-semibold hover:text-gray-700 transition">
                Log In
              </Link>
              <Link href="/signup" className="bg-gray-900 text-trackrecruit-yellow px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                The Complete Track & Field Recruiting Platform
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Track your performance data, upload videos, set goals, and connect directly with college coaches. Everything you need to get recruited.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?type=athlete" className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition flex items-center justify-center">
                  I'm an Athlete
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/signup?type=coach" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition flex items-center justify-center">
                  I'm a Coach
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-8 text-sm">
                <div>
                  <div className="text-3xl font-black text-trackrecruit-yellow">10,000+</div>
                  <p className="text-gray-400">Active Athletes</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-trackrecruit-yellow">1,200+</div>
                  <p className="text-gray-400">College Programs</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-trackrecruit-yellow">500+</div>
                  <p className="text-gray-400">Commitments</p>
                </div>
              </div>
            </div>
            <div className="bg-trackrecruit-yellow rounded-2xl p-8 border-4 border-gray-900">
              <div className="bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-2xl">
                    JD
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-xl text-gray-900">Jordan Davis</h3>
                    <p className="text-gray-600">Class of 2027 • Lincoln High</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">400m PR</p>
                    <p className="text-2xl font-black text-gray-900">48.2s</p>
                    <p className="text-xs text-green-600 font-bold">National #4</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">800m PR</p>
                    <p className="text-2xl font-black text-gray-900">1:52.8</p>
                    <p className="text-xs text-green-600 font-bold">National #12</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">GPA</p>
                    <p className="text-2xl font-black text-gray-900">3.8</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">Coaches</p>
                    <p className="text-2xl font-black text-gray-900">18</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Built for Track & Field Athletes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your recruiting journey in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200 hover:border-trackrecruit-yellow transition">
                <div className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Rankings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Live Rankings - Class of 2027
            </h2>
            <p className="text-xl text-gray-600">
              See where you stack up against the competition
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('national')}
              className={`px-8 py-3 rounded-lg font-bold transition ${
                activeTab === 'national'
                  ? 'bg-trackrecruit-yellow text-gray-900'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-trackrecruit-yellow'
              }`}
            >
              National Rankings
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-8 py-3 rounded-lg font-bold transition ${
                activeTab === 'state'
                  ? 'bg-trackrecruit-yellow text-gray-900'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-trackrecruit-yellow'
              }`}
            >
              California Rankings
            </button>
          </div>

          {/* Rankings Table */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden mb-8">
            <div className="bg-gray-900 text-white px-6 py-4">
              <h3 className="text-xl font-black">400m - {activeTab === 'national' ? 'National' : 'California'}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {topRankings[activeTab].map((athlete, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl ${
                      athlete.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                      athlete.rank === 2 ? 'bg-gray-300 text-gray-900' :
                      athlete.rank === 3 ? 'bg-orange-400 text-white' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {athlete.rank}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{athlete.name}</h4>
                      <p className="text-sm text-gray-600">{athlete.school} • {athlete.state}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900">{athlete.time}</div>
                    <p className="text-sm text-gray-600">{athlete.event}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 text-center">
              <Link href="/signup?type=athlete" className="text-blue-600 font-bold hover:underline">
                Sign Up to See Your Ranking →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Athletes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Recent Commitments
            </h2>
            <p className="text-xl text-gray-600">
              Athletes who found their perfect match through TrackRecruit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredAthletes.map((athlete, idx) => (
              <div key={idx} className="bg-gradient-to-br from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-black text-xl">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="bg-trackrecruit-yellow px-3 py-1 rounded-full">
                      <span className="text-xs font-black text-gray-900">#{athlete.rank} NATIONAL</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{athlete.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{athlete.school}</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-1">{athlete.event} PR</p>
                    <p className="text-3xl font-black text-gray-900">{athlete.pr}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-700 mb-2">Recruited By:</p>
                    <div className="flex flex-wrap gap-1">
                      {athlete.commits.map((school, i) => (
                        <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs font-medium">
                          {school}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              How TrackRecruit Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get recruited in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-trackrecruit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-gray-900">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600">Sign up and build your athlete profile with academic and athletic information.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-trackrecruit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-gray-900">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Performance</h3>
              <p className="text-gray-600">Log your personal records and performance data to track your progress over time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-trackrecruit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-gray-900">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Discovered</h3>
              <p className="text-gray-600">Upload videos, track goals, and get noticed by college coaches nationwide.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-trackrecruit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-gray-900">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Recruited</h3>
              <p className="text-gray-600">Connect with coaches, find your perfect fit, and commit to your dream school.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-trackrecruit-yellow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ready to Start Your Recruiting Journey?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Join thousands of athletes and coaches already using TrackRecruit to make the right connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-gray-900 text-trackrecruit-yellow px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition inline-flex items-center justify-center">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/rankings" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-flex items-center justify-center">
              View Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-black text-trackrecruit-yellow mb-4">TRACKRECRUIT</h3>
              <p className="text-gray-400 text-sm">
                The Complete Track & Field Recruiting Platform
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Athletes</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/signup?type=athlete" className="hover:text-trackrecruit-yellow transition">Create Profile</Link></li>
                <li><Link href="/home" className="hover:text-trackrecruit-yellow transition">View Rankings</Link></li>
                <li><Link href="/signup?type=athlete" className="hover:text-trackrecruit-yellow transition">Find Colleges</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Coaches</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/signup?type=coach" className="hover:text-trackrecruit-yellow transition">Find Athletes</Link></li>
                <li><Link href="/about" className="hover:text-trackrecruit-yellow transition">Features</Link></li>
                <li><Link href="/contact" className="hover:text-trackrecruit-yellow transition">Contact Sales</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-trackrecruit-yellow transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-trackrecruit-yellow transition">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-trackrecruit-yellow transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-trackrecruit-yellow transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 TrackRecruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
