// Authentication and role-based access control

export type UserRole = 'athlete' | 'coach'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// Mock current user - in production, this would come from Supabase auth
export const getCurrentUser = (): User | null => {
  // This is mock data - replace with actual auth logic
  if (typeof window !== 'undefined') {
    const userRole = localStorage.getItem('userRole') as UserRole | null
    if (userRole) {
      return {
        id: '1',
        email: 'user@example.com',
        name: userRole === 'athlete' ? 'Jordan Davis' : 'Coach Anderson',
        role: userRole
      }
    }
  }
  return null
}

export const setUserRole = (role: UserRole) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', role)
  }
}

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole')
  }
}

export const isAthlete = (user: User | null): boolean => {
  return user?.role === 'athlete'
}

export const isCoach = (user: User | null): boolean => {
  return user?.role === 'coach'
}

export const requireAuth = (role?: UserRole): User => {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  if (role && user.role !== role) {
    throw new Error('Unauthorized access')
  }
  return user
}
