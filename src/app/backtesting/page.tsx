import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav'

function getBacktest() {
  const f = path.join(process.cwd(), 'relatorios', 'backtest_historico.json')
  if (!fs.existsSync(f)) return []
  return JSON.parse(fs.readFileSync(f, 'utf-8'))
}

function getMetricasDoUltimoRelatorio() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && f !== 'backtest_historico.json')
    .sort((a, b) => b.localeCompare(a))
  if (!files.length) return null
  const d = JSON.parse(fs.readFileSync(path.join(dir, files[0]), 'utf-8'))
  return d.backtesting ?? null
}

const corRes = (v: number | null) => {
  if (v === null) return '#5a7a60'
  return v > 0 ? '#00c44a' : v < 0 ? '#ff4466' : '#5a7a60'
}

export default function BacktestingPage() {
  const historico: any[] = getBacktest()
  const metricas = getMetricasDoUltimoRelatorio()

  const fechados = historico.filter(op => op.status === 'fechado')
  const abertos = historico.filter(op => op.status === 'aberto')
  const ganhos = fechados.filter(op => (op.resultado_pct ?? 0) > 0)
  const perdas = fechados.filter(op => (op.resultado_pct ?? 0) <= 0)
  const taxaAcerto = fechados.length > 0 ? Math.round(ganhos.length / fechados.length * 100) : 0
  const retornoMedio = fechados.length > 0
    ? (fechados.reduce((s, op) => s + (op.resultado_pct ?? 0), 0) / fechados.length).toFixed(2)
    : '0.00'

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="backtest" />

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e8f5e9' }}>Backtesting</h1>
        <p style={{ color: '#5a7a60', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Resultado histórico de todas as sugestões geradas pelo sistema
        </p>
      </header>

      {/* Métricas resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Taxa de acerto', valor: `${taxaAcerto}%`, cor: taxaAcerto >= 60 ? '#00c44a' : taxaAcerto >= 40 ? '#ffdf00' : '#ff4466' },
          { label: 'Retorno médio', valor: `${Number(retornoMedio) > 0 ? '+' : ''}${retornoMedio}%`, cor: Number(retornoMedio) >= 0 ? '#00c44a' : '#ff4466' },
          { label: 'Operações', valor: String(historico.length), cor: '#e8f5e9' },
          { label: 'Ganhos', valor: String(ganhos.length), cor: '#00c44a' },
          { label: 'Perdas', valor: String(perdas.length), cor: '#ff4466' },
          { label: 'Em aberto', valor: String(abertos.length), cor: '#ffdf00' },
        ].map(c => (
          <div key={c.label} style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1rem' }}>
            <div style={{ color: '#5a7a60', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</div>
            <div style={{ color: c.cor, fontWeight: 800, fontSize: '1.5rem', marginTop: '0.3rem' }}>{c.valor}</div>
          </div>
        ))}
      </div>

      {/* Barra visual de acerto */}
      {fechados.length > 0 && (
        <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
            <span style={{ color: '#00c44a', fontWeight: 600 }}>Ganhos: {ganhos.length}</span>
            <span style={{ color: '#ff4466', fontWeight: 600 }}>Perdas: {perdas.length}</span>
          </div>
          <div style={{ height: 10, background: '#ff446640', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${taxaAcerto}%`, background: '#009c3b', borderRadius: 5, transition: 'width 0.5s' }} />
          </div>
          <div style={{ color: '#5a7a60', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
            {taxaAcerto}% de acerto em {fechados.length} operações encerradas
          </div>
        </div>
      )}

      {/* Operações em aberto */}
      {abertos.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '0.72rem', color: '#ffdf00', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Em aberto ({abertos.length})
            </h2>
            <div style={{ flex: 1, height: 1, background: '#1a2e1e' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {abertos.map((op, i) => {
              const parcial = op.resultado_pct_atual ?? null
              return (
                <div key={i} style={{ background: '#0d1a10', border: '1px solid #ffdf0030', borderLeft: '4px solid #ffdf00', borderRadius: 10, padding: '0.9rem 1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#e8f5e9', fontSize: '1rem' }}>{op.ticker}</span>
                      <span style={{ color: '#5a7a60', fontSize: '0.8rem', marginLeft: '0.75rem' }}>Entrada: R$ {op.preco_entrada} em {op.data_entrada}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                      <span style={{ color: '#ff4466' }}>Stop: R$ {op.stop}</span>
                      <span style={{ color: '#00c44a' }}>Alvo: R$ {op.alvo}</span>
                      {parcial !== null && (
                        <span style={{ color: corRes(parcial), fontWeight: 700 }}>
                          Agora: {parcial > 0 ? '+' : ''}{parcial}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Histórico de operações fechadas */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Operações encerradas
          </h2>
          <div style={{ flex: 1, height: 1, background: '#1a2e1e' }} />
        </div>

        {fechados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#5a7a60', border: '1px dashed #1a2e1e', borderRadius: 12 }}>
            Nenhuma operação encerrada ainda. O sistema registra automaticamente quando stop ou alvo é atingido.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[...fechados].sort((a, b) => (b.data_saida ?? '').localeCompare(a.data_saida ?? '')).map((op, i) => {
              const res = op.resultado_pct ?? 0
              const ganhou = res > 0
              return (
                <div key={i} style={{
                  background: '#0d1a10',
                  border: '1px solid #1a2e1e',
                  borderLeft: `4px solid ${ganhou ? '#009c3b' : '#ff4466'}`,
                  borderRadius: 10,
                  padding: '0.9rem 1.2rem',
                  display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#e8f5e9' }}>{op.ticker}</span>
                    <span style={{ color: '#5a7a60', fontSize: '0.78rem', marginLeft: '0.75rem' }}>
                      {op.data_entrada} → {op.data_saida}
                    </span>
                    <span style={{ color: '#5a7a60', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
                      ({op.motivo_saida === 'alvo' ? 'alvo atingido' : 'stop atingido'})
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', alignItems: 'center' }}>
                    <span style={{ color: '#5a7a60' }}>R$ {op.preco_entrada} → R$ {op.preco_saida}</span>
                    <span style={{ color: corRes(res), fontWeight: 800, fontSize: '1rem' }}>
                      {res > 0 ? '+' : ''}{res}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
