'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Calendar, MessageSquare, Trophy, Target, TrendingUp } from 'lucide-react'

export default function RecruitingGuide() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      articles: [
        { title: 'Understanding the Recruiting Timeline', duration: '5 min read' },
        { title: 'NCAA Eligibility Requirements', duration: '8 min read' },
        { title: 'Creating Your Athletic Profile', duration: '6 min read' },
        { title: 'What Coaches Look For', duration: '7 min read' }
      ]
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: MessageSquare,
      articles: [
        { title: 'How to Email College Coaches', duration: '10 min read' },
        { title: 'Following Up Effectively', duration: '5 min read' },
        { title: 'What to Say on Campus Visits', duration: '8 min read' },
        { title: 'Social Media Best Practices', duration: '6 min read' }
      ]
    },
    {
      id: 'performance',
      title: 'Performance & Training',
      icon: Trophy,
      articles: [
        { title: 'Setting Realistic PR Goals', duration: '7 min read' },
        { title: 'Balancing Academics and Athletics', duration: '9 min read' },
        { title: 'Injury Prevention Tips', duration: '6 min read' },
        { title: 'Mental Preparation for Competition', duration: '8 min read' }
      ]
    },
    {
      id: 'scholarships',
      title: 'Scholarships & Financial Aid',
      icon: TrendingUp,
      articles: [
        { title: 'Understanding Athletic Scholarships', duration: '10 min read' },
        { title: 'Academic Scholarships for Athletes', duration: '8 min read' },
        { title: 'Negotiating Scholarship Offers', duration: '12 min read' },
        { title: 'Financial Aid Beyond Scholarships', duration: '9 min read' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/home" className="flex items-center text-gray-900 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <h1 className="text-3xl font-black tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/recruiting-guide" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Guide</Link>
              <Link href="/faq" className="text-gray-900 font-semibold hover:text-gray-700">FAQ</Link>
              <Link href="/resources" className="text-gray-900 font-semibold hover:text-gray-700">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-12 mb-12 text-center">
          <BookOpen className="w-20 h-20 text-gray-900 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 mb-4">Recruiting Guide</h1>
          <p className="text-2xl text-gray-800 mb-6">Everything you need to know about college track & field recruiting</p>
          <p className="text-lg text-gray-700">From first contact to signing day, we've got you covered</p>
        </div>

        {/* Quick Start Checklist */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Quick Start Checklist</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Complete Your Profile</h3>
                <p className="text-gray-600 text-sm">Add your PRs, academics, and contact information</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Upload Race Videos</h3>
                <p className="text-gray-600 text-sm">Showcase your form and competitive spirit</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Research Schools</h3>
                <p className="text-gray-600 text-sm">Find programs that match your times and academics</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Start Reaching Out</h3>
                <p className="text-gray-600 text-sm">Email coaches and express your interest</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recruiting Timeline */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
            <Calendar className="w-8 h-8 mr-3" />
            Recruiting Timeline
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-trackrecruit-yellow pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Freshman & Sophomore Year</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Focus on academics and building your athletic foundation</li>
                <li>• Start researching college programs</li>
                <li>• Attend local meets and gain experience</li>
                <li>• Begin creating your athletic profile</li>
              </ul>
            </div>
            <div className="border-l-4 border-trackrecruit-yellow pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Junior Year (Critical!)</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>September 1:</strong> Coaches can begin contacting you</li>
                <li>• Send introduction emails to coaches</li>
                <li>• Attend unofficial visits</li>
                <li>• Take SAT/ACT and focus on grades</li>
                <li>• Compete at high-level meets for exposure</li>
              </ul>
            </div>
            <div className="border-l-4 border-trackrecruit-yellow pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Senior Year</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Take official visits (5 allowed per sport)</li>
                <li>• Evaluate scholarship offers</li>
                <li>• Make your decision and sign NLI</li>
                <li>• Continue improving your times</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Guide Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 hover:border-trackrecruit-yellow transition">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-trackrecruit-yellow rounded-full flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.articles.map((article, idx) => (
                  <Link
                    key={idx}
                    href={`/recruiting-guide/${section.id}/${idx}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-trackrecruit-yellow hover:bg-opacity-20 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 group-hover:text-gray-900">{article.title}</h3>
                      <span className="text-sm text-gray-600">{article.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-12 mt-12 text-center">
          <h2 className="text-4xl font-black text-trackrecruit-yellow mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white mb-8">Create your profile and start connecting with college coaches today</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-trackrecruit-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition">
              Sign Up Free
            </Link>
            <Link href="/faq" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
