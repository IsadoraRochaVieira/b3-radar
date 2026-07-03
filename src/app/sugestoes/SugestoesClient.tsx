'use client'
import { useState } from 'react'
import TickerLink from '@/components/TickerLink'

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

const COR = {
  COMPRAR: { text: '#00a63c', bg: 'rgba(0,166,60,0.10)',   border: '#00a63c', label: 'Comprar' },
  OBSERVAR: { text: '#d4920a', bg: 'rgba(212,146,10,0.10)', border: '#d4920a', label: 'Observar' },
  EVITAR:   { text: '#e53555', bg: 'rgba(229,53,85,0.10)',  border: '#e53555', label: 'Evitar'   },
} as const

const SEM = {
  verde:    { dot: '#00a63c', label: 'Verde — Operar normal'     },
  amarelo:  { dot: '#d4920a', label: 'Amarelo — Reduzir tamanho' },
  vermelho: { dot: '#e53555', label: 'Vermelho — Só caixa'       },
} as const

function rr(entrada: string | null, stop: string | null, alvo: string | null) {
  if (!entrada || !stop || !alvo) return null
  const e = parseFloat(entrada), s = parseFloat(stop), a = parseFloat(alvo)
  if (e - s <= 0) return null
  return ((a - e) / (e - s)).toFixed(1)
}

function RsiBar({ val }: { val: number }) {
  const cor = val < 30 ? '#00a63c' : val > 70 ? '#e53555' : '#5b9bff'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ height: 3, background: '#1c2538', borderRadius: 2, width: '100%' }}>
        <div style={{ height: 3, width: `${Math.min(val, 100)}%`, background: cor, borderRadius: 2 }}/>
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: cor, fontWeight: 600 }}>{val}</span>
    </div>
  )
}

function ScoreBar({ val }: { val: number }) {
  const cor = val >= 60 ? '#00a63c' : val >= 40 ? '#d4920a' : '#e53555'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ height: 4, background: '#1c2538', borderRadius: 2, width: '100%' }}>
        <div style={{ height: 4, width: `${val}%`, background: cor, borderRadius: 2 }}/>
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: cor, fontWeight: 600 }}>{val}</span>
    </div>
  )
}

