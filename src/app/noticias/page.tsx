import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav'

function getNoticias() {
  const dir = path.join(process.cwd(), 'relatorios')
  if (!fs.existsSync(dir)) return null
  // Pega o arquivo de notícias mais recente
  const arquivos = fs.readdirSync(dir)
    .filter(f => f.startsWith('noticias_') && f.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a))
  if (!arquivos.length) return null
  return JSON.parse(fs.readFileSync(path.join(dir, arquivos[0]), 'utf-8'))
}

// Agenda estática — atualizada manualmente ou via script
const AGENDA_SEMANA = [
  { dia: 'Seg', data: '07/07', evento: 'PMI Serviços China', hora: '02:45', impacto: 'VALE3, exportadores', nivel: 'medio' },
  { dia: 'Ter', data: '08/07', evento: 'IPCA prévia IBGE', hora: '09:00', impacto: 'Selic, varejo, bancos', nivel: 'alto' },
  { dia: 'Qua', data: '09/07', evento: 'Ata do COPOM', hora: '08:30', impacto: 'Renda fixa, câmbio, todos', nivel: 'alto' },
  { dia: 'Qui', data: '10/07', evento: 'Resultado fiscal do governo', hora: '15:00', impacto: 'Câmbio, CDS Brasil', nivel: 'alto' },
  { dia: 'Sex', data: '11/07', evento: 'Produção industrial IBGE', hora: '09:00', impacto: 'Varejo, consumo, crédito', nivel: 'medio' },
]

const corNivel: Record<string, { bg: string; border: string; text: string }> = {
  alto:  { bg: '#ff446618', border: '#cc2244', text: '#ff4466' },
  medio: { bg: '#ffdf0018', border: '#d4a017', text: '#ffdf00' },
  baixo: { bg: '#00c44a18', border: '#009c3b', text: '#00c44a' },
}

// Fallback quando não há RSS ainda
const NOTICIAS_FIXAS = [
  { categoria: 'Política Econômica', cor: '#4488ff', emoji: '🏦', titulo: 'COPOM mantém Selic em 14,25%', descricao: 'Banco Central mantém taxa básica. Mercado precifica cortes apenas para 2027.', setores: ['ITUB4 ↑', 'BBDC4 ↑', 'MGLU3 ↓'], urgencia: 'alta', fonte: 'Banco Central' },
  { categoria: 'Fiscal', cor: '#ff4466', emoji: '📊', titulo: 'Déficit primário R$ 68bi no semestre — acima da meta', descricao: 'Gastos sociais e precatórios pressionam orçamento. Fazenda busca cortes.', setores: ['Câmbio ↑', 'PETR4 ↑', 'Varejo ↓'], urgencia: 'alta', fonte: 'Ministério da Fazenda' },
  { categoria: 'Eleições 2026', cor: '#d4a017', emoji: '🗳️', titulo: 'Pesquisas mostram empate técnico', descricao: 'Cenário eleitoral incerto aumenta volatilidade de estatais e Ibovespa.', setores: ['PETR4 (sensível)', 'BBAS3 (sensível)', 'ELET3 (sensível)'], urgencia: 'media', fonte: 'Datafolha' },
  { categoria: 'Agronegócio', cor: '#00c44a', emoji: '🌱', titulo: 'Safra 2026: recorde de 331 mi de toneladas', descricao: 'Soja e milho com área plantada recorde. Demanda chinesa segura preços.', setores: ['SLCE3 ↑', 'AGRO3 ↑', 'SMTO3 ↑'], urgencia: 'baixa', fonte: 'Conab' },
  { categoria: 'Energia', cor: '#d4a017', emoji: '⚡', titulo: 'Bandeira tarifária amarela em julho', descricao: 'Reservatórios baixos no Sudeste. Energia 1,8% mais cara pressiona IPCA.', setores: ['CPFE3 (neutro)', 'ENGI11 ↑', 'Varejo (custo ↑)'], urgencia: 'media', fonte: 'ANEEL' },
  { categoria: 'Commodities', cor: '#00c44a', emoji: '⛏️', titulo: 'Minério de ferro estável em US$ 108', descricao: 'PMI chinês em expansão sustenta demanda. VALE3 com upside técnico.', setores: ['VALE3 ↑', 'CMIN3 ↑', 'CSNA3 ↑'], urgencia: 'baixa', fonte: 'Metal Bulletin' },
]

