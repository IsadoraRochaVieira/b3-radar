import Link from 'next/link'
import styles from './CarrosselModulos.module.css'

const modulos = [
  { nome: 'Mapa do Mercado', href: '/mapa', icon: '⌁', cor: '#5b9bff', texto: 'Panorama diário dos ativos da B3.' },
  { nome: 'Sugestões', href: '/sugestoes', icon: '↗', cor: '#34d17e', texto: 'Oportunidades filtradas pelo radar.' },
  { nome: 'Comitê de IA', href: '/comite', icon: '◇', cor: '#cf91ff', texto: 'Teses confrontadas por múltiplos agentes.' },
  { nome: 'Cenário Macro', href: '/macro', icon: '◎', cor: '#f0b429', texto: 'Juros, câmbio e indicadores econômicos.' },
  { nome: 'Notícias', href: '/noticias', icon: '◫', cor: '#5b9bff', texto: 'Informação relevante sem o ruído.' },
  { nome: 'Geopolítica', href: '/geopolitica', icon: '◉', cor: '#e5758a', texto: 'Riscos globais que afetam o pregão.' },
  { nome: 'Patrimônio', href: '/patrimonio', icon: '▰', cor: '#34d17e', texto: 'Organização e proteção do seu capital.' },
  { nome: 'Backtesting', href: '/backtesting', icon: '↺', cor: '#f0b429', texto: 'Histórico transparente dos sinais.' },
  { nome: 'Painel', href: '/painel', icon: '▦', cor: '#cf91ff', texto: 'Sua central de inteligência financeira.' },
] as const

export default function CarrosselModulos() {
  return (
    <section className={styles.section} aria-labelledby="modulos-title">
      <div className={styles.heading}>
        <div className={styles.eyebrow}>Terminal completo</div>
        <h2 className={styles.title} id="modulos-title">Explore a plataforma.</h2>
        <p className={styles.description}>Nove frentes de análise conectadas para transformar dados de mercado em decisões mais claras.</p>
      </div>
      <div className={styles.scene}>
        <nav className={styles.ring} aria-label="Módulos da plataforma">
          {modulos.map((modulo, index) => (
            <Link className={styles.card} href={modulo.href} key={modulo.href} style={{ '--angle': `${index * (360 / modulos.length)}deg`, '--accent': modulo.cor } as React.CSSProperties}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.icon} aria-hidden="true">{modulo.icon}</span>
              <span className={styles.name}>{modulo.nome}</span>
              <span className={styles.copy}>{modulo.texto}</span>
            </Link>
          ))}
        </nav>
        <p className={styles.hint}>Passe o cursor para pausar · clique para explorar</p>
      </div>
    </section>
  )
}
