'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Paperclip, AlertCircle } from 'lucide-react'
import { getCollegeById } from '@/lib/colleges'

export default function SchoolMessaging() {
  const params = useParams()
  const school = getCollegeById(params.schoolId as string)
  const [message, setMessage] = useState('')

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">School Not Found</h1>
          <Link href="/messages" className="text-blue-600 hover:underline">
            Back to Messages
          </Link>
        </div>
      </div>
    )
  }

  const conversation = [
    {
      sender: 'coach',
      name: school.headCoach,
      message: "Hi Jordan! I've been following your progress this season. Your 400m time of 48.2s is impressive. I'd love to learn more about your goals and how you might fit into our program.",
      timestamp: '2 hours ago',
      read: true
    },
    {
      sender: 'athlete',
      name: 'You',
      message: "Thank you Coach! I'm really interested in your program. I've been working on improving my 400m and 800m times, and I think I could contribute to the team.",
      timestamp: '1 hour ago',
      read: true
    },
    {
      sender: 'coach',
      name: school.headCoach,
      message: "That's great to hear! We're looking for versatile middle-distance runners. Can you tell me more about your training background and what you're looking for in a college program?",
      timestamp: '45 minutes ago',
      read: true
    }
  ]

  const handleSend = () => {
    if (message.trim()) {
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* School-Branded Header */}
      <div 
        className="border-b-4"
        style={{ 
          backgroundColor: school.primaryColor,
          borderColor: school.secondaryColor
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              href="/messages" 
              className="flex items-center hover:opacity-80 transition"
              style={{ color: school.secondaryColor }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-semibold">Back to Messages</span>
            </Link>
            
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mr-3"
                style={{ 
                  backgroundColor: school.secondaryColor,
                  color: school.primaryColor
                }}
              >
                {school.logo}
              </div>
              <div>
                <h1 
                  className="text-xl font-black"
                  style={{ color: school.secondaryColor }}
                >
                  {school.name}
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: school.secondaryColor, opacity: 0.8 }}
                >
                  {school.headCoach}
                </p>
              </div>
            </div>

            <Link
              href={`/schools/${school.id}`}
              className="px-6 py-2 rounded-lg font-bold hover:opacity-90 transition"
              style={{ 
                backgroundColor: school.secondaryColor,
                color: school.primaryColor
              }}
            >
              View School Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NCAA Compliance Notice */}
        <div 
          className="rounded-lg p-4 mb-6 flex items-start border-2"
          style={{ 
            backgroundColor: `${school.primaryColor}10`,
            borderColor: `${school.primaryColor}40`
          }}
        >
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: school.primaryColor }} />
          <div>
            <p className="font-semibold text-gray-900 mb-1">NCAA Compliance Notice</p>
            <p className="text-sm text-gray-700">
              All communications are logged for NCAA compliance. Please follow recruiting rules and guidelines.
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 mb-6">
          <div 
            className="p-4 border-b-2"
            style={{ 
              backgroundColor: `${school.primaryColor}05`,
              borderColor: `${school.primaryColor}20`
            }}
          >
            <h2 className="text-xl font-bold text-gray-900">
              Conversation with {school.headCoach}
            </h2>
            <p className="text-sm text-gray-600">{school.name} • {school.mascot}</p>
          </div>

          <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
            {conversation.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'athlete' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'athlete' ? 'order-2' : 'order-1'}`}>
                  {msg.sender === 'coach' && (
                    <div className="flex items-center mb-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mr-2"
                        style={{ 
                          backgroundColor: school.primaryColor,
                          color: school.secondaryColor
                        }}
                      >
                        {school.headCoach.split(' ')[1][0]}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{msg.name}</span>
                    </div>
                  )}
                  
                  <div 
                    className={`p-4 rounded-lg ${
                      msg.sender === 'athlete' 
                        ? 'rounded-tr-none' 
                        : 'rounded-tl-none'
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'coach' ? school.primaryColor : '#F3F4F6',
                      color: msg.sender === 'coach' ? school.secondaryColor : '#1F2937'
                    }}
                  >
                    <p className="leading-relaxed">{msg.message}</p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div 
            className="p-4 border-t-2"
            style={{ borderColor: `${school.primaryColor}20` }}
          >
            <div className="flex items-end space-x-3">
              <button 
                className="p-3 rounded-lg hover:opacity-80 transition"
                style={{ 
                  backgroundColor: `${school.primaryColor}10`,
                  color: school.primaryColor
                }}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${school.headCoach}...`}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none resize-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
              </div>
              
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                style={{ 
                  backgroundColor: school.primaryColor,
                  color: school.secondaryColor
                }}
              >
                <Send className="w-5 h-5 mr-2" />
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* School Info Sidebar */}
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            className="rounded-xl shadow-lg p-6"
            style={{ 
              backgroundColor: school.primaryColor,
              color: school.secondaryColor
            }}
          >
            <h3 className="text-xl font-bold mb-4">About {school.shortName}</h3>
            <div className="space-y-2 text-sm opacity-90">
              <p><strong>Conference:</strong> {school.conference}</p>
              <p><strong>Location:</strong> {school.location}</p>
              <p><strong>Team Size:</strong> {school.teamSize} athletes</p>
              <p><strong>Website:</strong> {school.teamWebsite}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/schools/${school.id}`}
                className="block w-full px-4 py-2 rounded-lg font-semibold text-center transition"
                style={{ 
                  backgroundColor: `${school.primaryColor}10`,
                  color: school.primaryColor
                }}
              >
                View Full Profile
              </Link>
              <button
                className="block w-full bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition"
              >
                Schedule Call
              </button>
              <button
                className="block w-full bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition"
              >
                Request Campus Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
