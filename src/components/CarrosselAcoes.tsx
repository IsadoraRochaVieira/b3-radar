import TickerLink from './TickerLink'
import styles from './CarrosselAcoes.module.css'

export type AcaoCarrossel = {
  ticker: string
  nome: string
  score: number
  acao: 'COMPRAR' | 'OBSERVAR' | 'EVITAR'
  preco: string
}

const cores = {
  COMPRAR: '#34d17e',
  OBSERVAR: '#f0b429',
  EVITAR: '#e53555',
} as const

export default function CarrosselAcoes({ ativos }: { ativos: AcaoCarrossel[] }) {
  const duracao = 16

  return (
    <section className={styles.section} aria-label="Ações em destaque no radar">
      <div className={styles.viewport}>
        {ativos.map((ativo, index) => (
          <article
            className={styles.card}
            key={ativo.ticker}
            style={{
              '--delay': `${-(index * duracao) / ativos.length}s`,
              '--accent': cores[ativo.acao],
            } as React.CSSProperties}
          >
            <div className={styles.tickerRow}>
              <span className={styles.ticker}><TickerLink ticker={ativo.ticker} /></span>
              <span className={styles.score}>{ativo.score} pts</span>
            </div>
            <div className={styles.name}>{ativo.nome}</div>
            <span className={styles.action}>{ativo.acao}</span>
            <div className={styles.divider} />
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Entrada</span>
              <span className={styles.price}>R$ {ativo.preco}</span>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.hint}>Passe o cursor para pausar · selecione o ticker para consultar</p>
    </section>
  )
}
