'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ── Radar de pequi: o núcleo dourado do pequi como tela de radar ── */
function RadarPequi() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduzMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const SIZE = 460
    canvas.width = SIZE * 2
    canvas.height = SIZE * 2
    ctx.scale(2, 2)

    const cx = SIZE / 2, cy = SIZE / 2, R = SIZE / 2 - 10

    // Pontos = ações espalhadas no radar (posição fixa, semente determinística)
    const pontos: { a: number; d: number; forte: boolean }[] = []
    let seed = 7
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    for (let i = 0; i < 42; i++) {
      pontos.push({ a: rnd() * Math.PI * 2, d: (0.25 + rnd() * 0.7) * R, forte: rnd() > 0.72 })
    }

    let ang = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // núcleo do pequi: dourado radial
      const nucleo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      nucleo.addColorStop(0, 'rgba(240,180,41,0.16)')
      nucleo.addColorStop(0.55, 'rgba(212,146,10,0.07)')
      nucleo.addColorStop(1, 'rgba(212,146,10,0.02)')
      ctx.fillStyle = nucleo
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()

      // anéis
      ctx.strokeStyle = 'rgba(212,146,10,0.22)'
      ctx.lineWidth = 1
      for (const f of [0.33, 0.66, 1]) {
        ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke()
      }
      // cruz
      ctx.beginPath()
      ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy)
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R)
      ctx.strokeStyle = 'rgba(212,146,10,0.12)'
      ctx.stroke()

      // feixe do radar
      const grad = ctx.createConicGradient
        ? (() => {
            const g = ctx.createConicGradient(ang, cx, cy)
            g.addColorStop(0, 'rgba(240,180,41,0.35)')
            g.addColorStop(0.08, 'rgba(240,180,41,0.0)')
            g.addColorStop(1, 'rgba(240,180,41,0)')
            return g
          })()
        : null
      if (grad) {
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, R, ang - 0.9, ang)
        ctx.closePath()
        ctx.fill()
      }
      // linha do feixe
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R)
      ctx.strokeStyle = 'rgba(240,180,41,0.8)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // pontos: acendem quando o feixe passa
      for (const p of pontos) {
        let diff = (ang - p.a) % (Math.PI * 2)
        if (diff < 0) diff += Math.PI * 2
        const brilho = Math.max(0, 1 - diff / 1.6)
        const x = cx + Math.cos(p.a) * p.d
        const y = cy + Math.sin(p.a) * p.d
        const base = p.forte ? 0.5 : 0.18
        const cor = p.forte
          ? `rgba(240,180,41,${base + brilho * 0.5})`
          : `rgba(91,155,255,${base + brilho * 0.45})`
        ctx.fillStyle = cor
        ctx.beginPath()
        ctx.arc(x, y, p.forte ? 3 + brilho * 2 : 2, 0, Math.PI * 2)
        ctx.fill()
        if (p.forte && brilho > 0.5) {
          ctx.strokeStyle = `rgba(240,180,41,${(brilho - 0.5) * 0.7})`
          ctx.beginPath(); ctx.arc(x, y, 7 + brilho * 4, 0, Math.PI * 2); ctx.stroke()
        }
      }

      ang += 0.012
      if (!reduzMotion) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 460, height: 460, maxWidth: '92vw', maxHeight: '92vw' }}
      aria-label="Radar varrendo ações da B3"
      role="img"
    />
  )
}

