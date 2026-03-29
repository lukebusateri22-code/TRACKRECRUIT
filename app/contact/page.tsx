'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
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
        <h1 className="text-5xl font-black text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12">
          Have questions? We're here to help.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
            <Mail className="w-12 h-12 text-trackrecruit-yellow mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Us</h3>
            <p className="text-gray-700 mb-4">
              For general inquiries and support
            </p>
            <a href="mailto:support@trackrecruit.com" className="text-blue-600 hover:underline font-semibold">
              support@trackrecruit.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
            <MessageSquare className="w-12 h-12 text-trackrecruit-yellow mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Live Chat</h3>
            <p className="text-gray-700 mb-4">
              Available Monday-Friday, 9am-5pm EST
            </p>
            <button className="text-blue-600 hover:underline font-semibold">
              Start Chat
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-trackrecruit-yellow text-gray-900 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
