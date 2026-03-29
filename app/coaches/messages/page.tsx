'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Send, Search, Paperclip, MoreVertical, Star, Filter, Bell, Phone, Mail, Calendar } from 'lucide-react'

interface AthleteConversation {
  id: number
  name: string
  event: string
  location: string
  class: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  hasAccount: boolean
  contactInfo?: {
    email?: string
    phone?: string
  }
  messages: Array<{
    sender: 'coach' | 'athlete'
    text: string
    time: string
  }>
}

export default function CoachMessages() {
  const [selectedConversation, setSelectedConversation] = useState(0)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStarred, setFilterStarred] = useState(false)
  const [starredConversations, setStarredConversations] = useState<number[]>([0])
  const [userRole, setUserRole] = useState<string>('coach')

  const conversations: AthleteConversation[] = [
    {
      id: 0,
      name: 'Sarah Johnson',
      event: '400m',
      location: 'Boston, MA',
      class: '2027',
      avatar: 'SJ',
      lastMessage: 'Thank you Coach! I\'d love to visit campus next month.',
      time: '2h ago',
      unread: 2,
      hasAccount: true,
      messages: [
        { sender: 'coach', text: 'Hi Sarah! I watched your 400m race at the state championship. Impressive time!', time: '2 days ago' },
        { sender: 'athlete', text: 'Thank you Coach! I appreciate you reaching out.', time: '2 days ago' },
        { sender: 'coach', text: 'We\'re really interested in having you join our program. Are you available for a campus visit?', time: '1 day ago' },
        { sender: 'athlete', text: 'Thank you Coach! I\'d love to visit campus next month.', time: '2h ago' },
      ]
    },
    {
      id: 1,
      name: 'Marcus Williams',
      event: '110mH',
      location: 'Atlanta, GA',
      class: '2027',
      avatar: 'MW',
      lastMessage: 'Thanks for the info! I\'ll send my highlights this week.',
      time: '5h ago',
      unread: 1,
      hasAccount: false,
      contactInfo: {
        email: 'marcus.williams@email.com',
        phone: '555-0123'
      },
      messages: [
        { sender: 'coach', text: 'Hi Marcus, we\'ve been following your progress this season.', time: '3 days ago' },
        { sender: 'athlete', text: 'Thank you! I\'m very interested in your program.', time: '3 days ago' },
        { sender: 'coach', text: 'Could you send over your highlight reel and academic transcripts?', time: '5h ago' },
        { sender: 'athlete', text: 'Thanks for the info! I\'ll send my highlights this week.', time: '5h ago' },
      ]
    },
    {
      id: 2,
      name: 'Emily Chen',
      event: 'Long Jump',
      location: 'San Diego, CA',
      class: '2027',
      avatar: 'EC',
      lastMessage: 'I\'ll be at the Nike Outdoor Nationals. Hope to see you there!',
      time: '1d ago',
      unread: 0,
      hasAccount: true,
      messages: [
        { sender: 'coach', text: 'Hi Emily! Your long jump marks are exactly what we\'re looking for.', time: '4 days ago' },
        { sender: 'athlete', text: 'Thank you so much! I\'ve been researching your program.', time: '3 days ago' },
        { sender: 'coach', text: 'Will you be attending any major meets this summer?', time: '2 days ago' },
        { sender: 'athlete', text: 'I\'ll be at the Nike Outdoor Nationals. Hope to see you there!', time: '1d ago' },
      ]
    },
    {
      id: 3,
      name: 'Jordan Davis',
      event: '400m',
      location: 'Chicago, IL',
      class: '2027',
      avatar: 'JD',
      lastMessage: 'Phone: 555-0124 - Available for calls after 6pm',
      time: '2d ago',
      unread: 0,
      hasAccount: false,
      contactInfo: {
        phone: '555-0124'
      },
      messages: [
        { sender: 'coach', text: 'Hi Jordan! Great performance at the regional meet.', time: '3 days ago' },
        { sender: 'athlete', text: 'Phone: 555-0124 - Available for calls after 6pm', time: '2d ago' },
      ]
    },
  ]

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'coach'
    setUserRole(role)
  }, [])

  const toggleStar = (conversationId: number) => {
    setStarredConversations(prev => 
      prev.includes(conversationId) 
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId]
    )
  }

  const sendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send to the backend
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStar = !filterStarred || starredConversations.includes(conv.id)
    return matchesSearch && matchesStar
  })

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/coaches/dashboard" className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/coaches/dashboard" className="text-gray-900 font-semibold hover:text-gray-700">Dashboard</Link>
              <Link href="/coaches/search" className="text-gray-900 font-semibold hover:text-gray-700">Search Athletes</Link>
              <Link href="/coaches/messages" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Messages</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with prospective recruits</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilterStarred(!filterStarred)}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition ${
                      filterStarred 
                        ? 'bg-trackrecruit-yellow text-gray-900' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Starred
                  </button>
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      selectedConversation === conversation.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-sm flex-shrink-0">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate">{conversation.name}</h4>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStar(conversation.id)
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Star className={`w-4 h-4 ${
                                starredConversations.includes(conversation.id) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-400'
                              }`} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{conversation.event} • {conversation.location}</p>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">{conversation.time}</span>
                          <div className="flex items-center space-x-2">
                            {!conversation.hasAccount && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                                No Account
                              </span>
                            )}
                            {conversation.unread > 0 && (
                              <span className="bg-trackrecruit-yellow text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-sm">
                          {currentConversation.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{currentConversation.name}</h3>
                          <p className="text-sm text-gray-600">
                            {currentConversation.event} • Class of {currentConversation.class} • {currentConversation.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {currentConversation.hasAccount ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                            Has Account
                          </span>
                        ) : (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Contact Info:</p>
                            {currentConversation.contactInfo?.email && (
                              <p className="text-xs text-gray-600">{currentConversation.contactInfo.email}</p>
                            )}
                            {currentConversation.contactInfo?.phone && (
                              <p className="text-xs text-gray-600">{currentConversation.contactInfo.phone}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversation.messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.sender === 'coach' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === 'coach'
                              ? 'bg-trackrecruit-yellow text-gray-900'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <button
                        onClick={sendMessage}
                        className="p-2 bg-trackrecruit-yellow text-gray-900 rounded-lg hover:bg-yellow-400 transition"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