/* ── Revela no scroll ── */
function Revela({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisivel(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: visivel ? 1 : 0,
      transform: visivel ? 'none' : 'translateY(24px)',
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

export default function Landing() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600..900&display=swap');
        .lp-display {
          font-family: 'Archivo', Inter, sans-serif;
          font-stretch: 125%;
          letter-spacing: -0.01em;
        }
        .lp-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: center; }
        .lp-3col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .lp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        @media (max-width: 860px) {
          .lp-hero-grid { grid-template-columns: 1fr; text-align: center; justify-items: center; }
          .lp-3col { grid-template-columns: 1fr; }
          .lp-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .lp-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #d4920a, #f0b429);
          color: #0a0e14; font-weight: 800; font-size: 15px;
          padding: 14px 28px; border-radius: 10px; text-decoration: none;
          box-shadow: 0 8px 32px rgba(212,146,10,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .lp-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(212,146,10,0.5); }
        .lp-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--border2); color: var(--text2);
          padding: 13px 24px; border-radius: 10px; text-decoration: none; font-size: 14px;
          transition: border-color 0.15s, color 0.15s;
        }
        .lp-cta-ghost:hover { border-color: #d4920a; color: #f0b429; }
        @media (prefers-reduced-motion: reduce) { .lp-cta:hover { transform: none; } }
      `}</style>

      {/* ── Header mínimo ── */}
      <header style={{
        maxWidth: 1100, margin: '0 auto', padding: '1.25rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: 'linear-gradient(135deg, #1052cc, #2563eb)',
            borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'var(--mono)',
          }}>B3</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>B3 Radar</span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#d4920a', border: '1px solid rgba(212,146,10,0.4)',
            borderRadius: 4, padding: '2px 6px', letterSpacing: '0.1em', fontFamily: 'var(--mono)',
          }}>PEQUI</span>
        </div>
        <Link href="/painel" style={{
          color: 'var(--text2)', fontSize: 14, textDecoration: 'none',
          border: '1px solid var(--border2)', borderRadius: 8, padding: '8px 18px',
        }}>Entrar</Link>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1rem 5rem' }}>
        <div className="lp-hero-grid">
          <div>
            <div style={{
              fontSize: 11, color: '#d4920a', letterSpacing: '0.18em', fontWeight: 700,
              fontFamily: 'var(--mono)', marginBottom: 20, textTransform: 'uppercase',
            }}>
              Análise técnica do cerrado para a bolsa
            </div>
            <h1 className="lp-display" style={{
              fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.04,
              color: 'var(--text)', margin: 0,
            }}>
              A B3 inteira,<br/>
              varrida <span style={{
                background: 'linear-gradient(135deg, #d4920a, #f0b429)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>duas vezes por dia.</span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 17, lineHeight: 1.65, marginTop: 24, maxWidth: 460 }}>
              O B3 Radar analisa 138 ações líquidas da bolsa brasileira com indicadores técnicos,
              cruza com o cenário macro e as notícias do dia, e entrega um relatório claro:
              o que comprar, o que observar e o que evitar — com entrada, stop e alvo.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <Link href="/painel" className="lp-cta">Ver o relatório de hoje →</Link>
              <Link href="/backtesting" className="lp-cta-ghost">Conferir o histórico</Link>
            </div>
          </div>
          <RadarPequi />
        </div>
      </section>

      {/* ── FAIXA DE NÚMEROS ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="lp-stats" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {[
            { n: '138', l: 'ações líquidas monitoradas' },
            { n: '2×', l: 'relatórios por dia útil' },
            { n: '15', l: 'setores mapeados nas notícias' },
            { n: '100%', l: 'do histórico aberto no backtest' },
          ].map(s => (
            <div key={s.l} style={{ padding: '1.75rem 1.5rem', borderLeft: '1px solid var(--border)' }}>
              <div className="lp-display" style={{ fontSize: 34, fontWeight: 900, color: '#f0b429', fontFamily: 'var(--mono)' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── O PEQUI / MISSÃO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem' }}>
        <Revela>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🌳</div>
            <h2 className="lp-display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              Por fora, cerrado.<br/>Por dentro, ouro.
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.75, marginTop: 20 }}>
              O pequi é assim: casca discreta, polpa dourada — e quem morde sem cuidado se espeta.
              A bolsa também. Nossa missão é achar o ouro escondido entre centenas de papéis
              e avisar exatamente onde estão os espinhos: todo relatório sai com stop definido
              antes da entrada, e todo acerto <em>e todo erro</em> fica registrado em público.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 16, fontFamily: 'var(--mono)' }}>
              Pequi Estúdio · Brasília, DF
            </p>
          </div>
        </Revela>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 5rem' }}>
        <Revela>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 20, fontFamily: 'var(--mono)' }}>
            O ciclo de um dia de pregão
          </div>
        </Revela>
        <div className="lp-3col">
          {[
            {
              hora: '08:30', titulo: 'O radar gira', cor: '#5b9bff',
              texto: 'Antes da abertura, varremos as 138 ações mais líquidas: RSI, médias, MACD, Bandas de Bollinger, volume. O cenário macro e as notícias da madrugada entram na conta.',
            },
            {
              hora: '13:00', titulo: 'Segunda passada', cor: '#f0b429',
              texto: 'Com o pregão andando, o radar gira de novo. O que mudou aparece: papéis que romperam, sinais que se confirmaram ou falharam, semáforo do dia atualizado.',
            },
            {
              hora: 'Sempre', titulo: 'Tudo fica registrado', cor: '#00a63c',
              texto: 'Cada sugestão vira uma operação rastreada até bater stop ou alvo. A taxa de acerto que você vê no backtesting é calculada sobre todas — sem esconder as perdas.',
            },
          ].map((c, i) => (
            <Revela key={c.hora} delay={i * 120}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderTop: `3px solid ${c.cor}`, borderRadius: 12, padding: '1.5rem', height: '100%',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: c.cor, fontWeight: 700 }}>{c.hora}</div>
                <div className="lp-display" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', margin: '8px 0 10px' }}>{c.titulo}</div>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{c.texto}</p>
              </div>
            </Revela>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(212,146,10,0.10), transparent 65%)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
          <Revela>
            <h2 className="lp-display" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: 'var(--text)', margin: 0 }}>
              O pregão de hoje já foi varrido.
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, marginTop: 14 }}>
              Relatório da manhã e da tarde, 10 sugestões ranqueadas e o semáforo do dia.
            </p>
            <div style={{ marginTop: 28 }}>
              <Link href="/painel" className="lp-cta">Entrar na plataforma →</Link>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 24 }}>
              Ferramenta educacional de análise técnica · Não é recomendação de investimento
            </p>
          </Revela>
        </div>
      </section>
    </main>
  )
}
