'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'

type UserRole = 'athlete' | 'coach' | 'admin'

interface RoleGuardProps {
  allowedRole: UserRole
  children: React.ReactNode
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter()
  const { profile, loading: authLoading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check for master login bypass
    const masterLogin = localStorage.getItem('masterLogin')
    const userRole = localStorage.getItem('userRole')
    
    if (masterLogin === 'true' && userRole === allowedRole) {
      setIsAuthorized(true)
      setIsChecking(false)
      return
    }
    
    if (authLoading) {
      setIsChecking(true)
      return
    }

    if (!profile) {
      // Not logged in, redirect to login
      router.replace('/login')
      return
    }

    const profileRole = profile.role as UserRole

    if (profileRole !== allowedRole) {
      // Wrong role - show access denied and redirect
      setIsChecking(false)
      setTimeout(() => {
        if (profileRole === 'athlete') {
          router.replace('/athletes')
        } else if (profileRole === 'coach') {
          router.replace('/coaches/dashboard')
        } else if (profileRole === 'admin') {
          router.replace('/admin')
        } else {
          router.replace('/home')
        }
      }, 2000)
      return
    }

    setIsAuthorized(true)
    setIsChecking(false)
  }, [profile, authLoading, allowedRole, router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trackrecruit-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h1>
          <p className="text-lg text-gray-600 mb-6">
            You don't have permission to access this page. {
              allowedRole === 'athlete' ? 'This page is for athletes only.' : 
              allowedRole === 'coach' ? 'This page is for coaches only.' :
              'This page is for administrators only.'
            }
          </p>
          <p className="text-sm text-gray-500">Redirecting you to your dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