export default function NoticiasPage() {
  const dadosRSS = getNoticias()
  const noticias: any[] = dadosRSS?.noticias ?? NOTICIAS_FIXAS
  const coletadoEm: string = dadosRSS?.coletado_em ?? 'offline'
  const totalUrgentes: number = dadosRSS?.urgentes ?? 0
  const destaque = dadosRSS?.destaque ?? null
  const aoVivo = !!dadosRSS

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="noticias" />

      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.02em', margin: 0 }}>Notícias & Política Brasil</h1>
            <p style={{ color: '#5a7a60', fontSize: '0.85rem', marginTop: 6 }}>O que acontece no Brasil e como impacta a B3 · {hoje}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {aoVivo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#009c3b18', border: '1px solid #009c3b40', borderRadius: 8, padding: '0.35rem 0.8rem', fontSize: '0.75rem', color: '#00c44a' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c44a', display: 'inline-block' }}/>
                Ao vivo · {coletadoEm}
              </div>
            ) : (
              <div style={{ fontSize: '0.72rem', color: '#5a7a60', background: '#1a2e1e', borderRadius: 6, padding: '0.3rem 0.7rem' }}>
                Offline · Rode o script para atualizar
              </div>
            )}
            {totalUrgentes > 0 && (
              <div style={{ background: '#ff446618', border: '1px solid #cc224440', borderRadius: 8, padding: '0.35rem 0.8rem', fontSize: '0.75rem', color: '#ff4466', fontWeight: 700 }}>
                🔴 {totalUrgentes} urgente{totalUrgentes > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Destaque */}
      {destaque && (
        <div style={{ background: 'linear-gradient(135deg, #0d1a10, #071510)', border: '2px solid #d4a017', borderRadius: 13, padding: '1.4rem', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#d4a017', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 8 }}>★ Notícia em destaque · {destaque.fonte}</div>
          <h2 style={{ color: '#e8f5e9', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px' }}>{destaque.titulo}</h2>
          <p style={{ color: '#a0c8a8', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 10px' }}>{destaque.descricao}</p>
          {destaque.setores?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {destaque.setores.map((s: string) => (
                <span key={s} style={{ fontSize: '0.75rem', background: '#ffffff10', borderRadius: 5, padding: '2px 8px', color: '#5a7a60' }}>{s}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Agenda */}
      <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
          <div style={{ width: 3, height: 16, background: '#009c3b', borderRadius: 2 }}/>
          <span style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Agenda econômica desta semana</span>
          <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {AGENDA_SEMANA.map((ev, i) => {
            const c = corNivel[ev.nivel]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.85rem', background: '#07100a', border: '1px solid #1a2e1e', borderRadius: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}40`, borderRadius: 5, padding: '3px 9px', minWidth: 28, textAlign: 'center' }}>
                  {ev.dia}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#5a7a60', minWidth: 42 }}>{ev.data} {ev.hora}</span>
                <span style={{ fontWeight: 600, color: '#e8f5e9', fontSize: '0.87rem', flex: 1 }}>{ev.evento}</span>
                <span style={{ fontSize: '0.73rem', color: '#a0c8a8', textAlign: 'right', whiteSpace: 'nowrap' }}>{ev.impacto}</span>
              </div>
            )
          })}
        </div>
        <p style={{ color: '#5a7a60', fontSize: '0.72rem', marginTop: '0.7rem' }}>
          Eventos alto risco: não abrir posições novas nas 2h antes da divulgação.
        </p>
      </div>

      {/* Grid notícias */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <div style={{ width: 3, height: 16, background: '#009c3b', borderRadius: 2 }}/>
        <span style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
          {aoVivo ? `${noticias.length} notícias coletadas — impacto na B3` : 'Análise de impacto — Brasil'}
        </span>
        <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.8rem' }}>
        {noticias.slice(0, 24).map((n: any, i: number) => {
          const urgCor = n.urgencia === 'alta' ? '#ff4466' : n.urgencia === 'media' ? '#ffdf00' : '#00c44a'
          const urgBg  = n.urgencia === 'alta' ? '#ff446615' : n.urgencia === 'media' ? '#ffdf0015' : '#00c44a15'
          const cor    = n.cor ?? '#4488ff'
          return (
            <div key={i} style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderLeft: `3px solid ${cor}`, borderRadius: 11, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem' }}>{n.emoji ?? '📰'}</span>
                <span style={{ fontSize: '0.65rem', color: cor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1 }}>{n.categoria} · {n.fonte}</span>
                <span style={{ fontSize: '0.62rem', color: urgCor, background: urgBg, border: `1px solid ${urgCor}40`, borderRadius: 4, padding: '1px 6px', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {n.urgencia === 'alta' ? '🔴 urgente' : n.urgencia === 'media' ? '🟡 atenção' : '🟢 info'}
                </span>
              </div>

              <h3 style={{ color: '#e8f5e9', fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>{n.titulo}</h3>

              {n.descricao && (
                <p style={{ color: '#a0c8a8', fontSize: '0.78rem', lineHeight: 1.55, margin: 0 }}>
                  {n.descricao.slice(0, 220)}{n.descricao.length > 220 ? '…' : ''}
                </p>
              )}

              {n.setores?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {n.setores.map((s: string) => {
                    const up = s.includes('↑')
                    const dn = s.includes('↓')
                    return (
                      <span key={s} style={{ fontSize: '0.7rem', background: up ? '#009c3b20' : dn ? '#ff446620' : '#ffffff10', border: `1px solid ${up ? '#009c3b40' : dn ? '#cc224440' : '#1a2e1e'}`, color: up ? '#00c44a' : dn ? '#ff4466' : '#5a7a60', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>
                        {s}
                      </span>
                    )
                  })}
                </div>
              )}

              {n.link && aoVivo && (
                <a href={n.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.68rem', color: '#5a7a60', borderTop: '1px solid #1a2e1e', paddingTop: 6, textDecoration: 'none' }}>
                  Ler matéria completa →
                </a>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ color: '#5a7a60', fontSize: '0.75rem', marginTop: '2rem', textAlign: 'center' }}>
        {aoVivo
          ? `Notícias coletadas automaticamente às ${coletadoEm} · Não constitui recomendação de investimento`
          : 'Análises de impacto elaboradas pelo B3 Radar · Rode o script para notícias ao vivo'}
      </p>
    </main>
  )
}
