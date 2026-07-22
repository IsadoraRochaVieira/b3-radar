'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TickerLink from './TickerLink'

gsap.registerPlugin(useGSAP)

export function corAcao(acao: string) {
  if (acao === 'COMPRAR') return { cor: '#34d17e', bg: '#00a63c18', borda: '#00a63c' }
  if (acao === 'EVITAR')  return { cor: '#e53555', bg: '#e5355515', borda: '#b02a45' }
  return { cor: '#f0b429', bg: '#f0b42915', borda: '#d4920a' }
}

export function corScore(s: number) {
  return s >= 60 ? '#34d17e' : s >= 40 ? '#f0b429' : '#4d5f7a'
}

export default function AcoesInterativas({ ativos }: { ativos: any[] }) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Intro animada (as pílulas vêm de baixo)
    gsap.set('.pill', { y: 60, opacity: 0, scale: 0.95 })
    gsap.to('.pill', {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(1.2)'
    })

    // Flutuação suave contínua
    const pills = gsap.utils.toArray('.pill') as HTMLElement[]
    pills.forEach((pill, i) => {
      gsap.to(pill, {
        y: `+=${4 + i * 1.2}`,
        duration: 3 + i * 0.4,
        delay: i * 0.15,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      })

      // Efeito Tilt 3D com o Mouse
      pill.addEventListener('mousemove', (e) => {
        const r = pill.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        gsap.to(pill, {
          rotateX: -py * 8, // Sensibilidade do Tilt Vertical
          rotateY: px * 8,  // Sensibilidade do Tilt Horizontal
          y: -4,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1200,
          overwrite: 'auto'
        })
      })

      pill.addEventListener('mouseleave', () => {
        gsap.to(pill, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.6)',
          overwrite: 'auto'
        })
      })
    })

  }, { scope: container })

  return (
    <div ref={container} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
      {ativos.map((c: any, index: number) => {
        const ac = corAcao(c.acao)
        const rr = c.alvo && c.entrada && c.stop
          ? ((parseFloat(c.alvo) - parseFloat(c.entrada)) / (parseFloat(c.entrada) - parseFloat(c.stop))).toFixed(1)
          : null

        return (
          <div key={c.ticker} className="pill" style={{
            background: 'linear-gradient(180deg, #161d2a 0%, #0d1219 100%)',
            borderRadius: 34,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: `0 24px 40px -15px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.04), inset 0 -3px 5px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.02), inset -1px 0 0 rgba(0,0,0,0.2)`,
            position: 'relative',
            willChange: 'transform',
            border: `1px solid ${ac.borda}30`
          }}>
            {/* Top / Label Tile */}
            <div style={{
              background: 'linear-gradient(180deg, #141d2b 0%, #0a0e14 100%)',
              borderRadius: 24,
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), inset 0 0 0 1px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Brilho interno do Tile */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(255,255,255,0.03) 0%, transparent 30%, rgba(0,0,0,0.3) 100%)', pointerEvents: 'none' }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e8edf5', fontFamily: 'var(--mono)' }}>
                  <TickerLink ticker={c.ticker} />
                </div>
                <div style={{ color: '#4d5f7a', fontSize: '0.75rem', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.nome || c.ticker}</div>
              </div>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span style={{ color: corScore(c.score), fontWeight: 800, fontSize: '1.05rem', fontFamily: 'var(--mono)' }}>{c.score}pts</span>
                <span style={{ color: ac.cor, background: ac.bg, border: `1px solid ${ac.borda}40`, borderRadius: 6, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.acao}</span>
              </div>
            </div>

            {/* Bottom / Tools Tile */}
            <div style={{
              background: 'linear-gradient(180deg, #121926 0%, #080b10 100%)',
              borderRadius: 24,
              padding: '24px 20px',
              boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.3)',
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12
            }}>
              {[
                { l: 'Entrada', v: c.entrada ? `R$ ${c.entrada}` : `R$ ${c.preco}`, c: '#34d17e' },
                { l: 'Stop',    v: c.stop ? `R$ ${c.stop}` : '—', c: '#e53555' },
                { l: 'Alvo',    v: c.alvo ? `R$ ${c.alvo}` : '—', c: '#34d17e' },
                { l: 'RSI',     v: c.rsi ?? '—', c: '#e8edf5' },
                { l: 'P/L',     v: c.pl ?? '—', c: '#e8edf5' },
                { l: 'R:R',     v: rr ? `1:${rr}` : '—', c: rr && parseFloat(rr) >= 2 ? '#34d17e' : '#4d5f7a' },
              ].map(m => (
                <div key={m.l} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '0.62rem', color: '#4d5f7a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{m.l}</span>
                  <span style={{ color: m.c, fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>{m.v}</span>
                </div>
              ))}
            </div>

            {/* Tese (opcional) */}
            {c.tese && (
              <div style={{ padding: '0 10px 10px' }}>
                <p style={{ color: '#8a9bbf', fontSize: '0.8rem', lineHeight: 1.55, margin: 0 }}>{c.tese}</p>
                {c.risco && <p style={{ color: '#e5758a', fontSize: '0.75rem', marginTop: 8, display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}><span>⚠</span>{c.risco}</p>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
