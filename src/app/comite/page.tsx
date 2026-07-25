import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav'
import ComiteClient, { type Comite } from './ComiteClient'

function getRankingDoDia(): Map<string, number> {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return new Map()
  const arquivo = fs.readdirSync(dir)
    .filter(f => f.startsWith('sugestoes_') && f.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a))[0]
  if (!arquivo) return new Map()
  const dados = JSON.parse(fs.readFileSync(path.join(dir, arquivo), 'utf-8'))
  return new Map((dados.sugestoes ?? []).map((s: { ticker: string; rank: number }) => [s.ticker, s.rank]))
}

function getComites(): Comite[] {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return []
  const ranking = getRankingDoDia()
  return fs.readdirSync(dir)
    .filter(f => f.startsWith('comite_') && f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Comite)
    .sort((a, b) => {
      const rankA = ranking.get(a.ticker) ?? 999
      const rankB = ranking.get(b.ticker) ?? 999
      return rankA - rankB || String(b.data).localeCompare(String(a.data))
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFundamentos(): Record<string, any> {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = {}
  for (const f of fs.readdirSync(dir).filter(f => f.startsWith('fundamentos_') && f.endsWith('.json'))) {
    const tk = f.replace('fundamentos_', '').replace('.json', '')
    out[tk] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'))
  }
  return out
}

export default function ComitePage() {
  const comites = getComites()
  const fundamentos = getFundamentos()

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="comite" />

      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.16em', fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
          O Comitê de Inteligência
        </div>
        <h1 className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginTop: 6 }}>A Mesa</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 6, maxWidth: 620, lineHeight: 1.6 }}>
          A seleção diária coloca as ações mais relevantes na cabeceira. Sete analistas confrontam
          fundamentos, técnica e risco antes de construir um veredito verificável.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--gold-bright)', background: 'var(--gold-bg)', border: '1px solid rgba(212,146,10,.3)', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontFamily: 'var(--mono)' }}>MESA DO DIA</span>
          <span style={{ color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 999, padding: '4px 10px', fontSize: 10 }}>{comites.length} teses disponíveis</span>
        </div>
      </header>

      {comites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 12 }}>
          Nenhum debate gerado ainda. Rode <span style={{ fontFamily: 'var(--mono)' }}>comite_ia.py</span>.
        </div>
      ) : (
        <ComiteClient comites={comites} fundamentos={fundamentos} />
      )}
    </main>
  )
}
