import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'

function getRelatorio(slug: string) {
  const filePath = path.join(process.cwd(), 'relatorios', `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ slug: f.replace('.json', '') }))
}

const corScore = (score: number) => {
  if (score >= 60) return 'var(--green)'
  if (score >= 40) return 'var(--yellow)'
  return 'var(--muted)'
}

const corAcao = (acao: string) => {
  if (acao === 'COMPRAR') return { color: 'var(--green)', bg: '#00ff8815', border: 'var(--green)' }
  if (acao === 'EVITAR') return { color: 'var(--red)', bg: '#ff446615', border: 'var(--red)' }
  return { color: 'var(--yellow)', bg: '#ffd70015', border: 'var(--yellow)' }
}

export default function RelatorioPage({ params }: { params: { slug: string } }) {
  const r = getRelatorio(params.slug)
  if (!r) return notFound()

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
        ← Voltar ao histórico
      </Link>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Relatório B3</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>{r.data} · Gerado automaticamente</p>
      </header>

      {/* Card Ações Rápidas */}
      {r.candidatos && r.candidatos.length > 0 && (() => {
        const comprar = r.candidatos.filter((c: any) => c.acao === 'COMPRAR').slice(0, 2)
        const monitorar = r.candidatos.filter((c: any) => c.acao === 'MONITORAR').slice(0, 1)
        return (
          <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.9rem', fontWeight: 700 }}>
              Ações rápidas para hoje
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {comprar.map((c: any, i: number) => (
                <div key={c.ticker} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#009c3b18', border: '1px solid #009c3b40', borderRadius: 8, padding: '0.65rem 1rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#00c44a', minWidth: 20 }}>{i + 1}</span>
                  <span style={{ color: '#e8f5e9', fontSize: '0.87rem' }}>
                    <strong>Comprar {c.ticker}</strong>{c.entrada ? ` — entrada R$ ${c.entrada}` : ''}{c.stop ? ` · stop R$ ${c.stop}` : ''}
                  </span>
                </div>
              ))}
              {monitorar.map((c: any) => (
                <div key={c.ticker} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#d4a01715', border: '1px solid #d4a01740', borderRadius: 8, padding: '0.65rem 1rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#d4a017', minWidth: 20 }}>{comprar.length + 1}</span>
                  <span style={{ color: '#e8f5e9', fontSize: '0.87rem' }}>
                    <strong>Monitorar {c.ticker}</strong> — aguardar confirmação técnica antes de entrar
                  </span>
                </div>
              ))}
              {comprar.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ffffff08', border: '1px solid #1a2e1e', borderRadius: 8, padding: '0.65rem 1rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#5a7a60', minWidth: 20 }}>1</span>
                  <span style={{ color: '#a0c8a8', fontSize: '0.87rem' }}>Manter caixa — sem oportunidades claras no momento</span>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* Macro */}
      {r.macro && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={secTitle}>Cenário Macro</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'Ibovespa', valor: r.macro.ibovespa },
              { label: 'Variação', valor: `${r.macro.ibovespa_var > 0 ? '+' : ''}${r.macro.ibovespa_var}%`, cor: r.macro.ibovespa_var >= 0 ? 'var(--green)' : 'var(--red)' },
              { label: 'Dólar', valor: `R$ ${r.macro.dolar}` },
              { label: 'Selic', valor: `${r.macro.selic}%` },
              { label: 'Brent', valor: `US$ ${r.macro.brent}` },
            ].map(item => (
              <div key={item.label} style={card}>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{item.label}</div>
                <div style={{ color: item.cor || 'var(--text)', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.25rem' }}>{item.valor}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Candidatos */}
      {r.candidatos && r.candidatos.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={secTitle}>Candidatos do Dia</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {r.candidatos.map((c: any) => {
              const ac = corAcao(c.acao)
              return (
                <div key={c.ticker} style={{ ...card, borderLeft: `4px solid ${ac.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.ticker}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{c.nome}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: corScore(c.score), fontWeight: 700 }}>{c.score}pts</span>
                      <span style={{
                        background: ac.bg,
                        border: `1px solid ${ac.border}`,
                        color: ac.color,
                        borderRadius: 6,
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}>{c.acao}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
                    {[
                      { label: 'Preço', valor: `R$ ${c.preco}` },
                      { label: 'RSI', valor: c.rsi },
                      { label: 'P/L', valor: c.pl || '-' },
                      { label: 'Stop', valor: c.stop ? `R$ ${c.stop}` : '-' },
                      { label: 'Alvo', valor: c.alvo ? `R$ ${c.alvo}` : '-' },
                      { label: 'Entrada', valor: c.entrada ? `R$ ${c.entrada}` : '-' },
                    ].map(i => (
                      <div key={i.label}>
                        <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{i.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{i.valor}</div>
                      </div>
                    ))}
                  </div>

                  {c.tese && (
                    <p style={{ color: 'var(--text)', fontSize: '0.88rem', marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', lineHeight: 1.6 }}>
                      {c.tese}
                    </p>
                  )}
                  {c.risco && (
                    <p style={{ color: 'var(--red)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                      ⚠ {c.risco}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Plano de ação */}
      {r.plano && r.plano.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={secTitle}>Plano de Ação</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                  {['Ativo', 'Ação', 'Valor', 'Entrada', 'Stop', 'Alvo'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.plano.map((p: any) => {
                  const ac = corAcao(p.acao)
                  return (
                    <tr key={p.ativo} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: ac.color }}>{p.ativo}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: ac.color }}>{p.acao}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{p.valor}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{p.entrada}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--red)' }}>{p.stop}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--green)' }}>{p.alvo}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Resumo executivo */}
      {r.resumo_executivo && (
        <section style={{ ...card, borderLeft: '4px solid var(--blue)' }}>
          <h2 style={{ ...secTitle, marginBottom: '0.75rem' }}>Resumo Executivo</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>{r.resumo_executivo}</p>
        </section>
      )}
    </main>
  )
}

const secTitle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '0.75rem',
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '1.2rem',
}
