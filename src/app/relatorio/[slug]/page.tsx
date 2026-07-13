import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import TickerLink from '@/components/TickerLink'

function getRelatorio(slug: string) {
  const filePath = path.join(process.cwd(), 'relatorios', `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && f !== 'backtest_historico.json')
    .map(f => ({ slug: f.replace('.json', '') }))
}

// Next.js 15/16: params must be awaited
export default async function RelatorioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = getRelatorio(slug)
  if (!r) return notFound()

  const corAcao = (acao: string) => {
    if (acao === 'COMPRAR') return { cor: '#00c44a', bg: '#009c3b18', borda: '#009c3b' }
    if (acao === 'EVITAR')  return { cor: '#ff4466', bg: '#ff446615', borda: '#cc2244' }
    return { cor: '#ffdf00', bg: '#ffdf0015', borda: '#d4a017' }
  }

  const corScore = (s: number) => s >= 60 ? '#00c44a' : s >= 40 ? '#ffdf00' : '#5a7a60'

  const comprar   = (r.candidatos ?? []).filter((c: any) => c.acao === 'COMPRAR')
  const observar  = (r.candidatos ?? []).filter((c: any) => c.acao !== 'COMPRAR' && c.acao !== 'EVITAR')
  const evitar    = (r.candidatos ?? []).filter((c: any) => c.acao === 'EVITAR')

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="home" />

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#5a7a60' }}>
        <Link href="/painel" style={{ color: '#5a7a60' }}>Relatórios</Link>
        <span>/</span>
        <span style={{ color: '#e8f5e9' }}>{r.data}</span>
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d1a10, #071510)', border: '1px solid #1a2e1e', borderLeft: '4px solid #009c3b', borderRadius: 14, padding: '1.5rem 2rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#00c44a', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 6 }}>Relatório Diário</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.02em', margin: 0 }}>{r.data}</h1>
            <p style={{ color: '#5a7a60', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.6, maxWidth: 520 }}>{r.resumo}</p>
          </div>
          {/* Semáforo */}
          {r.semaforo && (() => {
            const sem: Record<string, { cor: string; texto: string; label: string }> = {
              verde:    { cor: '#009c3b', texto: '#00c44a', label: 'Operar normal' },
              amarelo:  { cor: '#d4a017', texto: '#ffdf00', label: 'Reduzir tamanho' },
              vermelho: { cor: '#cc2244', texto: '#ff4466', label: 'Só caixa' },
            }
            const s = sem[r.semaforo] ?? sem.verde
            return (
              <div style={{ textAlign: 'center', background: `${s.cor}18`, border: `2px solid ${s.cor}`, borderRadius: 12, padding: '0.9rem 1.5rem' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.cor, boxShadow: `0 0 12px ${s.cor}`, margin: '0 auto 6px' }}/>
                <div style={{ color: s.texto, fontWeight: 800, fontSize: '0.95rem' }}>{s.label}</div>
                <div style={{ color: s.texto, fontSize: '0.68rem', opacity: 0.8, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Semáforo</div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Ações Rápidas */}
      {comprar.length > 0 && (
        <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.1rem 1.4rem', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.8rem' }}>
            Ações rápidas para hoje
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {comprar.slice(0, 3).map((c: any, i: number) => (
              <div key={c.ticker} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#009c3b18', border: '1px solid #009c3b40', borderRadius: 8, padding: '0.6rem 1rem' }}>
                <span style={{ fontWeight: 800, color: '#00c44a', minWidth: 20, fontSize: '0.9rem' }}>{i + 1}</span>
                <span style={{ color: '#e8f5e9', fontSize: '0.87rem', flex: 1 }}>
                  <strong>Comprar <TickerLink ticker={c.ticker} /></strong>{c.entrada ? ` — entrada R$ ${c.entrada}` : ''}{c.stop ? ` · stop R$ ${c.stop}` : ''}{c.alvo ? ` · alvo R$ ${c.alvo}` : ''}
                </span>
                <span style={{ color: '#00c44a', fontWeight: 800, fontSize: '0.85rem' }}>{c.score}pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Macro */}
      {r.macro && (
        <section style={{ marginBottom: '1.75rem' }}>
          <SectionTitle>Cenário Macro</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
            {[
              { label: 'Ibovespa', valor: r.macro.ibovespa, cor: (r.macro.ibovespa_var ?? 0) >= 0 ? '#00c44a' : '#ff4466' },
              { label: 'Variação',  valor: `${(r.macro.ibovespa_var ?? 0) > 0 ? '+' : ''}${r.macro.ibovespa_var ?? 0}%`, cor: (r.macro.ibovespa_var ?? 0) >= 0 ? '#00c44a' : '#ff4466' },
              { label: 'Dólar',    valor: `R$ ${r.macro.dolar}`, cor: '#ffdf00' },
              { label: 'Selic',    valor: `${r.macro.selic}% a.a.`, cor: '#4488ff' },
              { label: 'Brent',    valor: `US$ ${r.macro.brent}`, cor: '#ffdf00' },
            ].map(item => (
              <div key={item.label} style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 10, padding: '0.85rem 1rem' }}>
                <div style={{ color: '#5a7a60', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
                <div style={{ color: item.cor, fontWeight: 800, fontSize: '1.1rem', marginTop: 4 }}>{item.valor}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMPRAR */}
      {comprar.length > 0 && (
        <section style={{ marginBottom: '1.75rem' }}>
          <SectionTitle color="#00c44a">Comprar ({comprar.length})</SectionTitle>
          <AtivoGrid ativos={comprar} corAcao={corAcao} corScore={corScore} />
        </section>
      )}

      {/* OBSERVAR */}
      {observar.length > 0 && (
        <section style={{ marginBottom: '1.75rem' }}>
          <SectionTitle color="#ffdf00">Observar ({observar.length})</SectionTitle>
          <AtivoGrid ativos={observar} corAcao={corAcao} corScore={corScore} />
        </section>
      )}

      {/* EVITAR */}
      {evitar.length > 0 && (
        <section style={{ marginBottom: '1.75rem' }}>
          <SectionTitle color="#ff4466">Evitar ({evitar.length})</SectionTitle>
          <AtivoGrid ativos={evitar} corAcao={corAcao} corScore={corScore} />
        </section>
      )}

      {/* Plano */}
      {r.plano && r.plano.length > 0 && (
        <section style={{ marginBottom: '1.75rem' }}>
          <SectionTitle>Plano de Alocação</SectionTitle>
          <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    {['Ativo', 'Ação', 'Valor', 'Entrada', 'Stop', 'Alvo', 'Risco/Op.'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #1a2e1e', textAlign: 'left', color: '#5a7a60', fontWeight: 500, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.plano.map((p: any) => {
                    const ac = corAcao(p.acao)
                    return (
                      <tr key={p.ativo} style={{ borderBottom: '1px solid #1a2e1e' }}>
                        <td style={{ padding: '0.7rem 1rem', fontWeight: 800, color: '#e8f5e9' }}>{p.ativo}</td>
                        <td style={{ padding: '0.7rem 1rem' }}>
                          <span style={{ color: ac.cor, background: ac.bg, border: `1px solid ${ac.borda}40`, borderRadius: 5, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>{p.acao}</span>
                        </td>
                        <td style={{ padding: '0.7rem 1rem', color: '#e8f5e9', fontWeight: 600 }}>{p.valor}</td>
                        <td style={{ padding: '0.7rem 1rem', color: '#a0c8a8' }}>{p.entrada}</td>
                        <td style={{ padding: '0.7rem 1rem', color: '#ff4466' }}>{p.stop}</td>
                        <td style={{ padding: '0.7rem 1rem', color: '#00c44a' }}>{p.alvo}</td>
                        <td style={{ padding: '0.7rem 1rem', color: '#ffdf00' }}>—</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Resumo executivo */}
      {r.resumo_executivo && (
        <section style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderLeft: '4px solid #002776', borderRadius: 12, padding: '1.4rem 1.6rem' }}>
          <SectionTitle>Resumo Executivo</SectionTitle>
          <p style={{ lineHeight: 1.8, color: '#a0c8a8', fontSize: '0.9rem' }}>{r.resumo_executivo}</p>
        </section>
      )}
    </main>
  )
}

function SectionTitle({ children, color = '#5a7a60' }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
      <div style={{ width: 3, height: 16, background: color, borderRadius: 2 }}/>
      <h2 style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, margin: 0 }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
    </div>
  )
}

function AtivoGrid({ ativos, corAcao, corScore }: { ativos: any[]; corAcao: (a: string) => any; corScore: (s: number) => string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
      {ativos.map((c: any) => {
        const ac = corAcao(c.acao)
        const rr = c.alvo && c.entrada && c.stop
          ? ((parseFloat(c.alvo) - parseFloat(c.entrada)) / (parseFloat(c.entrada) - parseFloat(c.stop))).toFixed(1)
          : null
        return (
          <div key={c.ticker} style={{ background: '#0d1a10', border: `1px solid #1a2e1e`, borderLeft: `3px solid ${ac.borda}`, borderRadius: 10, padding: '1.1rem' }}>
            {/* Topo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#e8f5e9' }}>
                  <TickerLink ticker={c.ticker} style={{ fontSize: '1.15rem', fontWeight: 800 }} />
                </div>
                <div style={{ color: '#5a7a60', fontSize: '0.75rem', marginTop: 1 }}>{c.nome || c.ticker}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: corScore(c.score), fontWeight: 800, fontSize: '0.9rem' }}>{c.score}pts</span>
                <span style={{ color: ac.cor, background: ac.bg, border: `1px solid ${ac.borda}40`, borderRadius: 5, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{c.acao}</span>
              </div>
            </div>

            {/* Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
              {[
                { l: 'Entrada', v: c.entrada ? `R$ ${c.entrada}` : `R$ ${c.preco}`, c: '#00c44a' },
                { l: 'Stop',    v: c.stop ? `R$ ${c.stop}` : '—', c: '#ff4466' },
                { l: 'Alvo',    v: c.alvo ? `R$ ${c.alvo}` : '—', c: '#00c44a' },
                { l: 'RSI',     v: c.rsi ?? '—', c: '#e8f5e9' },
                { l: 'P/L',     v: c.pl ?? '—', c: '#e8f5e9' },
                { l: 'R:R',     v: rr ? `1:${rr}` : '—', c: rr && parseFloat(rr) >= 2 ? '#00c44a' : '#5a7a60' },
              ].map(m => (
                <div key={m.l} style={{ background: '#07100a', borderRadius: 6, padding: '0.45rem 0.55rem' }}>
                  <div style={{ fontSize: '0.62rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.l}</div>
                  <div style={{ color: m.c, fontWeight: 700, fontSize: '0.85rem', marginTop: 2 }}>{m.v}</div>
                </div>
              ))}
            </div>

            {/* Tese */}
            {c.tese && <p style={{ color: '#a0c8a8', fontSize: '0.8rem', lineHeight: 1.55, borderTop: '1px solid #1a2e1e', paddingTop: 8, margin: 0 }}>{c.tese}</p>}
            {c.risco && <p style={{ color: '#ff6680', fontSize: '0.75rem', marginTop: 5, display: 'flex', gap: '0.3rem', alignItems: 'flex-start' }}><span>⚠</span>{c.risco}</p>}
          </div>
        )
      })}
    </div>
  )
}
