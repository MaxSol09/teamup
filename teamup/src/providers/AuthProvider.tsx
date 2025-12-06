'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) return

    authService.getMe(token)
      .then(({ data }) => {
        console.log('мои данные >>>> ', data)
        setAuth(token, data)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
  }, [setAuth])

  return <>{children}</>
}