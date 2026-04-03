'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AthleteProfile() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to dashboard - user prefers dashboard with modal
    router.replace('/athletes')
  }, [router])
  
  return null
}
