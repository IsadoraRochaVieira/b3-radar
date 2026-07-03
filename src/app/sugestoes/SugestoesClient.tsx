'use client'
import { useState } from 'react'

type Sugestao = {
  rank: number
  ticker: string
  acao: 'COMPRAR' | 'OBSERVAR' | 'EVITAR'
  preco: string
  entrada: string | null
  stop: string | null
  alvo: string | null
  rsi: number
  score: number
  porque: string
}

type Dia = {
  data: string
  data_iso: string
  dia_semana: string
  macro_resumo: string
  semaforo: string
  sugestoes: Sugestao[]
}

const COR: Record<string, { text: string; bg: string; border: string; label: string }> = {
  COMPRAR: { text: '#00c44a', bg: '#009c3b18', border: '#009c3b', label: '🟢 Comprar' },
  OBSERVAR: { text: '#ffdf00', bg: '#ffdf0018', border: '#d4a017', label: '🟡 Observar' },
  EVITAR:   { text: '#ff4466', bg: '#ff446618', border: '#cc2244', label: '🔴 Evitar'   },
}

const SEM: Record<string, { dot: string; label: string }> = {
  verde:    { dot: '#009c3b', label: 'Semáforo Verde — Operar normal'     },
  amarelo:  { dot: '#d4a017', label: 'Semáforo Amarelo — Reduzir tamanho' },
  vermelho: { dot: '#cc2244', label: 'Semáforo Vermelho — Só caixa'       },
}

function rr(entrada: string | null, stop: string | null, alvo: string | null) {
  if (!entrada || !stop || !alvo) return null
  const e = parseFloat(entrada), s = parseFloat(stop), a = parseFloat(alvo)
  if (e - s <= 0) return null
  return ((a - e) / (e - s)).toFixed(1)
}

