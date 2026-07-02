import Link from 'next/link'
import PequiIcon from './PequiIcon'

type Aba = 'home' | 'macro' | 'backtest' | 'segunda' | 'geopolitica' | 'patrimonio'

export default function Nav({ ativa }: { ativa: Aba }) {
  const links: { href: string; label: string; id: Aba; icon: string }[] = [
    { href: '/',              label: 'Relatórios',    id: 'home',        icon: 'ti-file-text' },
    { href: '/segunda-feira', label: 'Segunda-feira', id: 'segunda',     icon: 'ti-calendar-week' },
    { href: '/macro',         label: 'Macro',         id: 'macro',       icon: 'ti-world' },
    { href: '/geopolitica',   label: 'Geopolítica',   id: 'geopolitica', icon: 'ti-radar' },
    { href: '/patrimonio',    label: 'Patrimônio',    id: 'patrimonio',  icon: 'ti-chart-line' },
    { href: '/backtesting',   label: 'Backtesting',   id: 'backtest',    icon: 'ti-history' },
  ]

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Logo Pequi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <PequiIcon size={36} />
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.03em' }}>B3 Radar</span>
            <span style={{ fontSize: '0.65rem', color: '#d4a017', background: '#d4a01720', border: '1px solid #d4a01740', borderRadius: 4, padding: '0.1rem 0.4rem', fontWeight: 700, letterSpacing: '0.1em' }}>PEQUI ESTÚDIO</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#5a7a60' }}>Análise técnica · Macro · Geopolítica</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#009c3b' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#009c3b', display: 'inline-block' }}/>
          Ao vivo
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
