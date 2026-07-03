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

const COR: Record<string, { text: string; bg: string; border: string; label: string; glow: string }> = {
  COMPRAR: { text: '#00c44a', bg: 'rgba(0,196,74,0.08)',  border: '#009c3b', label: '🟢 Comprar', glow: 'rgba(0,196,74,0.12)' },
  OBSERVAR: { text: '#f0b429', bg: 'rgba(240,180,41,0.08)', border: '#c49010', label: '🟡 Observar', glow: 'rgba(240,180,41,0.10)' },
  EVITAR:   { text: '#ff3355', bg: 'rgba(255,51,85,0.08)',  border: '#cc2244', label: '🔴 Evitar',   glow: 'rgba(255,51,85,0.10)' },
}

const SEM: Record<string, { dot: string; label: string; bg: string }> = {
  verde:    { dot: '#00c44a', bg: 'rgba(0,196,74,0.08)',   label: 'Semáforo Verde — Operar normal'     },
  amarelo:  { dot: '#f0b429', bg: 'rgba(240,180,41,0.08)', label: 'Semáforo Amarelo — Reduzir tamanho' },
  vermelho: { dot: '#ff3355', bg: 'rgba(255,51,85,0.08)',  label: 'Semáforo Vermelho — Só caixa'       },
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
    <div style={{ textAlign: 'center', padding: '4rem', color: '#4a6a52', border: '1px dashed #162b1a', borderRadius: 16 }}>
      Nenhuma sugestão ainda. Rode o script para gerar.
    </div>
  )

  const dia = dias[diaIdx]
  const sem = SEM[dia.semaforo] ?? SEM.verde
  const lista = filtro === 'TODOS' ? dia.sugestoes : dia.sugestoes.filter(s => s.acao === filtro)

  return (
    <div>
      {/* Seletor de dia */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {dias.map((d, i) => (
          <button key={d.data_iso} onClick={() => { setDiaIdx(i); setExpandido(null) }} style={{
            padding: '0.5rem 1rem',
            borderRadius: 10,
            border: '1px solid',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: i === diaIdx ? 800 : 400,
            background: i === diaIdx
              ? 'linear-gradient(135deg, rgba(0,156,59,0.25), rgba(0,196,74,0.08))'
              : 'rgba(12,24,16,0.6)',
            color: i === diaIdx ? '#e2f0e4' : '#4a6a52',
            borderColor: i === diaIdx ? 'rgba(0,196,74,0.4)' : '#162b1a',
            boxShadow: i === diaIdx ? '0 0 16px rgba(0,196,74,0.1)' : 'none',
            transition: 'all 0.15s',
          }}>
            <span style={{ display: 'block', fontSize: '0.62rem', opacity: 0.7, marginBottom: 2 }}>{d.dia_semana}</span>
            {d.data}
          </button>
        ))}
      </div>

      {/* Header do dia */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(12,24,16,0.9), rgba(8,15,10,0.95))',
        border: '1px solid #1e3a24',
        borderRadius: 14,
        padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem',
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.66rem', color: '#4a6a52', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, fontWeight: 600 }}>
            {dia.dia_semana} · {dia.data}
          </div>
          <p style={{ color: '#a8c8b0', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{dia.macro_resumo}</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
          background: sem.bg,
          border: `1px solid ${sem.dot}50`,
          borderRadius: 10,
          padding: '0.5rem 1rem',
          boxShadow: `0 0 20px ${sem.dot}15`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: sem.dot, boxShadow: `0 0 8px ${sem.dot}` }}/>
          <span style={{ color: sem.dot, fontSize: '0.74rem', fontWeight: 700 }}>{sem.label}</span>
        </div>
      </div>

      {/* Filtro rápido */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['TODOS', 'COMPRAR', 'OBSERVAR', 'EVITAR'] as const).map(f => {
          const c = f === 'TODOS'
            ? { text: '#e2f0e4', bg: 'rgba(30,58,36,0.5)', border: '#1e3a24' }
            : { text: COR[f].text, bg: COR[f].bg, border: COR[f].border }
          const ativo = filtro === f
          const qtd = f === 'TODOS' ? dia.sugestoes.length : dia.sugestoes.filter(s => s.acao === f).length
          return (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '0.38rem 0.9rem',
              borderRadius: 8,
              border: `1px solid ${ativo ? c.border : '#162b1a'}`,
              background: ativo ? c.bg : 'transparent',
              color: ativo ? c.text : '#4a6a52',
              fontSize: '0.77rem',
              fontWeight: ativo ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: ativo ? `0 0 12px ${c.bg}` : 'none',
            }}>
              {f === 'COMPRAR' ? '🟢 ' : f === 'OBSERVAR' ? '🟡 ' : f === 'EVITAR' ? '🔴 ' : ''}
              {f === 'TODOS' ? 'Todas' : f}
              <span style={{ opacity: 0.55, marginLeft: 4 }}>({qtd})</span>
            </button>
          )
        })}
        <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#4a6a52' }}>
          {lista.length} sugestão{lista.length !== 1 ? 'ões' : ''}
        </div>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {lista.map((s) => {
          const c = COR[s.acao] ?? COR.OBSERVAR
          const ratio = rr(s.entrada, s.stop, s.alvo)
          const key = `${dia.data_iso}-${s.ticker}`
          const aberto = expandido === key

          return (
            <div key={key} style={{
              background: aberto
                ? `linear-gradient(135deg, rgba(12,24,16,0.95), rgba(8,15,10,0.98))`
                : 'rgba(12,24,16,0.7)',
              border: `1px solid ${aberto ? c.border + '60' : '#1e3a24'}`,
              borderLeft: `3px solid ${c.border}`,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: aberto ? `0 4px 24px ${c.glow}` : '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s',
            }}>
              {/* Linha principal */}
              <button onClick={() => setExpandido(aberto ? null : key)} style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left',
              }}>
                {/* Rank */}
                <span style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: aberto ? c.bg : 'rgba(8,15,10,0.8)',
                  border: `1px solid ${aberto ? c.border + '50' : '#1e3a24'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', color: aberto ? c.text : '#4a6a52', fontWeight: 800, flexShrink: 0,
                }}>
                  {s.rank}
                </span>

                {/* Ticker com link */}
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#e2f0e4', minWidth: 60 }}>
                  <TickerLink ticker={s.ticker} style={{ fontSize: '1.05rem', fontWeight: 900 }} />
                </span>

                {/* Badge ação */}
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, color: c.text,
                  background: c.bg, border: `1px solid ${c.border}40`,
                  borderRadius: 6, padding: '2px 9px', flexShrink: 0,
                }}>
                  {c.label}
                </span>

                {/* Métricas inline */}
                <div style={{ display: 'flex', gap: '0.7rem', flex: 1, flexWrap: 'wrap' }}>
                  {s.entrada && (
                    <span style={{ fontSize: '0.77rem', color: '#4a6a52' }}>
                      Entrada <strong style={{ color: '#e2f0e4' }}>R$ {s.entrada}</strong>
                    </span>
                  )}
                  {s.stop && (
                    <span style={{ fontSize: '0.77rem', color: '#4a6a52' }}>
                      Stop <strong style={{ color: '#ff3355' }}>R$ {s.stop}</strong>
                    </span>
                  )}
                  {s.alvo && (
                    <span style={{ fontSize: '0.77rem', color: '#4a6a52' }}>
                      Alvo <strong style={{ color: '#00c44a' }}>R$ {s.alvo}</strong>
                    </span>
                  )}
                  {ratio && (
                    <span style={{
                      fontSize: '0.73rem',
                      color: parseFloat(ratio) >= 2 ? '#00c44a' : '#4a6a52',
                      fontWeight: 700,
                      background: parseFloat(ratio) >= 2 ? 'rgba(0,196,74,0.08)' : 'transparent',
                      border: parseFloat(ratio) >= 2 ? '1px solid rgba(0,196,74,0.2)' : 'none',
                      borderRadius: 5, padding: parseFloat(ratio) >= 2 ? '1px 6px' : 0,
                    }}>
                      R:R 1:{ratio}
                    </span>
                  )}
                </div>

                {/* RSI + score + seta */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    color: s.rsi < 30 ? '#00c44a' : s.rsi > 70 ? '#ff3355' : '#4a6a52',
                    fontWeight: s.rsi < 30 || s.rsi > 70 ? 700 : 400,
                  }}>
                    RSI {s.rsi}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: s.score >= 60 ? '#00c44a' : s.score >= 40 ? '#f0b429' : '#4a6a52',
                    fontWeight: 700,
                    background: s.score >= 60 ? 'rgba(0,196,74,0.1)' : s.score >= 40 ? 'rgba(240,180,41,0.1)' : 'transparent',
                    border: s.score >= 60 ? '1px solid rgba(0,196,74,0.2)' : s.score >= 40 ? '1px solid rgba(240,180,41,0.2)' : 'none',
                    borderRadius: 5, padding: '1px 6px',
                  }}>
                    {s.score}pts
                  </span>
                  <span style={{
                    fontSize: '0.65rem', color: '#4a6a52',
                    transition: 'transform 0.2s',
                    transform: aberto ? 'rotate(180deg)' : 'none',
                    display: 'inline-block',
                  }}>▼</span>
                </div>
              </button>

              {/* Expandido */}
              {aberto && (
                <div style={{ padding: '0 1.2rem 1.2rem', borderTop: `1px solid ${c.border}25`, paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.63rem', color: c.text, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 }}>
                    Por que {s.acao.toLowerCase()} <TickerLink ticker={s.ticker} style={{ fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }} />?
                  </div>
                  <p style={{ color: '#a8c8b0', fontSize: '0.87rem', lineHeight: 1.7, margin: 0 }}>{s.porque}</p>

                  {s.entrada && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
                      {[
                        { l: 'Entrada', v: `R$ ${s.entrada}`, col: '#e2f0e4' },
                        { l: 'Stop',    v: s.stop ? `R$ ${s.stop}` : '—', col: '#ff3355' },
                        { l: 'Alvo',    v: s.alvo ? `R$ ${s.alvo}` : '—', col: '#00c44a' },
                        { l: 'RSI',     v: String(s.rsi), col: s.rsi < 30 ? '#00c44a' : s.rsi > 70 ? '#ff3355' : '#e2f0e4' },
                        { l: 'Score',   v: `${s.score}/100`, col: s.score >= 60 ? '#00c44a' : '#f0b429' },
                        { l: 'R:R',     v: ratio ? `1:${ratio}` : '—', col: ratio && parseFloat(ratio) >= 2 ? '#00c44a' : '#4a6a52' },
                      ].map(m => (
                        <div key={m.l} style={{
                          background: 'rgba(8,15,10,0.8)',
                          border: '1px solid #162b1a',
                          borderRadius: 9,
                          padding: '0.5rem 0.7rem',
                        }}>
                          <div style={{ fontSize: '0.6rem', color: '#4a6a52', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{m.l}</div>
                          <div style={{ color: m.col, fontWeight: 800, fontSize: '0.9rem' }}>{m.v}</div>
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

      <p style={{ color: '#2e4a34', fontSize: '0.7rem', marginTop: '2rem', textAlign: 'center' }}>
        Clique no ticker para pesquisar no Google · Clique na linha para ver o motivo · Não é recomendação de investimento
      </p>
    </div>
  )
}
