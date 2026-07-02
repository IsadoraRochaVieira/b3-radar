import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav'

function getUltimo() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'backtest_historico.json').sort((a, b) => b.localeCompare(a))
  if (!files.length) return null
  return JSON.parse(fs.readFileSync(path.join(dir, files[0]), 'utf-8'))
}

const riscoCor: Record<string, { bg: string; border: string; text: string }> = {
  alto:   { bg: '#ff446618', border: '#cc2244', text: '#ff4466' },
  medio:  { bg: '#ffdf0018', border: '#d4a017', text: '#ffdf00' },
  baixo:  { bg: '#00c44a18', border: '#009c3b', text: '#00c44a' },
}

const REGIOES = [
  {
    nome: 'Oriente Médio',
    risco: 'alto',
    evento: 'Negociações EUA-Irã em Doha — Brent volátil',
    setores: ['Petróleo (PETR3, PETR4, PRIO3)', 'Energia elétrica (termelétricas)'],
    impacto: 'Acordo de paz → Brent cai → petrolíferas caem no curto prazo. Sem acordo → Brent sobe.',
    emoji: '🛢️',
    x: '62%', y: '35%',
  },
  {
    nome: 'China',
    risco: 'medio',
    evento: 'Plano quinquenal 2026–30 reduz importações estratégicas',
    setores: ['Agro (AGRO3, SLCE3, SMTO3)', 'Mineração (VALE3)'],
    impacto: 'China comprando +38% do Brasil em commodities — mas 15º Plano Quinquenal quer reduzir dependência externa.',
    emoji: '🌾',
    x: '76%', y: '38%',
  },
  {
    nome: 'Estados Unidos',
    risco: 'medio',
    evento: 'Tarifas Trump afetam exportações brasileiras',
    setores: ['Agro exportador', 'Siderurgia'],
    impacto: 'Tarifas americanas ao Brasil desviaram comércio para China — efeito líquido positivo no agro, mas incerteza permanece.',
    emoji: '🏛️',
    x: '22%', y: '32%',
  },
  {
    nome: 'Brasil · Brasília',
    risco: 'medio',
    evento: 'COPOM, IPCA e agenda fiscal do governo',
    setores: ['Bancos (ITUB4, BBAS3)', 'Varejo (MGLU3)', 'Imobiliário'],
    impacto: 'Selic a 14,25% com cortes graduais previstos. Fiscal ainda pressionando câmbio e expectativas.',
    emoji: '🟢',
    x: '30%', y: '58%',
  },
  {
    nome: 'Rússia / Europa',
    risco: 'baixo',
    evento: 'Economia russa em mínima histórica — guerra em impasse',
    setores: ['Fertilizantes (agro BR)', 'Grãos'],
    impacto: 'Rússia enfraquecida reduz concorrência em fertilizantes e grãos — beneficia exportadores brasileiros.',
    emoji: '❄️',
    x: '54%', y: '22%',
  },
]

const EVENTOS_SEMANA = [
  { dia: 'Seg', titulo: 'PMI Industrial China', impacto: 'VALE3, AGRO3', nivel: 'medio' },
  { dia: 'Ter', titulo: 'CPI EUA (inflação)', impacto: 'Dólar, todos os ativos', nivel: 'alto' },
  { dia: 'Qua', titulo: 'Reunião OPEP+', impacto: 'PETR3, PETR4, PRIO3', nivel: 'alto' },
  { dia: 'Qui', titulo: 'Payroll EUA', impacto: 'Câmbio, Ibovespa', nivel: 'medio' },
  { dia: 'Sex', titulo: 'IPCA Brasil (prévia)', impacto: 'Bancos, varejo', nivel: 'medio' },
]

