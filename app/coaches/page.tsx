'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CoachRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/coaches/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-900 font-bold">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