export default function SugestoesClient({ dias }: { dias: Dia[] }) {
  const [diaIdx, setDiaIdx] = useState(0)
  const [filtro, setFiltro] = useState<'TODOS' | 'COMPRAR' | 'OBSERVAR' | 'EVITAR'>('TODOS')
  const [expandido, setExpandido] = useState<string | null>(null)

  if (!dias.length) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#5a7a60', border: '1px dashed #1a2e1e', borderRadius: 12 }}>
      Nenhuma sugestão ainda. Rode o script para gerar.
    </div>
  )

  const dia = dias[diaIdx]
  const sem = SEM[dia.semaforo] ?? SEM.verde
  const lista = filtro === 'TODOS' ? dia.sugestoes : dia.sugestoes.filter(s => s.acao === filtro)

  return (
    <div>
      {/* Seletor de dia */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {dias.map((d, i) => (
          <button key={d.data_iso} onClick={() => { setDiaIdx(i); setExpandido(null) }} style={{
            padding: '0.45rem 0.9rem', borderRadius: 8, border: '1px solid', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: i === diaIdx ? 700 : 400,
            background: i === diaIdx ? '#009c3b' : '#0d1a10',
            color: i === diaIdx ? '#fff' : '#5a7a60',
            borderColor: i === diaIdx ? '#009c3b' : '#1a2e1e',
          }}>
            <span style={{ display: 'block', fontSize: '0.65rem', opacity: 0.8 }}>{d.dia_semana}</span>
            {d.data}
          </button>
        ))}
      </div>

      {/* Header do dia */}
      <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.1rem 1.4rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.68rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            {dia.dia_semana} · {dia.data}
          </div>
          <p style={{ color: '#a0c8a8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{dia.macro_resumo}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, background: `${sem.dot}18`, border: `1px solid ${sem.dot}60`, borderRadius: 8, padding: '0.4rem 0.8rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: sem.dot, boxShadow: `0 0 6px ${sem.dot}` }}/>
          <span style={{ color: sem.dot, fontSize: '0.75rem', fontWeight: 700 }}>{sem.label}</span>
        </div>
      </div>

      {/* Filtro rápido */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['TODOS', 'COMPRAR', 'OBSERVAR', 'EVITAR'] as const).map(f => {
          const c = f === 'TODOS' ? { text: '#e8f5e9', bg: '#1a2e1e', border: '#1a2e1e' } : { text: COR[f].text, bg: COR[f].bg, border: COR[f].border }
          const ativo = filtro === f
          const qtd = f === 'TODOS' ? dia.sugestoes.length : dia.sugestoes.filter(s => s.acao === f).length
          return (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '0.35rem 0.85rem', borderRadius: 7, border: `1px solid ${ativo ? c.border : '#1a2e1e'}`,
              background: ativo ? c.bg : 'transparent', color: ativo ? c.text : '#5a7a60',
              fontSize: '0.78rem', fontWeight: ativo ? 700 : 400, cursor: 'pointer',
            }}>
              {f === 'COMPRAR' ? '🟢' : f === 'OBSERVAR' ? '🟡' : f === 'EVITAR' ? '🔴' : ''} {f === 'TODOS' ? 'Todas' : f} <span style={{ opacity: 0.6 }}>({qtd})</span>
            </button>
          )
        })}
        <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#5a7a60', display: 'flex', alignItems: 'center' }}>
          {lista.length} sugestão{lista.length !== 1 ? 'ões' : ''}
        </div>
      </div>

      {/* Lista de sugestões */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {lista.map((s) => {
          const c = COR[s.acao] ?? COR.OBSERVAR
          const ratio = rr(s.entrada, s.stop, s.alvo)
          const key = `${dia.data_iso}-${s.ticker}`
          const aberto = expandido === key

          return (
            <div key={key} style={{ background: '#0d1a10', border: `1px solid #1a2e1e`, borderLeft: `3px solid ${c.border}`, borderRadius: 11, overflow: 'hidden' }}>
              {/* Linha principal — clicável */}
              <button onClick={() => setExpandido(aberto ? null : key)} style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
              }}>
                {/* Rank */}
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#07100a', border: '1px solid #1a2e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#5a7a60', fontWeight: 700, flexShrink: 0 }}>
                  {s.rank}
                </span>

                {/* Ticker + ação */}
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#e8f5e9', minWidth: 60 }}>{s.ticker}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}40`, borderRadius: 5, padding: '2px 8px' }}>
                  {c.label}
                </span>

                {/* Métricas inline */}
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
                  {s.entrada && (
                    <span style={{ fontSize: '0.78rem', color: '#5a7a60' }}>
                      Entrada <strong style={{ color: '#e8f5e9' }}>R$ {s.entrada}</strong>
                    </span>
                  )}
                  {s.stop && (
                    <span style={{ fontSize: '0.78rem', color: '#5a7a60' }}>
                      Stop <strong style={{ color: '#ff4466' }}>R$ {s.stop}</strong>
                    </span>
                  )}
                  {s.alvo && (
                    <span style={{ fontSize: '0.78rem', color: '#5a7a60' }}>
                      Alvo <strong style={{ color: '#00c44a' }}>R$ {s.alvo}</strong>
                    </span>
                  )}
                  {ratio && (
                    <span style={{ fontSize: '0.75rem', color: parseFloat(ratio) >= 2 ? '#00c44a' : '#5a7a60', fontWeight: 700 }}>
                      R:R 1:{ratio}
                    </span>
                  )}
                </div>

                {/* RSI + score */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: s.rsi < 30 ? '#00c44a' : s.rsi > 70 ? '#ff4466' : '#5a7a60' }}>
                    RSI {s.rsi}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: s.score >= 60 ? '#00c44a' : s.score >= 40 ? '#ffdf00' : '#5a7a60', fontWeight: 700 }}>
                    {s.score}pts
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#1a2e1e', transition: 'transform 0.2s', transform: aberto ? 'rotate(180deg)' : 'none', color: '#5a7a60' }}>▼</span>
                </div>
              </button>

              {/* Expandido: o "porque" */}
              {aberto && (
                <div style={{ padding: '0 1.1rem 1rem', borderTop: '1px solid #1a2e1e', paddingTop: '0.9rem', marginTop: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: c.text, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>
                    Por que {s.acao.toLowerCase()} {s.ticker}?
                  </div>
                  <p style={{ color: '#a0c8a8', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{s.porque}</p>

                  {s.entrada && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '0.9rem' }}>
                      {[
                        { l: 'Entrada', v: `R$ ${s.entrada}`, c: '#e8f5e9' },
                        { l: 'Stop',    v: s.stop ? `R$ ${s.stop}` : '—', c: '#ff4466' },
                        { l: 'Alvo',    v: s.alvo ? `R$ ${s.alvo}` : '—', c: '#00c44a' },
                        { l: 'RSI',     v: String(s.rsi), c: s.rsi < 30 ? '#00c44a' : s.rsi > 70 ? '#ff4466' : '#e8f5e9' },
                        { l: 'Score',   v: `${s.score}/100`, c: s.score >= 60 ? '#00c44a' : '#ffdf00' },
                        { l: 'R:R',     v: ratio ? `1:${ratio}` : '—', c: ratio && parseFloat(ratio) >= 2 ? '#00c44a' : '#5a7a60' },
                      ].map(m => (
                        <div key={m.l} style={{ background: '#07100a', borderRadius: 7, padding: '0.45rem 0.6rem' }}>
                          <div style={{ fontSize: '0.62rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.l}</div>
                          <div style={{ color: m.c, fontWeight: 700, fontSize: '0.88rem', marginTop: 2 }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ color: '#5a7a60', fontSize: '0.72rem', marginTop: '1.5rem', textAlign: 'center' }}>
        Clique em qualquer sugestão para ver o motivo completo · Não é recomendação de investimento
      </p>
    </div>
  )
}
