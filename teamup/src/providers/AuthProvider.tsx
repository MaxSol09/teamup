'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import CompleteProfileModal from '@/components/modals/CompleteProfileModal'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth)
  const openProfileModal = useAuthStore(state => state.openProfileModal)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) return

    authService.getMe(token)
      .then(({ data }) => {
        console.log('мои данные >>>> ', data)
        setAuth(token, data)
        
        // Если профиль не заполнен, показываем модалку
        if (data && !data.isProfileCompleted) {
          openProfileModal()
        }
      })
      .catch(() => {
        console.log('произошла ошибочка')
      })
  }, [setAuth, openProfileModal])

  return (
    <>
      <CompleteProfileModal />
      {children}
    </>
  )
}