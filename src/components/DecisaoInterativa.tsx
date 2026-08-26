'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Perfil = 'calma' | 'profundidade' | 'timing'

const perfis: Record<Perfil, {
  rotulo: string
  titulo: string
  texto: string
  destino: string
  acao: string
  cor: string
}> = {
  calma: {
    rotulo: 'Construir patrimônio',
    titulo: 'Sua rota pede consistência',
    texto: 'Priorize empresas compreensíveis, diversificação e revisão de tese. Oscilação diária não precisa virar decisão.',
    destino: '/mapa',
    acao: 'Explorar o mapa de oportunidades',
    cor: '#34d17e',
  },
  profundidade: {
    rotulo: 'Investigar antes de agir',
    titulo: 'Sua rota pede evidências',
    texto: 'Compare fundamentos, contexto macro e argumentos contrários antes de transformar uma boa história em posição.',
    destino: '/comite',
    acao: 'Abrir a Mesa de análise',
    cor: '#f0b429',
  },
  timing: {
    rotulo: 'Operar movimentos curtos',
    titulo: 'Sua rota pede risco definido',
    texto: 'Uma entrada só faz sentido quando stop, alvo, tamanho da posição e prazo estão definidos antes da ordem.',
    destino: '/sugestoes',
    acao: 'Ver sinais rastreados',
    cor: '#ff6b4a',
  },
}

function numero(value: string) {
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

function moeda(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function DecisaoInterativa() {
  const [perfil, setPerfil] = useState<Perfil>('profundidade')
  const [capital, setCapital] = useState('10000')
  const [risco, setRisco] = useState('1')
  const [entrada, setEntrada] = useState('25')
  const [stop, setStop] = useState('23.75')
  const [alvo, setAlvo] = useState('28')

  const plano = useMemo(() => {
    const capitalValor = numero(capital)
    const riscoPct = numero(risco)
    const entradaValor = numero(entrada)
    const stopValor = numero(stop)
    const alvoValor = numero(alvo)
    const riscoUnitario = Math.max(0, entradaValor - stopValor)
    const ganhoUnitario = Math.max(0, alvoValor - entradaValor)
    const perdaMaxima = capitalValor * (riscoPct / 100)
    const quantidade = riscoUnitario > 0 ? Math.floor(perdaMaxima / riscoUnitario) : 0
    const custoPosicao = quantidade * entradaValor
    const ganhoPotencial = quantidade * ganhoUnitario
    const relacao = riscoUnitario > 0 ? ganhoUnitario / riscoUnitario : 0
    const valido = capitalValor > 0 && riscoPct > 0 && entradaValor > stopValor && alvoValor > entradaValor

    return { perdaMaxima, quantidade, custoPosicao, ganhoPotencial, relacao, valido }
  }, [capital, risco, entrada, stop, alvo])

  const selecionado = perfis[perfil]

  return (
    <section className="decision-lab" aria-labelledby="decision-lab-title">
      <div className="decision-lab__intro">
        <div>
          <span className="decision-lab__eyebrow">Antes do relatório</span>
          <h2 id="decision-lab-title" className="decision-lab__title">Transforme interesse em um plano.</h2>
        </div>
        <p>
          Duas ferramentas rápidas para reduzir decisões por impulso: encontre a experiência que combina com seu objetivo e teste o risco de uma operação antes de estudá-la.
        </p>
      </div>

      <div className="decision-lab__grid">
        <article className="decision-card decision-card--profile">
          <div className="decision-card__number">01</div>
          <div className="decision-card__heading">
            <span>Bússola do investidor</span>
            <h3>O que você quer resolver agora?</h3>
          </div>

          <div className="profile-options" role="group" aria-label="Escolha seu objetivo principal">
            {(Object.keys(perfis) as Perfil[]).map((chave) => (
              <button
                key={chave}
                type="button"
                className={`profile-option ${perfil === chave ? 'profile-option--active' : ''}`}
                aria-pressed={perfil === chave}
                onClick={() => setPerfil(chave)}
              >
                <span className="profile-option__dot" style={{ background: perfis[chave].cor }} />
                {perfis[chave].rotulo}
              </button>
            ))}
          </div>

          <div className="profile-result" style={{ borderColor: selecionado.cor }} aria-live="polite">
            <span className="profile-result__tag" style={{ color: selecionado.cor }}>ROTA RECOMENDADA</span>
            <h4>{selecionado.titulo}</h4>
            <p>{selecionado.texto}</p>
            <Link href={selecionado.destino}>{selecionado.acao} <span aria-hidden="true">→</span></Link>
          </div>
        </article>

        <article className="decision-card decision-card--risk">
          <div className="decision-card__number">02</div>
          <div className="decision-card__heading">
            <span>Laboratório de risco</span>
            <h3>Quanto essa ideia pode custar?</h3>
          </div>

          <div className="risk-fields">
            <label>Capital disponível <span>R$</span><input inputMode="decimal" value={capital} onChange={(e) => setCapital(e.target.value)} /></label>
            <label>Risco máximo <span>%</span><input inputMode="decimal" value={risco} onChange={(e) => setRisco(e.target.value)} /></label>
            <label>Preço de entrada <span>R$</span><input inputMode="decimal" value={entrada} onChange={(e) => setEntrada(e.target.value)} /></label>
            <label>Stop planejado <span>R$</span><input inputMode="decimal" value={stop} onChange={(e) => setStop(e.target.value)} /></label>
            <label>Alvo planejado <span>R$</span><input inputMode="decimal" value={alvo} onChange={(e) => setAlvo(e.target.value)} /></label>
          </div>

          {plano.valido ? (
            <div className="risk-result" aria-live="polite">
              <div><span>Quantidade pelo risco</span><strong>{plano.quantidade} ações</strong></div>
              <div><span>Capital comprometido</span><strong>{moeda(plano.custoPosicao)}</strong></div>
              <div><span>Perda máxima estimada</span><strong className="risk-result__loss">{moeda(plano.perdaMaxima)}</strong></div>
              <div><span>Ganho potencial no alvo</span><strong className="risk-result__gain">{moeda(plano.ganhoPotencial)}</strong></div>
              <div className="risk-result__ratio"><span>Relação retorno/risco</span><strong>{plano.relacao.toFixed(2)} : 1</strong></div>
            </div>
          ) : (
            <div className="risk-warning" role="status">Use stop abaixo da entrada e alvo acima da entrada para calcular o plano.</div>
          )}

          <p className="risk-disclaimer">Simulação educacional. Custos, impostos, liquidez e slippage não estão incluídos.</p>
        </article>
      </div>
    </section>
  )
}
