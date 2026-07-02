import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Nav from '@/components/Nav'
import HomeClient from '@/components/HomeClient'

function getRelatorios() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && f !== 'backtest_historico.json' && !f.startsWith('noticias_'))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 40)
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'))
      return { slug: f.replace('.json', ''), ...data }
    })
}

function getUltimoRelatorio(relatorios: any[]) {
  return relatorios[0] ?? null
}

function getRelatoriosDia(relatorios: any[], dataIso: string) {
  return relatorios.filter(r => r.data_iso === dataIso)
}

export default function Home() {
  const relatorios = getRelatorios()
  const ultimo = getUltimoRelatorio(relatorios)
  const hoje = ultimo?.data_iso
  const relatoriosHoje = hoje ? getRelatoriosDia(relatorios, hoje) : []

  const semaforo = ultimo?.semaforo ?? 'verde'
  const pick = ultimo?.pick_semana ?? (ultimo?.candidatos ?? []).find((c: any) => c.acao === 'COMPRAR')
  const corSem: Record<string, { bg: string; border: string; text: string; label: string }> = {
    verde:    { bg: '#009c3b18', border: '#009c3b', text: '#00c44a', label: 'Operar normal' },
    amarelo:  { bg: '#ffdf0018', border: '#d4a017', text: '#ffdf00', label: 'Reduzir tamanho' },
    vermelho: { bg: '#ff446618', border: '#cc2244', text: '#ff4466', label: 'Só caixa' },
  }
  const s = corSem[semaforo] ?? corSem.verde

  // Lista histórica: agrupa por dia, mostra os dois turnos do dia
  const porDia: Record<string, any[]> = {}
  for (const r of relatorios) {
    const k = r.data_iso ?? r.slug
    if (!porDia[k]) porDia[k] = []
    porDia[k].push(r)
  }
  const diasOrdenados = Object.keys(porDia).sort((a, b) => b.localeCompare(a))

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="home" />

      {/* Semáforo + Pick da Semana */}
      <div style={{ display: 'grid', gridTemplateColumns: pick ? '1fr 1fr' : '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Link href="/segunda-feira">
          <div style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 12, padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: s.border, boxShadow: `0 0 10px ${s.border}`, flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: '0.65rem', color: s.text, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Semáforo da semana</div>
              <div style={{ color: s.text, fontWeight: 800, fontSize: '1.05rem', marginTop: 2 }}>{s.label}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#5a7a60', fontSize: '0.8rem' }}>→</span>
          </div>
        </Link>
        {pick && (
          <Link href="/segunda-feira">
            <div style={{ background: 'linear-gradient(135deg, #0d1a10, #071510)', border: '2px solid #d4a017', borderRadius: 12, padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d4a017' }}>★</span>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#d4a017', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Pick da semana</div>
                <div style={{ color: '#e8f5e9', fontWeight: 800, fontSize: '1.1rem', marginTop: 2 }}>{pick.ticker} <span style={{ color: '#00c44a', fontSize: '0.85rem' }}>{pick.score}pts</span></div>
              </div>
              <span style={{ marginLeft: 'auto', color: '#5a7a60', fontSize: '0.8rem' }}>→</span>
            </div>
          </Link>
        )}
      </div>

      {/* Relatórios de hoje (manhã + tarde) */}
      {relatoriosHoje.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 3, height: 16, background: '#009c3b', borderRadius: 2 }}/>
            <span style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              Relatórios de hoje — {ultimo?.data}
            </span>
            <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {relatoriosHoje.map((r: any) => (
              <Link key={r.slug} href={`/relatorio/${r.slug}`}>
                <div style={{ background: 'linear-gradient(135deg, #0d1a10, #071510)', border: '1px solid #009c3b50', borderLeft: '4px solid #009c3b', borderRadius: 13, padding: '1.4rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle, #ffdf0008 0%, transparent 70%)' }}/>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.68rem', color: '#00c44a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {r.turno === 'manha' ? '🌅 Relatório Manhã' : '☀️ Relatório Tarde'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#5a7a60', marginLeft: 'auto' }}>{r.hora_geracao}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 8 }}>
                    {(r.tops || []).slice(0, 4).map((t: any) => (
                      <span key={t.ticker} style={{ background: '#009c3b20', border: '1px solid #009c3b', color: '#00c44a', borderRadius: 6, padding: '0.2rem 0.6rem', fontSize: '0.78rem', fontWeight: 700 }}>
                        {t.ticker} · {t.score}pts
                      </span>
                    ))}
                  </div>
                  <p style={{ color: '#5a7a60', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>{r.resumo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Macro */}
      {ultimo?.macro && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Ibovespa', valor: ultimo.macro.ibovespa, cor: (ultimo.macro.ibovespa_var ?? 0) >= 0 ? '#00c44a' : '#ff4466' },
            { label: 'Var. dia',  valor: `${(ultimo.macro.ibovespa_var ?? 0) > 0 ? '+' : ''}${ultimo.macro.ibovespa_var}%`, cor: (ultimo.macro.ibovespa_var ?? 0) >= 0 ? '#00c44a' : '#ff4466' },
            { label: 'Dólar',    valor: `R$ ${ultimo.macro.dolar}`, cor: '#ffdf00' },
            { label: 'Selic',    valor: `${ultimo.macro.selic}%`, cor: '#4488ff' },
            { label: 'Brent',    valor: `US$ ${ultimo.macro.brent}`, cor: '#ffdf00' },
          ].map(item => (
            <div key={item.label} style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 10, padding: '0.85rem 1rem' }}>
              <div style={{ color: '#5a7a60', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
              <div style={{ color: item.cor, fontWeight: 800, fontSize: '1.1rem', marginTop: 4 }}>{item.valor}</div>
            </div>
          ))}
        </div>
      )}

      {/* Plano personalizado (capital do usuário) */}
      <HomeClient />

      {/* Histórico por dia */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <div style={{ width: 3, height: 16, background: '#1a2e1e', borderRadius: 2 }}/>
        <h3 style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Histórico</h3>
        <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {diasOrdenados.slice(1).map(dia => {
          const turnos = porDia[dia]
          const ref = turnos[0]
          return (
            <div key={dia} style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 10, padding: '0.9rem 1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#e8f5e9', fontSize: '0.9rem' }}>{ref.data}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {turnos.map((t: any) => (
                    <Link key={t.slug} href={`/relatorio/${t.slug}`}>
                      <span style={{ background: '#009c3b15', border: '1px solid #009c3b40', borderRadius: 6, padding: '0.25rem 0.7rem', fontSize: '0.78rem', color: '#00c44a', fontWeight: 600, cursor: 'pointer' }}>
                        {t.turno === 'manha' ? '🌅 Manhã' : t.turno === 'tarde' ? '☀️ Tarde' : '📄 Relatório'}
                      </span>
                    </Link>
                  ))}
                  <span style={{ color: '#5a7a60', fontSize: '0.78rem' }}>{ref.resumo_curto}</span>
                </div>
              </div>
            </div>
          )
        })}

        {relatorios.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#5a7a60', border: '1px dashed #1a2e1e', borderRadius: 12 }}>
            Nenhum relatório ainda. Rode <code>python gerar_e_publicar.py</code> para gerar o primeiro.
          </div>
        )}
      </div>
    </main>
  )
}
