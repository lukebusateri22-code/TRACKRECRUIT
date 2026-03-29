'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-5xl font-black text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-12">Last updated: March 27, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using TrackRecruit, you agree to be bound by these Terms of Service and all 
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
              from using this platform.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account with us, you must provide accurate and complete information. You are 
              responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Providing truthful and accurate performance data</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide false or misleading information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Interfere with or disrupt the platform's operation</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Content</h2>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of content you post on TrackRecruit. By posting content, you grant us a 
              license to use, display, and distribute that content on our platform. You are responsible for 
              ensuring you have the right to share any content you upload.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">NCAA Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              Athletes and coaches are responsible for ensuring their use of TrackRecruit complies with all 
              applicable NCAA rules and regulations. We do not provide legal advice regarding NCAA compliance.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend your account at any time, without prior notice, for 
              conduct that we believe violates these Terms of Service or is harmful to other users or the platform.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:legal@trackrecruit.com" className="text-blue-600 hover:underline">
                legal@trackrecruit.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
