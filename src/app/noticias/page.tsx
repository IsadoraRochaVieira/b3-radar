import Nav from '@/components/Nav'

const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

const NOTICIAS_BRASIL = [
  {
    categoria: 'Política Econômica',
    cor: '#4488ff',
    emoji: '🏦',
    titulo: 'COPOM mantém Selic em 14,25% — sem surpresa',
    resumo: 'Banco Central mantém taxa básica na reunião de julho. Ata deve trazer sinalização mais clara sobre ritmo de cortes. Mercado precifica primeiro corte para março de 2027.',
    impacto: 'Bancos se beneficiam do spread alto. Varejo e imobiliário pressionados. Títulos Tesouro Direto IPCA+ ficam mais atrativos.',
    setores: ['ITUB4 ↑', 'BBDC4 ↑', 'MGLU3 ↓', 'CYRE3 ↓'],
    urgencia: 'alta',
    fonte: 'Banco Central do Brasil',
  },
  {
    categoria: 'Fiscal & Orçamento',
    cor: '#ff4466',
    emoji: '📊',
    titulo: 'Déficit primário de R$ 68bi no semestre — acima da meta',
    resumo: 'Resultado primário do governo central ficou R$ 12bi acima do projetado. Gastos sociais e precatórios pressionam o orçamento. Ministério da Fazenda busca cortes para cumprir arcabouço fiscal.',
    impacto: 'Pressão no câmbio. Risco de rebaixamento de rating eleva prêmio de risco Brasil (CDS sobe). Exportadoras se beneficiam do dólar alto.',
    setores: ['Câmbio: R$ 5,12 ↑', 'PETR4 ↑', 'VALE3 ↑', 'Varejo ↓'],
    urgencia: 'alta',
    fonte: 'Ministério da Fazenda · STN',
  },
  {
    categoria: 'Eleições 2026',
    cor: '#d4a017',
    emoji: '🗳️',
    titulo: 'Pesquisas mostram empate técnico — cenário eleitoral incerto',
    resumo: 'Pesquisas de intenção de voto mostram cenário competitivo para 2026. Candidato pró-mercado aparece em segundo turno. Ibovespa historicamente sobe 15-20% no ano de eleição quando candidato liberal lidera.',
    impacto: 'Volatilidade acima do normal até outubro de 2026. Estatais (PETR4, BBAS3, ELET3) mais sensíveis a resultados de pesquisas.',
    setores: ['PETR4 (sensível)', 'BBAS3 (sensível)', 'ELET3 (sensível)', 'Exportadoras (neutro)'],
    urgencia: 'media',
    fonte: 'Datafolha · IBOPE · XP Investimentos',
  },
  {
    categoria: 'Infraestrutura',
    cor: '#00c44a',
    emoji: '🚧',
    titulo: 'Governo anuncia R$ 42bi em concessões rodoviárias e portuárias',
    resumo: 'PAC 2026 inclui leilões de rodovias no 2º semestre e concessões portuárias no Nordeste. Abertura para capital privado amplia oportunidades no setor de infraestrutura.',
    impacto: 'CCR, Ecorodovias e Wilson Sons se beneficiam diretamente. Construtoras com expertise em infraestrutura ganham novos contratos.',
    setores: ['CCRO3 ↑', 'ECOR3 ↑', 'PORT3 ↑', 'CMIN3 (logística)'],
    urgencia: 'baixa',
    fonte: 'Ministério de Portos e Aeroportos · ANTT',
  },
  {
    categoria: 'Reforma Tributária',
    cor: '#4488ff',
    emoji: '📜',
    titulo: 'IBS e CBS entram em vigor — impacto setorial divergente',
    resumo: 'Implementação gradual da reforma tributária começa em 2026. Varejo e serviços sofrem transição. Agronegócio tem tratamento especial. Período de adaptação vai até 2033.',
    impacto: 'Curto prazo: incerteza eleva volatilidade no varejo. Médio prazo: simplificação reduz custo de compliance para exportadores.',
    setores: ['Varejo (adaptação)', 'JBSS3 ↑ (agro)', 'SMTO3 ↑ (agro)', 'MGLU3 (incerto)'],
    urgencia: 'media',
    fonte: 'Receita Federal · Câmara dos Deputados',
  },
  {
    categoria: 'Agronegócio',
    cor: '#00c44a',
    emoji: '🌱',
    titulo: 'Safra 2026: Brasil projeta recorde de 331 mi de toneladas',
    resumo: 'Conab revisa projeção de safra para cima. Soja e milho com área plantada recorde. Demanda chinesa se mantém forte. Preços internacionais estáveis favorecem exportações.',
    impacto: 'Setor mais forte da B3 em 2026. Câmbio depreciado amplifica receita em reais. Logística de escoamento (ferrovias) ganha com volume.',
    setores: ['SLCE3 ↑', 'AGRO3 ↑', 'SMTO3 ↑', 'RAIL3 ↑ (logística)'],
    urgencia: 'baixa',
    fonte: 'Conab · USDA Brasil · Embrapa',
  },
  {
    categoria: 'Energia',
    cor: '#d4a017',
    emoji: '⚡',
    titulo: 'Bandeira tarifária amarela em julho — energia 1,8% mais cara',
    resumo: 'Agência Nacional de Energia Elétrica mantém bandeira amarela por baixos níveis dos reservatórios no Sudeste. Impacto de R$ 1,84 por 100 kWh na conta de luz dos consumidores.',
    impacto: 'Inflação de serviços sobe, pressionando IPCA. Distribuidoras repassam custo. Termelétricas despacham mais — positivo para operadores térmicos.',
    setores: ['CPFE3 (neutro)', 'ENBR3 ↓', 'ENGI11 ↑ (térmica)', 'Varejo (custo ↑)'],
    urgencia: 'media',
    fonte: 'ANEEL · ONS',
  },
  {
    categoria: 'Commodities',
    cor: '#00c44a',
    emoji: '⛏️',
    titulo: 'Minério de ferro estável em US$ 108 — China sustenta demanda',
    resumo: 'Preço do minério de ferro ficou estável após PMI chinês em 50.8 pontos. Produção de aço na China cresceu 4.2% no acumulado de 2026. Vale e CSN Mineração se beneficiam.',
    impacto: 'VALE3 tem upside técnico com preço do minério neste patamar. Cada US$10 no preço do minério impacta ~R$ 4-5 no resultado por ação da Vale.',
    setores: ['VALE3 ↑', 'CMIN3 ↑', 'CSNA3 ↑', 'GGBR4 (aço)'],
    urgencia: 'baixa',
    fonte: 'World Steel Association · Metal Bulletin',
  },
]