export default function GeopoliticaPage() {
  const r = getUltimo()

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="geopolitica" />

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e8f5e9' }}>Radar Geopolítico</h1>
        <p style={{ color: '#5a7a60', fontSize: '0.85rem', marginTop: '0.25rem' }}>Riscos globais mapeados pelos setores da B3</p>
      </header>

      {/* Mapa SVG simplificado */}
      <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
          Mapa de risco global
        </div>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '45%', background: '#071510', borderRadius: 10, border: '1px solid #1a2e1e', overflow: 'hidden' }}>
          {/* Silhueta simplificada dos continentes como fundo */}
          <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
            {/* América do Sul */}
            <ellipse cx="28" cy="55" rx="8" ry="12" fill="#009c3b"/>
            {/* América do Norte */}
            <ellipse cx="22" cy="28" rx="10" ry="10" fill="#009c3b"/>
            {/* Europa */}
            <ellipse cx="50" cy="22" rx="6" ry="6" fill="#009c3b"/>
            {/* África */}
            <ellipse cx="50" cy="40" rx="7" ry="10" fill="#009c3b"/>
            {/* Ásia */}
            <ellipse cx="72" cy="28" rx="16" ry="10" fill="#009c3b"/>
            {/* Oceania */}
            <ellipse cx="82" cy="48" rx="6" ry="4" fill="#009c3b"/>
          </svg>

          {/* Pontos de risco */}
          {REGIOES.map((reg) => {
            const c = riscoCor[reg.risco]
            return (
              <div key={reg.nome} style={{ position: 'absolute', left: reg.x, top: reg.y, transform: 'translate(-50%, -50%)' }}>
                <div title={`${reg.nome}: ${reg.evento}`} style={{
                  width: reg.risco === 'alto' ? 20 : 15,
                  height: reg.risco === 'alto' ? 20 : 15,
                  borderRadius: '50%',
                  background: c.bg,
                  border: `2px solid ${c.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: reg.risco === 'alto' ? 11 : 9,
                  cursor: 'default',
                }}>
                  {reg.emoji}
                </div>
                <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: c.text, whiteSpace: 'nowrap', fontWeight: 600 }}>
                  {reg.nome.split(' ')[0]}
                </div>
              </div>
            )
          })}

          {/* Legenda */}
          <div style={{ position: 'absolute', bottom: 8, right: 10, display: 'flex', gap: 10, fontSize: 10 }}>
            {(['alto', 'medio', 'baixo'] as const).map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4, color: riscoCor[n].text }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${riscoCor[n].border}`, background: riscoCor[n].bg }}/>
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards de regiões */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {REGIOES.map(reg => {
          const c = riscoCor[reg.risco]
          return (
            <div key={reg.nome} style={{ background: '#0d1a10', border: `1px solid #1a2e1e`, borderLeft: `4px solid ${c.border}`, borderRadius: 10, padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 6 }}>
                <span style={{ fontSize: '1.2rem' }}>{reg.emoji}</span>
                <span style={{ fontWeight: 700, color: '#e8f5e9', fontSize: '0.95rem' }}>{reg.nome}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}40`, borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase' }}>
                  {reg.risco}
                </span>
              </div>
              <p style={{ color: '#a0c8a8', fontSize: '0.82rem', marginBottom: 8 }}>{reg.evento}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {reg.setores.map(s => (
                  <span key={s} style={{ fontSize: '0.72rem', background: '#ffffff10', borderRadius: 4, padding: '2px 6px', color: '#5a7a60' }}>{s}</span>
                ))}
              </div>
              <p style={{ color: '#5a7a60', fontSize: '0.78rem', lineHeight: 1.5, borderTop: '1px solid #1a2e1e', paddingTop: 8 }}>{reg.impacto}</p>
            </div>
          )
        })}
      </div>

      {/* Radar de eventos da semana */}
      <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.25rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.9rem' }}>
          <i className="ti ti-radar" style={{ fontSize: 13, marginRight: 6 }} aria-hidden="true"/>
          Eventos que movem o mercado esta semana
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {EVENTOS_SEMANA.map((ev, i) => {
            const c = riscoCor[ev.nivel]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', background: '#ffffff05', border: '1px solid #1a2e1e', borderRadius: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}40`, borderRadius: 5, padding: '3px 8px', minWidth: 32, textAlign: 'center' }}>
                  {ev.dia}
                </span>
                <span style={{ fontWeight: 600, color: '#e8f5e9', fontSize: '0.88rem', flex: 1 }}>{ev.titulo}</span>
                <span style={{ fontSize: '0.75rem', color: '#5a7a60' }}>afeta: <strong style={{ color: '#a0c8a8' }}>{ev.impacto}</strong></span>
              </div>
            )
          })}
        </div>
        <p style={{ color: '#5a7a60', fontSize: '0.75rem', marginTop: '0.9rem', borderTop: '1px solid #1a2e1e', paddingTop: '0.75rem' }}>
          Eventos marcados como alto risco — evitar entrar em posições novas nas 2h antes do evento.
        </p>
      </div>
    </main>
  )
}
