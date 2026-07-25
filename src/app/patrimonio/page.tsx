'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Nav from '@/components/Nav'
import TickerLink from '@/components/TickerLink'

type Posicao = {
  id: string
  ticker: string
  quantidade: number
  precoMedio: number
  precoAtual: number
  estrategia: 'Assimetria' | 'Longo prazo' | 'Swing trade'
}

const STORAGE_KEY = 'caryomap_carteira_v1'
const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function PatrimonioPage() {
  const [posicoes, setPosicoes] = useState<Posicao[]>([])
  const [carregado, setCarregado] = useState(false)
  const [ticker, setTicker] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [precoMedio, setPrecoMedio] = useState('')
  const [precoAtual, setPrecoAtual] = useState('')
  const [estrategia, setEstrategia] = useState<Posicao['estrategia']>('Assimetria')

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      if (salvo) setPosicoes(JSON.parse(salvo))
    } catch { /* carteira inválida começa vazia */ }
    setCarregado(true)
  }, [])

  useEffect(() => {
    if (carregado) localStorage.setItem(STORAGE_KEY, JSON.stringify(posicoes))
  }, [carregado, posicoes])

  const resumo = useMemo(() => {
    let investido = 0
    let atual = 0
    for (const p of posicoes) {
      investido += p.quantidade * p.precoMedio
      atual += p.quantidade * p.precoAtual
    }
    const resultado = atual - investido
    const retorno = investido ? (resultado / investido) * 100 : 0
    const maior = posicoes.reduce<Posicao | null>((acc, p) => !acc || p.quantidade * p.precoAtual > acc.quantidade * acc.precoAtual ? p : acc, null)
    const concentracao = maior && atual ? ((maior.quantidade * maior.precoAtual) / atual) * 100 : 0
    return { investido, atual, resultado, retorno, maior, concentracao }
  }, [posicoes])

  function adicionar(e: FormEvent) {
    e.preventDefault()
    const q = Number(quantidade.replace(',', '.'))
    const pm = Number(precoMedio.replace(',', '.'))
    const pa = Number((precoAtual || precoMedio).replace(',', '.'))
    const tk = ticker.trim().toUpperCase()
    if (!/^[A-Z]{4}\d{1,2}$/.test(tk) || q <= 0 || pm <= 0 || pa <= 0) return
    setPosicoes(prev => [...prev, { id: `${tk}-${Date.now()}`, ticker: tk, quantidade: q, precoMedio: pm, precoAtual: pa, estrategia }])
    setTicker(''); setQuantidade(''); setPrecoMedio(''); setPrecoAtual('')
  }

  const campo: React.CSSProperties = { background: '#0a0e14', border: '1px solid #1c2538', borderRadius: 8, color: '#e8edf5', padding: '10px 11px', width: '100%', fontFamily: 'var(--mono)', fontSize: 13 }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <Nav ativa="patrimonio" />

      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '.16em', fontWeight: 700, textTransform: 'uppercase' }}>Laboratório pessoal</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e8edf5', marginTop: 6 }}>Minha Carteira</h1>
        <p style={{ color: '#8a9bbf', fontSize: 14, lineHeight: 1.6, marginTop: 6, maxWidth: 670 }}>Registre suas posições manualmente para enxergar resultado, concentração e estratégia. Os dados ficam somente neste navegador.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))', gap: 10, marginBottom: 18 }}>
        {[
          { l: 'Capital investido', v: moeda(resumo.investido), c: '#e8edf5' },
          { l: 'Valor atual', v: moeda(resumo.atual), c: '#5b9bff' },
          { l: 'Resultado', v: `${resumo.resultado >= 0 ? '+' : ''}${moeda(resumo.resultado)}`, c: resumo.resultado >= 0 ? '#34d17e' : '#e53555' },
          { l: 'Rentabilidade', v: `${resumo.retorno >= 0 ? '+' : ''}${resumo.retorno.toFixed(2)}%`, c: resumo.retorno >= 0 ? '#34d17e' : '#e53555' },
          { l: 'Maior posição', v: resumo.maior ? `${resumo.maior.ticker} · ${resumo.concentracao.toFixed(1)}%` : '—', c: resumo.concentracao > 35 ? '#f0b429' : '#8a9bbf' },
        ].map(m => <div key={m.l} style={{ background: '#0f1520', border: '1px solid #1c2538', borderRadius: 12, padding: '1rem' }}><div style={{ color: '#4d5f7a', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>{m.l}</div><div style={{ color: m.c, fontWeight: 800, fontSize: 18, marginTop: 7 }}>{m.v}</div></div>)}
      </div>

      <form onSubmit={adicionar} style={{ background: 'linear-gradient(135deg,rgba(91,155,255,.08),#0f1520 55%)', border: '1px solid #26334d', borderRadius: 14, padding: '1.2rem', marginBottom: 20 }}>
        <div style={{ color: '#e8edf5', fontWeight: 750, marginBottom: 12 }}>Adicionar posição</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(135px,1fr))', gap: 10, alignItems: 'end' }}>
          <label style={{ color: '#8a9bbf', fontSize: 11 }}>Ticker<input aria-label="Ticker" value={ticker} onChange={e => setTicker(e.target.value)} placeholder="PETR4" style={{ ...campo, marginTop: 5, textTransform: 'uppercase' }} /></label>
          <label style={{ color: '#8a9bbf', fontSize: 11 }}>Quantidade<input aria-label="Quantidade" inputMode="decimal" value={quantidade} onChange={e => setQuantidade(e.target.value)} placeholder="100" style={{ ...campo, marginTop: 5 }} /></label>
          <label style={{ color: '#8a9bbf', fontSize: 11 }}>Preço médio<input aria-label="Preço médio" inputMode="decimal" value={precoMedio} onChange={e => setPrecoMedio(e.target.value)} placeholder="38,50" style={{ ...campo, marginTop: 5 }} /></label>
          <label style={{ color: '#8a9bbf', fontSize: 11 }}>Preço atual<input aria-label="Preço atual" inputMode="decimal" value={precoAtual} onChange={e => setPrecoAtual(e.target.value)} placeholder="opcional" style={{ ...campo, marginTop: 5 }} /></label>
          <label style={{ color: '#8a9bbf', fontSize: 11 }}>Estratégia<select aria-label="Estratégia" value={estrategia} onChange={e => setEstrategia(e.target.value as Posicao['estrategia'])} style={{ ...campo, marginTop: 5 }}>{['Assimetria','Longo prazo','Swing trade'].map(x => <option key={x}>{x}</option>)}</select></label>
          <button type="submit" style={{ border: 0, borderRadius: 8, padding: '11px 14px', background: 'linear-gradient(135deg,#d4920a,#f0b429)', color: '#0a0e14', fontWeight: 800, cursor: 'pointer' }}>Adicionar</button>
        </div>
      </form>

      {posicoes.length === 0 ? (
        <div style={{ border: '1px dashed #26334d', borderRadius: 14, padding: '3rem 1rem', textAlign: 'center', color: '#4d5f7a' }}><div style={{ fontSize: 28, marginBottom: 8 }}>▦</div>Sua carteira começa aqui. Adicione a primeira posição acima.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posicoes.map(p => {
            const custo = p.quantidade * p.precoMedio
            const valor = p.quantidade * p.precoAtual
            const resultado = valor - custo
            const pct = custo ? (resultado / custo) * 100 : 0
            const peso = resumo.atual ? (valor / resumo.atual) * 100 : 0
            return <article key={p.id} style={{ background: '#0f1520', border: '1px solid #1c2538', borderLeft: `4px solid ${pct >= 0 ? '#00a63c' : '#e53555'}`, borderRadius: 11, padding: '1rem 1.2rem', display: 'grid', gridTemplateColumns: 'minmax(100px,1fr) repeat(4,minmax(90px,auto)) auto', gap: 18, alignItems: 'center', overflowX: 'auto' }}>
              <div><TickerLink ticker={p.ticker} style={{ fontFamily: 'var(--mono)', fontWeight: 800, fontSize: 17 }} /><div style={{ color: '#4d5f7a', fontSize: 10, marginTop: 4 }}>{p.estrategia}</div></div>
              <Metric label="Posição" value={moeda(valor)} />
              <Metric label="Preço médio" value={moeda(p.precoMedio)} />
              <Metric label="Resultado" value={`${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`} color={pct >= 0 ? '#34d17e' : '#e53555'} />
              <Metric label="Peso" value={`${peso.toFixed(1)}%`} color={peso > 35 ? '#f0b429' : '#8a9bbf'} />
              <button aria-label={`Remover ${p.ticker}`} onClick={() => setPosicoes(prev => prev.filter(x => x.id !== p.id))} style={{ background: 'transparent', border: '1px solid #1c2538', borderRadius: 7, color: '#e5758a', padding: '6px 9px', cursor: 'pointer' }}>×</button>
            </article>
          })}
        </div>
      )}
    </main>
  )
}

function Metric({ label, value, color = '#e8edf5' }: { label: string; value: string; color?: string }) {
  return <div><div style={{ color: '#4d5f7a', fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</div><div style={{ color, fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, marginTop: 4, whiteSpace: 'nowrap' }}>{value}</div></div>
}
