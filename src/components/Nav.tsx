import Link from 'next/link'

export default function Nav({ ativa }: { ativa: 'home' | 'macro' | 'backtest' }) {
  const links = [
    { href: '/',            label: 'Relatórios',  id: 'home' },
    { href: '/macro',       label: 'Macro ao vivo', id: 'macro' },
    { href: '/backtesting', label: 'Backtesting',  id: 'backtest' },
  ]
  return (
    <nav style={{
      display: 'flex', gap: '0.25rem',
      background: '#0d1a10',
      border: '1px solid #1a2e1e',
      borderRadius: 10,
      padding: '0.3rem',
      marginBottom: '2rem',
      width: 'fit-content',
    }}>
      {links.map(l => (
        <Link key={l.id} href={l.href} style={{
          padding: '0.45rem 1rem',
          borderRadius: 7,
          fontSize: '0.85rem',
          fontWeight: ativa === l.id ? 600 : 400,
          color: ativa === l.id ? '#e8f5e9' : '#5a7a60',
          background: ativa === l.id ? '#009c3b30' : 'transparent',
          border: ativa === l.id ? '1px solid #009c3b50' : '1px solid transparent',
          whiteSpace: 'nowrap',
        }}>
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
