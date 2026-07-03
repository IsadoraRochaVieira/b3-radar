'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PequiIcon from './PequiIcon'
import { useAuth } from '@/contexts/AuthContext'

type Aba = 'home' | 'macro' | 'backtest' | 'segunda' | 'geopolitica' | 'patrimonio' | 'noticias' | 'sugestoes'

export default function Nav({ ativa }: { ativa: Aba }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const links: { href: string; label: string; id: Aba }[] = [
    { href: '/',              label: 'Relatórios',   id: 'home'        },
    { href: '/sugestoes',     label: '10 Sugestões', id: 'sugestoes'   },
    { href: '/segunda-feira', label: 'Segunda',      id: 'segunda'     },
    { href: '/macro',         label: 'Macro',        id: 'macro'       },
    { href: '/noticias',      label: 'Notícias BR',  id: 'noticias'    },
    { href: '/geopolitica',   label: 'Geopolítica',  id: 'geopolitica' },
    { href: '/patrimonio',    label: 'Patrimônio',   id: 'patrimonio'  },
    { href: '/backtesting',   label: 'Backtesting',  id: 'backtest'    },
  ]

  return (
    <div style={{ marginBottom: '2rem', position: 'sticky', top: 12, zIndex: 100 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'rgba(8,15,10,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid #1e3a24',
        borderRadius: 14,
        padding: '0.5rem 0.8rem',
        flexWrap: 'wrap',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0, marginRight: '0.3rem' }}>
          <div style={{ position: 'relative' }}>
            <PequiIcon size={26} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(212,160,23,0.25) 0%, transparent 70%)', borderRadius: '50%' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontSize: '0.98rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #e2f0e4 30%, #00c44a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
            }}>B3 Radar</span>
            <span style={{
              fontSize: '0.52rem',
              color: '#f0b429',
              background: 'rgba(240,180,41,0.12)',
              border: '1px solid rgba(240,180,41,0.3)',
              borderRadius: 3,
              padding: '0 4px',
              letterSpacing: '0.1em',
              fontWeight: 700,
              marginTop: 2,
              alignSelf: 'flex-start',
            }}>PEQUI</span>
          </div>
        </Link>

        {/* Divisor */}
        <div style={{ width: 1, height: 22, background: 'linear-gradient(to bottom, transparent, #1e3a24, transparent)', flexShrink: 0, margin: '0 0.1rem' }}/>

        {/* Links */}
        <nav style={{ display: 'flex', gap: '0.1rem', flex: 1, flexWrap: 'wrap' }}>
          {links.map(l => {
            const isAtiva = ativa === l.id
            return (
              <Link key={l.id} href={l.href} style={{
                padding: '0.38rem 0.72rem',
                borderRadius: 8,
                fontSize: '0.79rem',
                fontWeight: isAtiva ? 700 : 400,
                color: isAtiva ? '#e2f0e4' : '#4a6a52',
                background: isAtiva
                  ? 'linear-gradient(135deg, rgba(0,156,59,0.22), rgba(0,196,74,0.08))'
                  : 'transparent',
                border: isAtiva ? '1px solid rgba(0,196,74,0.3)' : '1px solid transparent',
                boxShadow: isAtiva ? '0 0 12px rgba(0,196,74,0.08)' : 'none',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}>
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Divisor */}
        <div style={{ width: 1, height: 22, background: 'linear-gradient(to bottom, transparent, #1e3a24, transparent)', flexShrink: 0, margin: '0 0.1rem' }}/>

        {/* Direita: ao vivo + usuário */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="dot-live" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c44a', display: 'inline-block' }}/>
            <span style={{ fontSize: '0.68rem', color: '#00c44a', fontWeight: 600, letterSpacing: '0.06em' }}>AO VIVO</span>
          </div>

          {user && (
            <>
              <div style={{ width: 1, height: 16, background: '#1e3a24' }}/>
              <div style={{ fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(0,156,59,0.2), rgba(0,39,118,0.2))',
                  border: '1px solid #1e3a24',
                  borderRadius: 20,
                  padding: '0.18rem 0.6rem',
                  color: '#e2f0e4',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}>{user.nome}</span>
                <span style={{ color: '#f0b429', fontWeight: 700, fontSize: '0.72rem' }}>
                  R$ {user.capital.toLocaleString('pt-BR')}
                </span>
              </div>
              <button
                onClick={() => { logout(); router.push('/login') }}
                style={{
                  background: 'transparent',
                  border: '1px solid #1e3a24',
                  borderRadius: 7,
                  padding: '0.22rem 0.6rem',
                  color: '#4a6a52',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#ff3355'
                  ;(e.currentTarget as HTMLElement).style.color = '#ff3355'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#1e3a24'
                  ;(e.currentTarget as HTMLElement).style.color = '#4a6a52'
                }}
              >Sair</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
