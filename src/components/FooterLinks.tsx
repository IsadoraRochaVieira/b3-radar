'use client'

const links = [
  { label: 'Relatórios', href: '/' },
  { label: 'Sugestões',  href: '/sugestoes' },
  { label: 'Macro',      href: '/macro' },
  { label: 'Patrimônio', href: '/patrimonio' },
]

export default function FooterLinks() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      {links.map(l => (
        <a
          key={l.href}
          href={l.href}
          style={{ color: '#4a6a52', fontSize: '0.78rem', transition: 'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#00c44a')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#4a6a52')}
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}
