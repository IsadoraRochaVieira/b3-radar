'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      // Give localStorage a moment to hydrate before redirecting
      const t = setTimeout(() => {
        if (!localStorage.getItem('b3radar_session')) {
          router.replace('/login')
        }
      }, 100)
      return () => clearTimeout(t)
    }
  }, [user, router])

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#5a7a60', fontSize: '0.88rem' }}>Carregando...</div>
      </div>
    )
  }

  return <>{children}</>
}
