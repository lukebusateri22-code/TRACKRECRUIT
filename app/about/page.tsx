'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, Users, Target, TrendingUp } from 'lucide-react'

export default function AboutPage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-black text-gray-900 mb-6">About TrackRecruit</h1>
        <p className="text-xl text-gray-600 mb-12">
          Connecting track & field athletes with college programs through performance-based recruiting.
        </p>

        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              TrackRecruit exists to simplify the college recruiting process for track & field athletes and coaches. 
              We provide a platform where talent meets opportunity, making it easier for athletes to showcase their 
              abilities and for coaches to discover the right recruits for their programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <Trophy className="w-12 h-12 text-trackrecruit-yellow mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Athletes</h3>
              <p className="text-gray-700">
                Track your performance, connect with coaches, and find the perfect college program 
                that matches your athletic and academic goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <Users className="w-12 h-12 text-trackrecruit-yellow mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Coaches</h3>
              <p className="text-gray-700">
                Discover talented athletes who meet your program's standards, streamline your 
                recruiting process, and build championship teams.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900 text-xl mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Create Your Profile</h4>
                  <p className="text-gray-700">Athletes build comprehensive profiles with PRs, academics, and race videos.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900 text-xl mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Get Discovered</h4>
                  <p className="text-gray-700">Coaches search for athletes based on performance standards and academic criteria.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-trackrecruit-yellow rounded-full flex items-center justify-center font-black text-gray-900 text-xl mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Connect & Commit</h4>
                  <p className="text-gray-700">Message directly, schedule visits, and find your perfect athletic and academic fit.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-trackrecruit-yellow rounded-xl p-8 border-4 border-gray-900">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-800 mb-6">
              Join thousands of athletes and coaches already using TrackRecruit to make the right connections.
            </p>
            <Link 
              href="/signup" 
              className="inline-block bg-gray-900 text-trackrecruit-yellow px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
