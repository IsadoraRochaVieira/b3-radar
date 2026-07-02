'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PequiIcon from './PequiIcon'
import { useAuth } from '@/contexts/AuthContext'

type Aba = 'home' | 'macro' | 'backtest' | 'segunda' | 'geopolitica' | 'patrimonio' | 'noticias'

export default function Nav({ ativa }: { ativa: Aba }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const links: { href: string; label: string; id: Aba; icon: string }[] = [
    { href: '/',              label: 'Relatórios',    id: 'home',        icon: 'ti-file-text' },
    { href: '/segunda-feira', label: 'Segunda-feira', id: 'segunda',     icon: 'ti-calendar-week' },
    { href: '/macro',         label: 'Macro',         id: 'macro',       icon: 'ti-world' },
    { href: '/geopolitica',   label: 'Geopolítica',   id: 'geopolitica', icon: 'ti-radar' },
    { href: '/patrimonio',    label: 'Patrimônio',    id: 'patrimonio',  icon: 'ti-chart-line' },
    { href: '/noticias',       label: 'Notícias BR',   id: 'noticias',    icon: 'ti-news' },
    { href: '/backtesting',   label: 'Backtesting',   id: 'backtest',    icon: 'ti-history' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Logo + usuário */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <PequiIcon size={36} />
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.03em' }}>B3 Radar</span>
            <span style={{ fontSize: '0.65rem', color: '#d4a017', background: '#d4a01720', border: '1px solid #d4a01740', borderRadius: 4, padding: '0.1rem 0.4rem', fontWeight: 700, letterSpacing: '0.1em' }}>PEQUI ESTÚDIO</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#5a7a60' }}>Análise técnica · Macro · Geopolítica</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Ao vivo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#009c3b' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#009c3b', display: 'inline-block' }}/>
            Ao vivo
          </div>

          {/* Usuário */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 8, padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
                <span style={{ color: '#5a7a60' }}>Olá, </span>
                <span style={{ color: '#e8f5e9', fontWeight: 700 }}>{user.nome}</span>
                <span style={{ color: '#009c3b', fontWeight: 700, marginLeft: '0.4rem' }}>
                  · R$ {user.capital.toLocaleString('pt-BR')}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid #1a2e1e', borderRadius: 8,
                padding: '0.3rem 0.6rem', color: '#5a7a60', fontSize: '0.72rem',
                cursor: 'pointer', fontWeight: 500,
              }}>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: '0.25rem', background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 10, padding: '0.3rem', flexWrap: 'wrap' }}>
        {links.map(l => (
          <Link key={l.id} href={l.href} style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.4rem 0.85rem', borderRadius: 7,
            fontSize: '0.82rem',
            fontWeight: ativa === l.id ? 600 : 400,
            color: ativa === l.id ? '#e8f5e9' : '#5a7a60',
            background: ativa === l.id ? '#009c3b30' : 'transparent',
            border: ativa === l.id ? '1px solid #009c3b50' : '1px solid transparent',
            whiteSpace: 'nowrap',
          }}>
            <i className={`ti ${l.icon}`} style={{ fontSize: 13 }} aria-hidden="true"/>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
