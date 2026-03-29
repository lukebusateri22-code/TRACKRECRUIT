'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, TrendingUp, Calendar, Users, ExternalLink, Filter } from 'lucide-react'

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const articles = [
    {
      id: 1,
      title: 'How to Create the Perfect Recruiting Email',
      category: 'communication',
      author: 'Coach Sarah Williams',
      date: 'March 15, 2026',
      readTime: '8 min',
      excerpt: 'Learn the key elements that make coaches actually read and respond to your emails.',
      image: '📧'
    },
    {
      id: 2,
      title: 'Breaking Down NCAA Division Differences',
      category: 'recruiting',
      author: 'Mike Johnson',
      date: 'March 12, 2026',
      readTime: '12 min',
      excerpt: 'A comprehensive guide to understanding D1, D2, and D3 track & field programs.',
      image: '🏆'
    },
    {
      id: 3,
      title: 'Training Tips for High School Distance Runners',
      category: 'training',
      author: 'Coach David Martinez',
      date: 'March 10, 2026',
      readTime: '15 min',
      excerpt: 'Build your aerobic base and avoid common training mistakes that lead to injury.',
      image: '🏃'
    },
    {
      id: 4,
      title: 'Understanding Athletic Scholarship Offers',
      category: 'scholarships',
      author: 'Emily Chen',
      date: 'March 8, 2026',
      readTime: '10 min',
      excerpt: 'What to look for in scholarship offers and how to evaluate your options.',
      image: '💰'
    },
    {
      id: 5,
      title: 'The Importance of Academic Performance',
      category: 'academics',
      author: 'Dr. James Wilson',
      date: 'March 5, 2026',
      readTime: '7 min',
      excerpt: 'Why your GPA and test scores matter just as much as your times.',
      image: '📚'
    },
    {
      id: 6,
      title: 'Making the Most of Campus Visits',
      category: 'recruiting',
      author: 'Coach Sarah Williams',
      date: 'March 1, 2026',
      readTime: '9 min',
      excerpt: 'Questions to ask and what to look for during official and unofficial visits.',
      image: '🏫'
    },
    {
      id: 7,
      title: 'Sprint Training: Speed Development Basics',
      category: 'training',
      author: 'Coach Marcus Lee',
      date: 'February 28, 2026',
      readTime: '11 min',
      excerpt: 'Proven methods to improve your acceleration and top-end speed.',
      image: '⚡'
    },
    {
      id: 8,
      title: 'Social Media Do\'s and Don\'ts for Recruits',
      category: 'communication',
      author: 'Emily Chen',
      date: 'February 25, 2026',
      readTime: '6 min',
      excerpt: 'How coaches evaluate your social media presence and what to avoid.',
      image: '📱'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Articles', count: articles.length },
    { id: 'recruiting', label: 'Recruiting', count: articles.filter(a => a.category === 'recruiting').length },
    { id: 'training', label: 'Training', count: articles.filter(a => a.category === 'training').length },
    { id: 'communication', label: 'Communication', count: articles.filter(a => a.category === 'communication').length },
    { id: 'scholarships', label: 'Scholarships', count: articles.filter(a => a.category === 'scholarships').length },
    { id: 'academics', label: 'Academics', count: articles.filter(a => a.category === 'academics').length }
  ]

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory)

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
              <Link href="/recruiting-guide" className="text-gray-900 font-semibold hover:text-gray-700">Guide</Link>
              <Link href="/faq" className="text-gray-900 font-semibold hover:text-gray-700">FAQ</Link>
              <Link href="/resources" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <BookOpen className="w-20 h-20 text-trackrecruit-yellow mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 mb-4">Resources & Blog</h1>
          <p className="text-xl text-gray-600">Expert tips, recruiting news, and training advice for track & field athletes</p>
        </div>

        {/* Featured Article */}
        <div className="bg-gradient-to-r from-trackrecruit-yellow to-yellow-300 rounded-xl shadow-lg border-4 border-gray-900 p-8 mb-12">
          <div className="flex items-center mb-4">
            <span className="bg-gray-900 text-trackrecruit-yellow px-4 py-2 rounded-full text-sm font-bold">FEATURED</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            2026 Recruiting Timeline: Key Dates You Can't Miss
          </h2>
          <p className="text-xl text-gray-800 mb-6">
            Stay on track with important NCAA deadlines, contact periods, and signing dates for the 2026-2027 recruiting cycle.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-800">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                March 20, 2026
              </span>
              <span>•</span>
              <span>10 min read</span>
            </div>
            <Link href="/resources/featured" className="bg-gray-900 text-trackrecruit-yellow px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center">
              Read Article
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'bg-trackrecruit-yellow text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredArticles.map(article => (
            <Link
              key={article.id}
              href={`/resources/${article.id}`}
              className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:border-trackrecruit-yellow transition group"
            >
              <div className="bg-gradient-to-br from-trackrecruit-yellow to-yellow-300 h-48 flex items-center justify-center text-6xl border-b-4 border-gray-900">
                {article.image}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-600 uppercase">{article.category}</span>
                  <span className="text-sm text-gray-600">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-trackrecruit-yellow transition">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-12 text-center">
          <Users className="w-16 h-16 text-trackrecruit-yellow mx-auto mb-6" />
          <h2 className="text-4xl font-black text-trackrecruit-yellow mb-4">Stay Updated</h2>
          <p className="text-xl text-white mb-8">Get weekly recruiting tips and news delivered to your inbox</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-700 focus:border-trackrecruit-yellow focus:outline-none"
            />
            <button className="bg-trackrecruit-yellow text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  )
}
