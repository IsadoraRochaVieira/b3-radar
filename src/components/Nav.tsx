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
    <div style={{ marginBottom: '1.75rem' }}>
      {/* ── Barra única: logo + links + usuário ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: '#0d1a10',
        border: '1px solid #1a2e1e',
        borderRadius: 12,
        padding: '0.45rem 0.75rem',
        flexWrap: 'wrap',
      }}>
        {/* Logo — lado esquerdo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0, marginRight: '0.25rem' }}>
          <PequiIcon size={26} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.02em' }}>B3 Radar</span>
          <span style={{ fontSize: '0.6rem', color: '#d4a017', background: '#d4a01720', border: '1px solid #d4a01740', borderRadius: 3, padding: '1px 5px', fontWeight: 700, letterSpacing: '0.08em' }}>PEQUI</span>
        </Link>

        {/* Divisor */}
        <div style={{ width: 1, height: 20, background: '#1a2e1e', flexShrink: 0 }}/>

        {/* Links de navegação */}
        <nav style={{ display: 'flex', gap: '0.15rem', flex: 1, flexWrap: 'wrap' }}>
          {links.map(l => (
            <Link key={l.id} href={l.href} style={{
              padding: '0.35rem 0.7rem',
              borderRadius: 7,
              fontSize: '0.8rem',
              fontWeight: ativa === l.id ? 600 : 400,
              color: ativa === l.id ? '#e8f5e9' : '#5a7a60',
              background: ativa === l.id ? '#009c3b30' : 'transparent',
              border: ativa === l.id ? '1px solid #009c3b50' : '1px solid transparent',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Divisor */}
        <div style={{ width: 1, height: 20, background: '#1a2e1e', flexShrink: 0 }}/>

        {/* Usuário + ao vivo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#009c3b' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#009c3b', display: 'inline-block' }}/>
            Ao vivo
          </div>
          {user && (
            <>
              <div style={{ fontSize: '0.75rem', color: '#5a7a60' }}>
                <span style={{ color: '#e8f5e9', fontWeight: 700 }}>{user.nome}</span>
                <span style={{ color: '#009c3b', marginLeft: '0.3rem' }}>R$ {user.capital.toLocaleString('pt-BR')}</span>
              </div>
              <button onClick={() => { logout(); router.push('/login') }} style={{
                background: 'transparent', border: '1px solid #1a2e1e', borderRadius: 6,
                padding: '0.2rem 0.55rem', color: '#5a7a60', fontSize: '0.7rem',
                cursor: 'pointer',
              }}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
