'use client'

export default function TickerLink({
  ticker,
  style,
}: {
  ticker: string
  style?: React.CSSProperties
}) {
  return (
    <a
      href={`https://www.google.com/search?q=${ticker}+ação+B3+cotação`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={`Pesquisar ${ticker} no Google`}
      style={{
        color: 'inherit',
        textDecoration: 'none',
        borderBottom: '1px dashed rgba(0,196,74,0.4)',
        cursor: 'alias',
        transition: 'border-color 0.15s, color 0.15s',
        ...style,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderBottomColor = '#00c44a'
        ;(e.currentTarget as HTMLElement).style.color = '#00c44a'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(0,196,74,0.4)'
        ;(e.currentTarget as HTMLElement).style.color = ''
      }}
    >
      {ticker}
    </a>
  )
}
