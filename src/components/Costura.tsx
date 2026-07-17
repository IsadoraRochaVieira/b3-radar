'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Costura dourada — o motivo-assinatura do Caryo Map.
 * As fissuras que brilham no pequi cortado viram o divisor entre seções.
 * Acende da esquerda para a direita quando entra na tela.
 */
export default function Costura({ margem = '0' }: { margem?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisivel(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" style={{ margin: margem, height: 1, overflow: 'hidden' }}>
      <div style={{
        height: 1, width: '100%',
        background: 'linear-gradient(90deg, transparent, #a06d08 15%, #f0b429 50%, #a06d08 85%, transparent)',
        boxShadow: '0 0 12px rgba(240,180,41,0.28)',
        transform: visivel ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left center',
        transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: 0.6,
      }} />
    </div>
  )
}