const AGENDA_SEMANA = [
  { dia: 'Seg 07/07', evento: 'PMI Serviços China', hora: '02:45', impacto: 'VALE3, exportadores', nivel: 'medio' },
  { dia: 'Ter 08/07', evento: 'IPCA prévia IBGE', hora: '09:00', impacto: 'Selic, varejo, bancos', nivel: 'alto' },
  { dia: 'Qua 09/07', evento: 'Ata do COPOM', hora: '08:30', impacto: 'Renda fixa, câmbio, todos', nivel: 'alto' },
  { dia: 'Qui 10/07', evento: 'Resultado fiscal do gov. central', hora: '15:00', impacto: 'Câmbio, CDS Brasil', nivel: 'alto' },
  { dia: 'Sex 11/07', evento: 'Produção industrial Brasil (IBGE)', hora: '09:00', impacto: 'Varejo, consumo, crédito', nivel: 'medio' },
]

const corNivel: Record<string, { bg: string; border: string; text: string }> = {
  alto:  { bg: '#ff446618', border: '#cc2244', text: '#ff4466' },
  medio: { bg: '#ffdf0018', border: '#d4a017', text: '#ffdf00' },
  baixo: { bg: '#00c44a18', border: '#009c3b', text: '#00c44a' },
}

export default function NoticiasPage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="noticias" />

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.02em' }}>Notícias & Política Brasil</h1>
        <p style={{ color: '#5a7a60', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          O que está acontecendo no Brasil e como impacta a B3 · {hoje}
        </p>
      </header>

      {/* Agenda da semana */}
      <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ width: 3, height: 16, background: '#009c3b', borderRadius: 2 }}/>
          <span style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Agenda econômica desta semana</span>
          <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {AGENDA_SEMANA.map((ev, i) => {
            const c = corNivel[ev.nivel]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.9rem', background: '#07100a', border: '1px solid #1a2e1e', borderRadius: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}40`, borderRadius: 5, padding: '3px 8px', minWidth: 70, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {ev.dia}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#5a7a60', minWidth: 45 }}>{ev.hora}</span>
                <span style={{ fontWeight: 600, color: '#e8f5e9', fontSize: '0.88rem', flex: 1 }}>{ev.evento}</span>
                <span style={{ fontSize: '0.75rem', color: '#5a7a60', textAlign: 'right' }}>
                  <span style={{ color: '#a0c8a8' }}>{ev.impacto}</span>
                </span>
              </div>
            )
          })}
        </div>
        <p style={{ color: '#5a7a60', fontSize: '0.72rem', marginTop: '0.75rem' }}>
          Eventos marcados como alto risco: evitar abrir posições novas nas 2h antes da divulgação.
        </p>
      </div>

      {/* Grid de notícias */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <div style={{ width: 3, height: 16, background: '#009c3b', borderRadius: 2 }}/>
        <span style={{ fontSize: '0.72rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Análise de impacto — Brasil</span>
        <div style={{ flex: 1, height: 1, background: '#1a2e1e' }}/>
        <span style={{ fontSize: '0.68rem', color: '#009c3b', background: '#009c3b18', border: '1px solid #009c3b40', borderRadius: 4, padding: '2px 7px', fontWeight: 700 }}>ATUALIZADO HOJE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
        {NOTICIAS_BRASIL.map((n, i) => {
          const urgCor = n.urgencia === 'alta' ? '#ff4466' : n.urgencia === 'media' ? '#ffdf00' : '#00c44a'
          const urgBg  = n.urgencia === 'alta' ? '#ff446615' : n.urgencia === 'media' ? '#ffdf0015' : '#00c44a15'
          return (
            <div key={i} style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderLeft: `3px solid ${n.cor}`, borderRadius: 11, padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{n.emoji}</span>
                <span style={{ fontSize: '0.68rem', color: n.cor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1 }}>{n.categoria}</span>
                <span style={{ fontSize: '0.65rem', color: urgCor, background: urgBg, border: `1px solid ${urgCor}40`, borderRadius: 4, padding: '2px 7px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {n.urgencia === 'alta' ? '🔴 urgente' : n.urgencia === 'media' ? '🟡 atenção' : '🟢 info'}
                </span>
              </div>

              {/* Título */}
              <h3 style={{ color: '#e8f5e9', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>{n.titulo}</h3>

              {/* Resumo */}
              <p style={{ color: '#a0c8a8', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{n.resumo}</p>

              {/* Impacto */}
              <div style={{ background: '#07100a', borderRadius: 7, padding: '0.6rem 0.75rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>Impacto na B3</div>
                <p style={{ color: '#a0c8a8', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>{n.impacto}</p>
              </div>

              {/* Ações afetadas */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {n.setores.map(s => {
                  const up = s.includes('↑')
                  const down = s.includes('↓')
                  return (
                    <span key={s} style={{ fontSize: '0.72rem', background: up ? '#009c3b20' : down ? '#ff446620' : '#ffffff10', border: `1px solid ${up ? '#009c3b40' : down ? '#cc224440' : '#1a2e1e'}`, color: up ? '#00c44a' : down ? '#ff4466' : '#5a7a60', borderRadius: 5, padding: '2px 7px', fontWeight: 600 }}>
                      {s}
                    </span>
                  )
                })}
              </div>

              {/* Fonte */}
              <div style={{ fontSize: '0.68rem', color: '#1a4020', borderTop: '1px solid #1a2e1e', paddingTop: 6, color: '#5a7a60' }}>
                Fonte: {n.fonte}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ color: '#5a7a60', fontSize: '0.75rem', marginTop: '2rem', textAlign: 'center' }}>
        Análises de impacto elaboradas pelo B3 Radar · Não constitui recomendação de investimento
      </p>
    </main>
  )
}
