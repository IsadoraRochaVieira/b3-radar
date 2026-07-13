import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav'
import TickerLink from '@/components/TickerLink'

type Analista = {
  id: string; nome: string; emoji: string
  postura: 'COMPRAR' | 'OBSERVAR' | 'EVITAR' | 'ABSTENHO'
  resumo: string; argumentos: string[]; riscos: string[]
}
type Comite = {
  ticker: string; empresa: string; setor: string; preco: number; data: string
  dossie: Record<string, string | number>
  analistas: Analista[]
  sintese: {
    veredito: 'COMPRAR' | 'OBSERVAR' | 'EVITAR'
    placar: Record<string, number>
    texto: string; gatilho: string
    entrada_ref: string | null; stop_ref: string | null; alvo_ref: string | null
  }
}

function getComites(): Comite[] {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.startsWith('comite_') && f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Comite)
}

const POST = {
  COMPRAR:   { cor: '#00a63c', bg: 'rgba(0,166,60,0.12)',   label: 'Comprar' },
  OBSERVAR:  { cor: '#d4920a', bg: 'rgba(212,146,10,0.12)', label: 'Observar' },
  EVITAR:    { cor: '#e53555', bg: 'rgba(229,53,85,0.12)',  label: 'Evitar' },
  ABSTENHO:  { cor: '#8a9bbf', bg: 'rgba(138,155,191,0.10)', label: 'Abstém-se' },
} as const

const DOSSIE_LABELS: Record<string, string> = {
  rsi: 'RSI', macd_hist: 'MACD', bb_pct: 'Bollinger %B', vol_ratio: 'Volume',
  atr_pct: 'ATR', dist_max52: 'Da máx. 52s', pl: 'P/L', pvp: 'P/VP', roe: 'ROE',
  var_20d: 'Var 20d', score: 'Score',
}

export default function ComitePage() {
  const comites = getComites()
  const c = comites[0] ?? null

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="comite" />

      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.16em', fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
          O Comitê de Inteligência
        </div>
        <h1 className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginTop: 6 }}>A Mesa</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 6, maxWidth: 620, lineHeight: 1.6 }}>
          Sete analistas especialistas debatem uma ação pela sua lente. Você lê os argumentos de
          defesa e de ataque antes de decidir — e um veredito único concilia a mesa.
        </p>
      </header>

      {!c ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 12 }}>
          Nenhum debate gerado ainda. Rode <span style={{ fontFamily: 'var(--mono)' }}>comite_ia.py</span>.
        </div>
      ) : (
        <ComiteView c={c} />
      )}
    </main>
  )
}

function ComiteView({ c }: { c: Comite }) {
  const v = POST[c.sintese.veredito]
  return (
    <>
      {/* ── Cabeçalho da ação ── */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '1.4rem 1.6rem', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--text)' }}>
            <TickerLink ticker={c.ticker} style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 800 }} />
          </div>
          <div style={{ color: 'var(--text2)', fontSize: 14, marginTop: 2 }}>{c.empresa}</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{c.setor}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>R$ {Number(c.preco).toFixed(2)}</div>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>fechamento · {c.data}</div>
        </div>
      </div>

      {/* ── Dossiê (o que a mesa viu) ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
        {Object.entries(DOSSIE_LABELS).map(([k, label]) => {
          const val = c.dossie[k]
          if (val === undefined) return null
          return (
            <div key={k} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 11px' }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label} </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{String(val)}</span>
            </div>
          )
        })}
      </div>

      {/* ── VEREDITO (Sumário Executivo do Debate) ── */}
      <div style={{
        background: `linear-gradient(135deg, ${v.bg}, transparent)`,
        border: `1px solid ${v.cor}40`, borderLeft: `4px solid ${v.cor}`,
        borderRadius: 14, padding: '1.6rem', marginBottom: 26,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase' }}>
            Sumário executivo do debate
          </span>
          <span style={{ marginLeft: 'auto', background: v.bg, color: v.cor, border: `1px solid ${v.cor}60`, borderRadius: 8, padding: '5px 14px', fontWeight: 800, fontSize: 15 }}>
            Veredito: {v.label}
          </span>
        </div>

        {/* placar */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { k: 'comprar', c: '#00a63c', l: 'compram' },
            { k: 'observar', c: '#d4920a', l: 'observam' },
            { k: 'evitar', c: '#e53555', l: 'evitam' },
            { k: 'abstencao', c: '#8a9bbf', l: 'abstêm-se' },
          ].map(p => {
            const n = c.sintese.placar[p.k] ?? 0
            if (!n) return null
            return (
              <div key={p.k} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 11px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 800, color: p.c }}>{n}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{p.l}</span>
              </div>
            )
          })}
        </div>

        <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{c.sintese.texto}</p>

        {/* gatilho + níveis */}
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>
            Gatilho para reavaliar
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{c.sintese.gatilho}</p>
          {(c.sintese.entrada_ref || c.sintese.stop_ref || c.sintese.alvo_ref) && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {[
                { l: 'Entrada', v: c.sintese.entrada_ref, cor: 'var(--text)' },
                { l: 'Stop', v: c.sintese.stop_ref, cor: 'var(--red)' },
                { l: 'Alvo', v: c.sintese.alvo_ref, cor: 'var(--green)' },
              ].filter(x => x.v).map(x => (
                <div key={x.l} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{x.l}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12.5, fontWeight: 700, color: x.cor, marginTop: 2 }}>{x.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── OS SETE ANALISTAS ── */}
      <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
        Os argumentos da mesa
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {c.analistas.map(a => {
          const p = POST[a.postura] ?? POST.OBSERVAR
          return (
            <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${p.cor}`, borderRadius: 12, padding: '1.1rem 1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{a.nome}</div>
                </div>
                <span style={{ background: p.bg, color: p.cor, border: `1px solid ${p.cor}50`, borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>{p.label}</span>
              </div>
              <p style={{ color: 'var(--text)', fontSize: 13.5, lineHeight: 1.55, margin: '0 0 12px', fontStyle: 'italic' }}>“{a.resumo}”</p>

              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {a.argumentos.map((arg, i) => (
                  <li key={i} style={{ display: 'flex', gap: 7, color: 'var(--text2)', fontSize: 12.5, lineHeight: 1.5 }}>
                    <span style={{ color: p.cor, flexShrink: 0 }}>▸</span>{arg}
                  </li>
                ))}
              </ul>

              {a.riscos.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 9, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 5 }}>Espinhos</div>
                  {a.riscos.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, color: 'var(--muted)', fontSize: 12, lineHeight: 1.5, marginBottom: 3 }}>
                      <span style={{ color: 'var(--red)', flexShrink: 0 }}>△</span>{r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 28, textAlign: 'center', fontFamily: 'var(--mono)' }}>
        Debate gerado pelo Comitê de IA do Caryo Map · Não é recomendação de investimento
      </p>
    </>
  )
}
