import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/auth-context'

export function useAthleteProfile() {
  const { profile } = useAuth()
  const [athleteProfile, setAthleteProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (profile?.athlete_profiles) {
      setAthleteProfile(profile.athlete_profiles[0])
      setLoading(false)
    }
  }, [profile])

  const updateProfile = async (updates: any) => {
    if (!athleteProfile) return

    const { data, error } = await supabase
      .from('athlete_profiles')
      .update(updates)
      .eq('id', athleteProfile.id)
      .select()
      .single()

    if (error) throw error
    setAthleteProfile(data)
    return data
  }

  return { athleteProfile, loading, updateProfile }
}

export function useCoachProfile() {
  const { profile } = useAuth()
  const [coachProfile, setCoachProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (profile?.coach_profiles) {
      setCoachProfile(profile.coach_profiles[0])
      setLoading(false)
    }
  }, [profile])

  const updateProfile = async (updates: any) => {
    if (!coachProfile) return

    const { data, error } = await supabase
      .from('coach_profiles')
      .update(updates)
      .eq('id', coachProfile.id)
      .select()
      .single()

    if (error) throw error
    setCoachProfile(data)
    return data
  }

  return { coachProfile, loading, updateProfile }
}
