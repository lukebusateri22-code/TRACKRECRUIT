'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Play, Trash2, ExternalLink, Film, Check, AlertCircle, FileVideo, Link as LinkIcon } from 'lucide-react'

export default function UploadVideos() {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'State Championship 400m - 1st Place',
      event: '400m',
      date: '2025-05-17',
      url: 'https://youtube.com/watch?v=example1',
      thumbnail: null,
      views: 234,
      verified: true
    }
  ])

  const [newVideo, setNewVideo] = useState({
    title: '',
    event: '',
    date: '',
    url: ''
  })

  const events = ['100m', '200m', '400m', '800m', '1500m', '110mH', '400mH', 'Long Jump', 'Triple Jump', 'High Jump', 'Shot Put', 'Discus']

  const handleAddVideo = async () => {
    if (newVideo.title && newVideo.url) {
      setIsUploading(true)
      setUploadProgress(0)

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      setTimeout(() => {
        const video = { ...newVideo, id: Date.now(), thumbnail: null, views: 0, verified: false }
        setVideos([...videos, video])
        setNewVideo({ title: '', event: '', date: '', url: '' })
        setShowSuccessToast(true)
        setIsUploading(false)
        setUploadProgress(0)
        setTimeout(() => setShowSuccessToast(false), 3000)
      }, 2000)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 500 * 1024 * 1024 && file.type.includes('video/')) {
      setIsUploading(true)
      setTimeout(() => {
        const video = {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          event: '',
          date: new Date().toISOString().split('T')[0],
          url: URL.createObjectURL(file),
          thumbnail: null,
          views: 0,
          verified: false
        }
        setVideos([...videos, video])
        setShowSuccessToast(true)
        setIsUploading(false)
        setTimeout(() => setShowSuccessToast(false), 3000)
      }, 3000)
    }
  }

  return (
    
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-trackrecruit-yellow border-b-4 border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/athletes" className="flex items-center">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRACKRECRUIT</h1>
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/athletes" className="text-gray-900 font-semibold hover:text-gray-700">Rankings</Link>
                <Link href="/athletes/search-colleges" className="text-gray-900 font-semibold hover:text-gray-700">Find Colleges</Link>
                <Link href="/athletes/recruiting" className="text-gray-900 font-semibold hover:text-gray-700">Recruiting</Link>
                <Link href="/athletes/goals" className="text-gray-900 font-semibold hover:text-gray-700">Goals</Link>
                <Link href="/athletes/videos" className="text-gray-900 font-semibold border-b-4 border-gray-900 pb-1">Videos</Link>
                <Link href="/athletes/update-pr" className="text-gray-900 font-semibold hover:text-gray-700">Update PR</Link>
                <Link href="/athletes/settings" className="text-gray-900 font-semibold hover:text-gray-700">Settings</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/athletes" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Video Highlights</h1>
            <p className="text-xl text-gray-600">Showcase your best performances to college coaches</p>
          </div>

          {showSuccessToast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50">
              <Check className="w-6 h-6" />
              <div>
                <p className="font-bold">Video Uploaded!</p>
                <p className="text-sm">Your video has been added successfully.</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Video</h2>
                
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                      uploadMethod === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    URL
                  </button>
                  <button
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                      uploadMethod === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <FileVideo className="w-4 h-4 inline mr-2" />
                    File
                  </button>
                </div>

                {uploadMethod === 'url' ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Video Title"
                    />
                    
                    <select
                      value={newVideo.event}
                      onChange={(e) => setNewVideo({...newVideo, event: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Event</option>
                      {events.map(event => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={newVideo.date}
                      onChange={(e) => setNewVideo({...newVideo, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    <input
                      type="url"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Video URL"
                    />

                    <button
                      onClick={handleAddVideo}
                      disabled={isUploading || !newVideo.title || !newVideo.url}
                      className="w-full bg-trackrecruit-yellow text-gray-900 px-4 py-3 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50"
                    >
                      {isUploading ? 'Adding...' : 'Add Video'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <span className="text-lg font-medium text-gray-900">Click to upload</span>
                        <p className="text-sm text-gray-600">MP4, MOV up to 500MB</p>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>

                    {isUploading && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-trackrecruit-yellow h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Videos List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Videos ({videos.length})</h2>
                
                {videos.length === 0 ? (
                  <div className="text-center py-12">
                    <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No videos yet</h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:border-trackrecruit-yellow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{video.title}</h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                              {video.event && <span>{video.event}</span>}
                              {video.date && <span>• {video.date}</span>}
                              {video.views > 0 && <span>• {video.views} views</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex space-x-2 mt-3">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-trackrecruit-yellow text-gray-900 rounded text-sm font-medium hover:bg-yellow-400"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Watch
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}