export default function SugestoesClient({ dias }: { dias: Dia[] }) {
  const [diaIdx, setDiaIdx] = useState(0)
  const [filtro, setFiltro] = useState<'TODOS' | 'COMPRAR' | 'OBSERVAR' | 'EVITAR'>('TODOS')
  const [expandido, setExpandido] = useState<string | null>(null)

  if (!dias.length) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 12 }}>
      Nenhuma sugestão. Rode o script para gerar.
    </div>
  )

  const dia = dias[diaIdx]
  const sem = SEM[dia.semaforo as keyof typeof SEM] ?? SEM.verde
  const lista = filtro === 'TODOS' ? dia.sugestoes : dia.sugestoes.filter(s => s.acao === filtro)

  const contagem = {
    COMPRAR: dia.sugestoes.filter(s => s.acao === 'COMPRAR').length,
    OBSERVAR: dia.sugestoes.filter(s => s.acao === 'OBSERVAR').length,
    EVITAR: dia.sugestoes.filter(s => s.acao === 'EVITAR').length,
  }

  return (
    <div>
      {/* Seletor de dia */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {dias.map((d, i) => (
          <button key={d.data_iso} onClick={() => { setDiaIdx(i); setExpandido(null); setFiltro('TODOS') }} style={{
            padding: '6px 12px', borderRadius: 8,
            border: `1px solid ${i === diaIdx ? 'rgba(91,155,255,0.35)' : 'var(--border)'}`,
            background: i === diaIdx ? 'rgba(16,82,204,0.15)' : 'var(--surface)',
            color: i === diaIdx ? 'var(--blue-light)' : 'var(--muted)',
            fontSize: 12, fontWeight: i === diaIdx ? 700 : 400, cursor: 'pointer',
          }}>
            <span style={{ display: 'block', fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{d.dia_semana.split('-')[0]}</span>
            {d.data}
          </button>
        ))}
      </div>

      {/* Header do dia */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
        padding: '14px 18px', marginBottom: 12,
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.55, margin: 0, flex: 1 }}>{dia.macro_resumo}</p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          background: `${sem.dot}12`, border: `1px solid ${sem.dot}40`,
          borderRadius: 8, padding: '6px 12px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: sem.dot }}/>
          <span style={{ fontSize: 12, color: sem.dot, fontWeight: 600 }}>{sem.label}</span>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setFiltro('TODOS')} style={{
          padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
          border: `1px solid ${filtro === 'TODOS' ? 'var(--border2)' : 'var(--border)'}`,
          background: filtro === 'TODOS' ? 'var(--surface2)' : 'transparent',
          color: filtro === 'TODOS' ? 'var(--text)' : 'var(--muted)',
          fontWeight: filtro === 'TODOS' ? 600 : 400,
        }}>Todas ({dia.sugestoes.length})</button>

        {(['COMPRAR', 'OBSERVAR', 'EVITAR'] as const).map(f => {
          const c = COR[f]
          const ativo = filtro === f
          return (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
              border: `1px solid ${ativo ? c.border + '50' : 'var(--border)'}`,
              background: ativo ? c.bg : 'transparent',
              color: ativo ? c.text : 'var(--muted)',
              fontWeight: ativo ? 600 : 400,
            }}>
              {f === 'COMPRAR' ? '● ' : f === 'OBSERVAR' ? '● ' : '● '}
              {f.charAt(0) + f.slice(1).toLowerCase()} ({contagem[f]})
            </button>
          )
        })}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)' }}>{lista.length} itens</span>
      </div>

      {/* Tabela */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        {/* Cabeçalho */}
        <div style={{
          display: 'grid', gridTemplateColumns: '32px 72px 82px 96px 96px 96px 56px 56px 28px',
          padding: '8px 14px', borderBottom: '1px solid var(--border)', gap: 8,
        }}>
          {['#', 'Ticker', 'Ação', 'Entrada', 'Stop', 'Alvo', 'RSI', 'Score', ''].map(h => (
            <span key={h} style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {lista.map((s) => {
          const c = COR[s.acao] ?? COR.OBSERVAR
          const ratio = rr(s.entrada, s.stop, s.alvo)
          const key = `${dia.data_iso}-${s.ticker}`
          const aberto = expandido === key

          return (
            <div key={key} style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Linha principal */}
              <button onClick={() => setExpandido(aberto ? null : key)} style={{
                width: '100%', background: aberto ? 'rgba(16,82,204,0.05)' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'grid', gridTemplateColumns: '32px 72px 82px 96px 96px 96px 56px 56px 28px',
                padding: '11px 14px', gap: 8, alignItems: 'center',
              }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', fontWeight: 500 }}>
                  {String(s.rank).padStart(2, '0')}
                </span>

                <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  <TickerLink ticker={s.ticker} style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700 }}/>
                </span>

                <span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: c.text,
                    background: c.bg, border: `1px solid ${c.border}40`,
                    borderRadius: 4, padding: '2px 7px',
                  }}>{c.label}</span>
                </span>

                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                  {s.entrada ? `R$ ${s.entrada}` : '—'}
                </span>

                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: s.stop ? 'var(--red)' : 'var(--muted)' }}>
                  {s.stop ? `R$ ${s.stop}` : '—'}
                </span>

                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: s.alvo ? 'var(--green)' : 'var(--muted)' }}>
                  {s.alvo ? `R$ ${s.alvo}` : '—'}
                </span>

                <RsiBar val={s.rsi} />
                <ScoreBar val={s.score} />

                <span style={{ fontSize: 11, color: 'var(--muted)', transform: aberto ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
              </button>

              {/* Expandido */}
              {aberto && (
                <div style={{ padding: '12px 14px 16px', borderTop: `1px solid ${c.border}20`, background: 'rgba(8,12,18,0.5)' }}>
                  <div style={{ fontSize: 10, color: c.text, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
                    Por que {s.acao.toLowerCase()} <TickerLink ticker={s.ticker} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}/>?
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.65, margin: 0, marginBottom: ratio ? 12 : 0 }}>{s.porque}</p>

                  {ratio && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                      {[
                        { l: 'R:R', v: `1:${ratio}`, c: parseFloat(ratio) >= 2 ? 'var(--green)' : 'var(--muted)' },
                        { l: 'Entrada', v: `R$ ${s.entrada}`, c: 'var(--text)' },
                        { l: 'Stop', v: `R$ ${s.stop}`, c: 'var(--red)' },
                        { l: 'Alvo', v: `R$ ${s.alvo}`, c: 'var(--green)' },
                      ].map(m => (
                        <div key={m.l} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 10px' }}>
                          <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{m.l}</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: m.c }}>{m.v}</div>
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

      <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: '1.5rem', textAlign: 'center', fontFamily: 'var(--mono)' }}>
        Clique no ticker para pesquisar no Google · Clique na linha para ver o motivo · Não é recomendação de investimento
      </p>
    </div>
  )
}
