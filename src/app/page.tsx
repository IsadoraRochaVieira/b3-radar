import fs from 'fs'
import path from 'path'
import Link from 'next/link'

function getRelatorios() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 30)
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'))
      return { slug: f.replace('.json', ''), ...data }
    })
}

export default function Home() {
  const relatorios = getRelatorios()
  const ultimo = relatorios[0]

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>📊</span>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>B3 Radar</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Análise técnica + geopolítica · Atualizado diariamente</p>
          </div>
        </div>
      </header>

      {/* Último relatório em destaque */}
      {ultimo && (
        <Link href={`/relatorio/${ultimo.slug}`}>
          <section style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--green)',
            borderRadius: 12,
            padding: '1.5rem',
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Mais recente
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  Relatório {ultimo.data}
                </h2>
                <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {ultimo.resumo || 'Análise completa disponível'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(ultimo.tops || []).slice(0, 3).map((t: any) => (
                  <span key={t.ticker} style={{
                    background: '#00ff8820',
                    border: '1px solid var(--green)',
                    color: 'var(--green)',
                    borderRadius: 6,
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}>
                    {t.ticker} · {t.score}pts
                  </span>
                ))}
              </div>
            </div>
          </section>
        </Link>
      )}

      {/* Ibovespa summary bar */}
      {ultimo?.macro && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}>
          {[
            { label: 'Ibovespa', valor: ultimo.macro.ibovespa, cor: ultimo.macro.ibovespa_var >= 0 ? 'var(--green)' : 'var(--red)' },
            { label: 'Dólar', valor: `R$ ${ultimo.macro.dolar}`, cor: 'var(--yellow)' },
            { label: 'Selic', valor: `${ultimo.macro.selic}%`, cor: 'var(--blue)' },
            { label: 'Brent', valor: `US$ ${ultimo.macro.brent}`, cor: 'var(--yellow)' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.75rem 1rem',
            }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{item.label}</div>
              <div style={{ color: item.cor, fontWeight: 700, fontSize: '1.1rem' }}>{item.valor}</div>
            </div>
          ))}
        </div>
      )}

      {/* Histórico */}
      <h3 style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Histórico
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {relatorios.slice(1).map(r => (
          <Link key={r.slug} href={`/relatorio/${r.slug}`}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.9rem 1.2rem',
              cursor: 'pointer',
            }}>
              <div>
                <span style={{ fontWeight: 600 }}>{r.data}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: '1rem' }}>
                  {r.resumo_curto || ''}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(r.tops || []).slice(0, 2).map((t: any) => (
                  <span key={t.ticker} style={{
                    background: 'var(--border)',
                    borderRadius: 4,
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--green)',
                  }}>
                    {t.ticker}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
        {relatorios.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--muted)',
            border: '1px dashed var(--border)',
            borderRadius: 12,
          }}>
            Nenhum relatório ainda. Rode o script para gerar o primeiro.
          </div>
        )}
      </div>
    </main>
  )
}
