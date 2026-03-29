'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Search, Paperclip, MoreVertical, Star, Filter, Bell } from 'lucide-react'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(0)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStarred, setFilterStarred] = useState(false)
  const [starredConversations, setStarredConversations] = useState<number[]>([0])

  const conversations = [
    {
      id: 0,
      name: 'Coach Anderson',
      school: 'University of Michigan',
      avatar: 'CA',
      lastMessage: 'Great performance at state! Would love to discuss your recruiting timeline.',
      time: '2h ago',
      unread: 2,
      isCoach: true,
      messages: [
        { sender: 'coach', text: 'Hi Jordan! I watched your 400m race at the state championship. Impressive time!', time: '2 days ago' },
        { sender: 'me', text: 'Thank you Coach Anderson! I appreciate you reaching out.', time: '2 days ago' },
        { sender: 'coach', text: 'We\'re really interested in having you visit campus. Are you available in June?', time: '1 day ago' },
        { sender: 'me', text: 'Yes, I\'d love to visit! June works great for me.', time: '1 day ago' },
        { sender: 'coach', text: 'Great performance at state! Would love to discuss your recruiting timeline.', time: '2h ago' },
      ]
    },
    {
      id: 1,
      name: 'Coach Williams',
      school: 'Ohio State University',
      avatar: 'CW',
      lastMessage: 'Can you send over your spring schedule?',
      time: '5h ago',
      unread: 1,
      isCoach: true,
      messages: [
        { sender: 'coach', text: 'Hi Jordan, we\'ve been following your progress this season.', time: '3 days ago' },
        { sender: 'me', text: 'Thank you! Ohio State has always been a dream school for me.', time: '3 days ago' },
        { sender: 'coach', text: 'Can you send over your spring schedule?', time: '5h ago' },
      ]
    },
    {
      id: 2,
      name: 'Coach Martinez',
      school: 'Penn State University',
      avatar: 'CM',
      lastMessage: 'Looking forward to seeing you compete at nationals!',
      time: '1d ago',
      unread: 0,
      messages: [
        { sender: 'coach', text: 'Jordan, your 800m time caught our attention. We\'d like to learn more about you.', time: '5 days ago' },
        { sender: 'me', text: 'I\'d be happy to share more! What would you like to know?', time: '4 days ago' },
        { sender: 'coach', text: 'Looking forward to seeing you compete at nationals!', time: '1d ago' },
      ]
    },
    {
      id: 3,
      name: 'Coach Thompson',
      school: 'University of Illinois',
      avatar: 'CT',
      lastMessage: 'Thanks for the quick response!',
      time: '2d ago',
      unread: 0,
      messages: [
        { sender: 'coach', text: 'Hi Jordan, we\'re recruiting for the 400m and 800m. Interested in learning more?', time: '1 week ago' },
        { sender: 'me', text: 'Absolutely! Illinois is on my list of schools I\'m considering.', time: '6 days ago' },
        { sender: 'coach', text: 'Thanks for the quick response!', time: '2d ago' },
      ]
    },
  ]

  const currentConversation = conversations[selectedConversation]
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0)

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.school.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !filterStarred || starredConversations.includes(conv.id)
    return matchesSearch && matchesFilter
  })

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('')
    }
  }

  const toggleStar = (convId: number) => {
    setStarredConversations(prev => 
      prev.includes(convId) ? prev.filter(id => id !== convId) : [...prev, convId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/athletes" className="text-gray-900 font-semibold">Dashboard</Link>
              <Link href="/search" className="text-gray-900 font-semibold">Search</Link>
              <Link href="/messages" className="text-gray-900 font-semibold relative">
                Messages
                {totalUnread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </Link>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-900">Messages</h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setFilterStarred(!filterStarred)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center ${
                filterStarred ? 'bg-trackrecruit-yellow text-gray-900' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Star className={`w-4 h-4 mr-2 ${filterStarred ? 'fill-current' : ''}`} />
              Starred
            </button>
            {totalUnread > 0 && (
              <div className="flex items-center space-x-2 bg-blue-50 border-2 border-blue-500 px-4 py-2 rounded-lg">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">{totalUnread} unread message{totalUnread > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b-2 border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="font-semibold mb-1">No conversations found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
                    selectedConversation === conv.id ? 'bg-trackrecruit-yellow bg-opacity-20' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-sm mr-3 flex-shrink-0">
                        {conv.avatar}
                      </div>
                      {conv.isCoach && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" title="Coach">
                          C
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-gray-900 truncate">{conv.name}</p>
                          {starredConversations.includes(conv.id) && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        {conv.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{conv.school}</p>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{conv.time}</p>
                    </div>
                  </div>
                </button>
              ))
              )}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-trackrecruit-yellow font-bold text-sm mr-3">
                    {currentConversation.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{currentConversation.name}</p>
                    <p className="text-sm text-gray-600">{currentConversation.school}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStar(currentConversation.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Star className={`w-5 h-5 ${
                      starredConversations.includes(currentConversation.id) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-600'
                    }`} />
                  </button>
                  <Link 
                    href={`/schools/${currentConversation.school.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                  >
                    View Profile
                  </Link>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentConversation.messages.map((message, idx) => (
                <div key={idx} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-4 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-trackrecruit-yellow text-gray-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-trackrecruit-yellow focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-trackrecruit-yellow text-gray-900 p-3 rounded-lg hover:bg-yellow-400 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 px-2">
                NCAA compliance: All messages are logged and monitored for compliance purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
