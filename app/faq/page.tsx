'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategory, setOpenCategory] = useState<string | null>('getting-started')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" in the top right corner, choose whether you\'re an athlete or coach, and fill out the registration form. You\'ll need to verify your email and complete your profile to get started.'
        },
        {
          q: 'Is TrackRecruit free to use?',
          a: 'Yes! TrackRecruit is completely free for high school athletes. We believe every athlete deserves access to recruiting opportunities regardless of their financial situation.'
        },
        {
          q: 'What information should I include in my profile?',
          a: 'Include your personal records (PRs), academic information (GPA, SAT/ACT), contact details, race videos, and any achievements or awards. The more complete your profile, the better coaches can evaluate your fit for their program.'
        },
        {
          q: 'How do I verify my profile?',
          a: 'After signing up, you\'ll be prompted to verify your profile by uploading your student ID and providing your school email. This helps maintain authenticity on the platform and builds trust with coaches.'
        }
      ]
    },
    {
      id: 'recruiting',
      title: 'Recruiting Process',
      questions: [
        {
          q: 'When should I start the recruiting process?',
          a: 'Ideally, start building your profile and researching schools during your sophomore year. Coaches can begin contacting you on September 1st of your junior year, so be prepared before then.'
        },
        {
          q: 'How do I contact college coaches?',
          a: 'Use our messaging system to reach out to coaches directly. Introduce yourself, express interest in their program, and highlight your achievements. Be professional, concise, and genuine in your communication.'
        },
        {
          q: 'What are NCAA eligibility requirements?',
          a: 'You need to meet academic standards (minimum GPA and test scores), graduate from high school, complete 16 core courses, and register with the NCAA Eligibility Center. Requirements vary by division (D1, D2, D3).'
        },
        {
          q: 'How many official visits can I take?',
          a: 'You\'re allowed 5 official visits per sport. Official visits are paid for by the school and typically last 48 hours. Unofficial visits (at your own expense) are unlimited.'
        },
        {
          q: 'What\'s the difference between D1, D2, and D3?',
          a: 'D1 is the highest level with full scholarships available. D2 offers partial scholarships. D3 doesn\'t offer athletic scholarships but may have strong academic aid. Each division has different time commitments and competition levels.'
        }
      ]
    },
    {
      id: 'scholarships',
      title: 'Scholarships',
      questions: [
        {
          q: 'How do athletic scholarships work?',
          a: 'Track & field is an equivalency sport, meaning coaches divide a limited number of scholarships among the team. Full rides are rare - most athletes receive partial scholarships ranging from 20-80% of costs.'
        },
        {
          q: 'What times do I need for a scholarship?',
          a: 'It varies by school and division. Use our Eligible Schools feature to see which programs match your times. Generally, D1 programs want top state/regional times, while D2/D3 have more flexible standards.'
        },
        {
          q: 'Can I negotiate scholarship offers?',
          a: 'Yes, but be professional and realistic. If you have multiple offers, you can mention this to coaches. Focus on fit and development opportunities, not just money. Coaches appreciate honesty and genuine interest.'
        },
        {
          q: 'What happens if I get injured?',
          a: 'Most scholarships are year-to-year renewable. If you\'re injured, maintain communication with coaches, focus on rehab, and stay involved with the team. Medical hardship waivers may extend your eligibility.'
        }
      ]
    },
    {
      id: 'platform',
      title: 'Using TrackRecruit',
      questions: [
        {
          q: 'How do coaches find my profile?',
          a: 'Coaches can search for athletes by event, times, location, graduation year, and academics. Keep your profile updated and complete to appear in more searches. Verified profiles get priority visibility.'
        },
        {
          q: 'Can I upload race videos?',
          a: 'Yes! Go to your Videos page and either upload video files directly or link to YouTube/Vimeo videos. Videos showing your racing form and competitive spirit are highly valuable to coaches.'
        },
        {
          q: 'How do I import my meet results?',
          a: 'Use our Meet Import feature to automatically pull results from Athletic.net or MileSplit. Just paste your profile URL and we\'ll import your times. You can also manually enter results.'
        },
        {
          q: 'What if I compete in multiple events?',
          a: 'Great! Add all your events and PRs to your profile. Many coaches value versatility. Highlight your primary events but include secondary events where you can contribute to the team.'
        },
        {
          q: 'How do I know if a coach viewed my profile?',
          a: 'You\'ll receive notifications when coaches view your profile, save you to their favorites, or send you messages. Check your Activity Feed regularly to stay updated on coach interest.'
        }
      ]
    },
    {
      id: 'coaches',
      title: 'For Coaches',
      questions: [
        {
          q: 'How do I search for athletes?',
          a: 'Use our advanced search filters to find athletes by event, performance times, graduation year, GPA, location, and more. Save athletes to your favorites and track their progress throughout the season.'
        },
        {
          q: 'Can I set recruiting preferences?',
          a: 'Yes! Go to Preferences to set your event standards, academic requirements, and other criteria. We\'ll automatically match you with athletes who meet your program\'s needs.'
        },
        {
          q: 'How do I verify my coaching position?',
          a: 'Upload your staff ID or employment letter and provide your official university email. Verification typically takes 24-48 hours and gives you full access to contact athletes.'
        },
        {
          q: 'Is there a limit to how many athletes I can contact?',
          a: 'No limits! You can message as many athletes as you want. We encourage building genuine relationships and providing personalized communication to recruits.'
        }
      ]
    }
  ]

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      searchQuery === '' ||
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

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
              <Link href="/faq" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">FAQ</Link>
              <Link href="/resources" className="text-gray-900 font-semibold hover:text-gray-700">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <HelpCircle className="w-20 h-20 text-trackrecruit-yellow mx-auto mb-6" />
          <h1 className="text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about recruiting and using TrackRecruit</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:border-trackrecruit-yellow focus:outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
              >
                <h2 className="text-2xl font-black text-gray-900">{category.title}</h2>
                {openCategory === category.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {openCategory === category.id && (
                <div className="p-6 space-y-4">
                  {category.questions.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => setOpenQuestion(openQuestion === idx ? null : idx)}
                        className="w-full text-left flex items-start justify-between group"
                      >
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-trackrecruit-yellow transition pr-4">
                          {item.q}
                        </h3>
                        {openQuestion === idx ? (
                          <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                        )}
                      </button>
                      {openQuestion === idx && (
                        <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-trackrecruit-yellow rounded-xl shadow-lg border-4 border-gray-900 p-8 mt-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-800 mb-6">We're here to help! Reach out to our support team</p>
          <Link href="/contact" className="inline-block bg-gray-900 text-trackrecruit-yellow px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
