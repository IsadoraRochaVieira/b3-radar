'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import CortinaNumeros from '@/components/CortinaNumeros'
import Costura from '@/components/Costura'
import NumeroContado from '@/components/NumeroContado'
import AcoesInterativas from '@/components/AcoesInterativas'

const heroAtivos = [
  { ticker: 'PETR4', nome: 'Petrobras', score: 92, acao: 'COMPRAR', entrada: '38.50', alvo: '42.00', stop: '36.80', rsi: 45, pl: 4.2 },
  { ticker: 'VALE3', nome: 'Vale S.A.', score: 85, acao: 'COMPRAR', entrada: '62.10', alvo: '70.00', stop: '59.50', rsi: 52, pl: 6.8 },
  { ticker: 'WEGE3', nome: 'WEG S.A.', score: 78, acao: 'OBSERVAR', entrada: '39.80', alvo: '44.00', stop: '37.50', rsi: 58, pl: 32.1 },
]

function RadarPequi() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const S = 420
    canvas.width = S * 2; canvas.height = S * 2; ctx.scale(2, 2)
    const cx = S / 2, cy = S / 2, R = S / 2 - 8
    const pts: { a: number; d: number; forte: boolean }[] = []
    let seed = 7
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    for (let i = 0; i < 42; i++) pts.push({ a: rnd() * Math.PI * 2, d: (0.25 + rnd() * 0.7) * R, forte: rnd() > 0.72 })
    let ang = 0, raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, S, S)
      const nuc = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      nuc.addColorStop(0, 'rgba(240,180,41,0.14)'); nuc.addColorStop(0.55, 'rgba(212,146,10,0.06)'); nuc.addColorStop(1, 'rgba(212,146,10,0.02)')
      ctx.fillStyle = nuc; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(212,146,10,0.20)'; ctx.lineWidth = 1
      for (const f of [0.33, 0.66, 1]) { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke() }
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R)
      ctx.strokeStyle = 'rgba(212,146,10,0.10)'; ctx.stroke()
      if (ctx.createConicGradient) {
        const g = ctx.createConicGradient(ang, cx, cy)
        g.addColorStop(0, 'rgba(240,180,41,0.32)'); g.addColorStop(0.08, 'rgba(240,180,41,0)'); g.addColorStop(1, 'rgba(240,180,41,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang - 0.9, ang); ctx.closePath(); ctx.fill()
      }
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R)
      ctx.strokeStyle = 'rgba(240,180,41,0.8)'; ctx.lineWidth = 1.5; ctx.stroke()
      for (const p of pts) {
        let diff = (ang - p.a) % (Math.PI * 2); if (diff < 0) diff += Math.PI * 2
        const br = Math.max(0, 1 - diff / 1.6)
        const x = cx + Math.cos(p.a) * p.d, y = cy + Math.sin(p.a) * p.d
        const base = p.forte ? 0.5 : 0.18
        ctx.fillStyle = p.forte ? `rgba(240,180,41,${base + br * 0.5})` : `rgba(91,155,255,${base + br * 0.45})`
        ctx.beginPath(); ctx.arc(x, y, p.forte ? 3 + br * 2 : 2, 0, Math.PI * 2); ctx.fill()
        if (p.forte && br > 0.5) { ctx.strokeStyle = `rgba(240,180,41,${(br - 0.5) * 0.7})`; ctx.beginPath(); ctx.arc(x, y, 7 + br * 4, 0, Math.PI * 2); ctx.stroke() }
      }
      ang += 0.012
      if (!reduz) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ width: 420, height: 420, maxWidth: '90vw', maxHeight: '90vw' }} aria-label="Radar varrendo ações da B3" role="img" />
}

function Revela({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect() } }, { threshold: 0.15 })
    o.observe(el); return () => o.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(24px)', transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` }}>{children}</div>
}

export default function Landing() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <style>{`
        .cm-display { font-family: var(--display); font-optical-sizing: auto; letter-spacing: -0.02em; }
        .cm-3col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .cm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .cm-ouro { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        @media (max-width: 860px) {
          .cm-3col { grid-template-columns: 1fr; }
          .cm-stats { grid-template-columns: repeat(2, 1fr); }
          .cm-ouro { grid-template-columns: 1fr; }
          .hero-3d-fruto { display: none; }
        }
        .cm-cta { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #d4920a, #f0b429);
          color: #0a0e14; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none;
          box-shadow: 0 8px 32px rgba(212,146,10,0.35); transition: transform 0.15s, box-shadow 0.15s; }
        .cm-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(212,146,10,0.5); }
        .cm-ghost { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.22);
          color: #e8edf5; padding: 13px 24px; border-radius: 10px; text-decoration: none; font-size: 14px;
          background: rgba(10,14,20,0.4); backdrop-filter: blur(6px); transition: border-color 0.15s, color 0.15s; }
        .cm-ghost:hover { border-color: #f0b429; color: #f0b429; }
        @media (prefers-reduced-motion: reduce) { .cm-cta:hover { transform: none; } }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(7, 10, 15, 0.4)' }}>
        
        {/* Fundo Interativo B3 */}
        <CortinaNumeros som={false} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(120% 90% at 15% 40%, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.60) 45%, rgba(10,14,20,0.30) 100%), linear-gradient(180deg, rgba(10,14,20,0.35) 0%, transparent 35%, rgba(10,14,20,0.95) 100%)' }} />

        {/* 3D Fruto Flutuando no Hero (Lado Direito) */}
        <model-viewer
          src="/pequi%20fruto.glb"
          auto-rotate
          rotation-per-second="4deg"
          camera-controls
          disable-zoom
          interaction-prompt="none"
          exposure="1.2"
          shadow-intensity="1.5"
          style={{ position: 'absolute', top: '15%', right: '-5%', width: '60%', height: '70%', zIndex: 1, opacity: 0.9, transform: 'scale(1.2)', '--poster-color': 'transparent' } as React.CSSProperties}
          className="hero-3d-fruto"
        ></model-viewer>

        {/* header */}
        <header style={{ position: 'relative', zIndex: 4, maxWidth: 1100, width: '100%', margin: '0 auto',
          padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              <model-viewer 
                src="/Meshy_AI_Golden_Geometric_Embl_0722051208_texture.glb" 
                auto-rotate 
                rotation-per-second="10deg" 
                disable-zoom 
                interaction-prompt="none"
                camera-orbit="0deg 90deg 100%"
                style={{ width: '48px', height: '48px', pointerEvents: 'none', transform: 'scale(1.3) translateY(-2px)', '--poster-color': 'transparent' } as React.CSSProperties} 
              ></model-viewer>
            </div>
            <span className="cm-display" style={{ fontWeight: 800, fontSize: 19, color: '#fff' }}>Caryo <span style={{ color: '#f0b429' }}>Map</span></span>
          </div>
          <Link href="/login" className="cm-ghost" style={{ padding: '9px 20px', fontSize: 14 }}>Entrar</Link>
        </header>

        {/* conteúdo do hero */}
        <div style={{ position: 'relative', zIndex: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          maxWidth: 1100, width: '100%', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
          
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 11, color: '#f0b429', letterSpacing: '0.2em', fontWeight: 700,
              fontFamily: 'var(--mono)', marginBottom: 22, textTransform: 'uppercase' }}>
              Inteligência Quantitativa & Curadoria
            </div>
            <h1 className="cm-display" style={{ fontSize: 'clamp(40px, 7vw, 74px)', fontWeight: 900, lineHeight: 1.02, color: '#fff', margin: 0 }}>
              O Radar<br/>Definitivo<br/>
              <span style={{ background: 'linear-gradient(135deg, #f0b429, #d4920a)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                da B3.
              </span>
            </h1>
            <p style={{ color: 'rgba(232,237,245,0.86)', fontSize: 18, lineHeight: 1.6, marginTop: 26, maxWidth: 500 }}>
              Esqueça o ruído. O Caryo Map cruza dados macro, fundamentos e análise técnica para mapear
              as maiores assimetrias do mercado financeiro em tempo real.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap', marginBottom: '4rem' }}>
              <Link href="/login" className="cm-cta">Acessar a Plataforma →</Link>
              <Link href="/backtesting" className="cm-ghost">Verificar Performance</Link>
            </div>
          </div>

          {/* GSAP Pills Interativos na Home (Exibindo 3 Ativos Top) */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Em Destaque Agora</div>
            <AcoesInterativas ativos={heroAtivos} />
          </div>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section style={{ position: 'relative', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'transparent', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,20,0.60), rgba(10,14,20,0.85))', pointerEvents: 'none', zIndex: 0 }} />
        <div className="cm-stats" style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', pointerEvents: 'none', zIndex: 1 }}>
          {[
            { n: '138', l: 'ativos varridos diariamente' },
            { n: '2×', l: 'atualizações por pregão' },
            { n: '15', l: 'setores de mercado analisados' },
            { n: '100%', l: 'de transparência no backtest' },
          ].map(s => (
            <div key={s.l} style={{ padding: '1.75rem 1.5rem', borderLeft: '1px solid var(--border)' }}>
              <NumeroContado valor={s.n} className="cm-display" style={{ display: 'block', fontSize: 34, fontWeight: 900, color: '#f0b429', fontFamily: 'var(--mono)' }} />
              <div style={{ fontSize: 12, color: '#8a9bbf', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem' }}><Costura /></div>

      {/* ── ASSIMETRIAS REAIS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5.5rem 1rem', position: 'relative' }}>
        <Revela>
          <div className="cm-ouro">
            <div style={{ position: 'relative', height: 400, background: 'rgba(10,14,20,0.4)', borderRadius: 16, border: '1px solid var(--border2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 220, height: 220, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                <model-viewer
                  src="/Meshy_AI_Golden_Geometric_Embl_0722051208_texture.glb"
                  auto-rotate
                  rotation-per-second="15deg"
                  disable-zoom
                  interaction-prompt="none"
                  camera-orbit="0deg 90deg 100%"
                  exposure="1"
                  shadow-intensity="1"
                  style={{ width: '320px', height: '320px', transform: 'scale(1.3) translateY(-10px)', '--poster-color': 'transparent' } as React.CSSProperties}
                ></model-viewer>
              </div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 16, boxShadow: 'inset 0 0 80px rgba(240,180,41,0.08)', pointerEvents: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.18em', fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase', marginBottom: 16 }}>
                Precisão & Risco/Retorno
              </div>
              <h2 className="cm-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
                Assimetrias Reais.
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.75, marginTop: 20 }}>
                Encontramos o valor onde a maioria não olha. Nosso sistema filtra centenas de ativos
                diariamente em busca da relação risco/retorno perfeita, combinando momentum de curto 
                prazo com fundamentos sólidos.
              </p>
              <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.75, marginTop: 14 }}>
                Acreditamos na proteção de capital primária. Por isso, todo relatório do radar sai
                com <strong style={{ color: 'var(--text)' }}>stop loss parametrizado antes da entrada</strong>, 
                protegendo seu patrimônio em cenários adversos de liquidez e volatilidade.
              </p>
            </div>
          </div>
        </Revela>
      </section>

      {/* QUEBRA DE SESSÃO GIGANTE - FLOR DO PEQUI */}
      <section style={{ height: 280, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <model-viewer
          src="/flor%20pequi.glb"
          auto-rotate
          rotation-per-second="2deg"
          disable-zoom
          interaction-prompt="none"
          style={{ width: '100%', height: '800px', opacity: 0.12, pointerEvents: 'none', transform: 'scale(1.5)', '--poster-color': 'transparent' } as React.CSSProperties}
        ></model-viewer>
      </section>

      {/* ── OS TRÊS PILARES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 5rem' }}>
        <div className="cm-3col">
          {[
            { emoji: '📊', cor: '#8a9bbf', titulo: 'O Algoritmo', texto: 'Processamento quantitativo bruto da B3: fluxo financeiro, indicadores técnicos, múltiplos fundamentalistas e análise macro.' },
            { emoji: '♟️', cor: '#f0b429', titulo: 'A Mesa', texto: 'Nossa ferramenta de curadoria refinada onde a inteligência humana cruza as teses quantitativas (Nem toda ação passa por ela).' },
            { emoji: '🛡️', cor: '#e53555', titulo: 'A Defesa', texto: 'Controle sistemático de risco. Alvos precisos, dimensionamento adequado e pontos de stop irredutíveis para blindar capital.' },
          ].map((c, i) => (
            <Revela key={c.titulo} delay={i * 120}>
              <div style={{ background: 'rgba(15,21,32,0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(28,37,56,0.6)', borderTop: `3px solid ${c.cor}`, borderRadius: 12, padding: '1.6rem', height: '100%' }}>
                <div style={{ fontSize: 26 }}>{c.emoji}</div>
                <div className="cm-display" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: '10px 0 10px' }}>{c.titulo}</div>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{c.texto}</p>
              </div>
            </Revela>
          ))}
        </div>
      </section>

      {/* ── O RADAR NUNCA PARA (canvas) ── */}
      <section style={{ borderTop: '1px solid rgba(28,37,56,0.5)', background: 'radial-gradient(ellipse at 50% 0%, rgba(212,146,10,0.08), transparent 70%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Revela>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--mono)' }}>
              O fluxo de um dia de pregão
            </div>
            <h2 className="cm-display" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', margin: '0 0 32px' }}>
              O radar opera. As oportunidades se revelam.
            </h2>
          </Revela>
          <RadarPequi />
          <div className="cm-3col" style={{ marginTop: 40, width: '100%' }}>
            {[
              { hora: '08:30', cor: '#5b9bff', titulo: 'Morning Call Analítico', texto: 'Varredura das 138 ações mais líquidas. O sistema processa RSI, médias, MACD, bandas de volatilidade cruzando com a agenda macro do dia.' },
              { hora: '13:00', cor: '#f0b429', titulo: 'Revisão Intraday', texto: 'Com o pregão em andamento, o radar audita rompimentos de preço e volume. O status de cada papel é atualizado ao vivo.' },
              { hora: 'Contínuo', cor: '#00a63c', titulo: 'Rastreabilidade Total', texto: 'Cada sinal de entrada se torna uma operação rastreável até atingir stop loss ou take profit. O backtesting de transparência inclui todas as saídas.' },
            ].map((c, i) => (
              <Revela key={c.hora} delay={i * 120}>
                <div style={{ background: 'rgba(15,21,32,0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(28,37,56,0.6)', borderTop: `3px solid ${c.cor}`, borderRadius: 12, padding: '1.4rem', height: '100%', textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: c.cor, fontWeight: 700 }}>{c.hora}</div>
                  <div className="cm-display" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: '8px 0 10px' }}>{c.titulo}</div>
                  <p style={{ color: 'var(--text2)', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{c.texto}</p>
                </div>
              </Revela>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ position: 'relative', borderTop: '1px solid rgba(28,37,56,0.5)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,20,0.25) 0%, rgba(10,14,20,0.85) 80%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '6rem 1rem', textAlign: 'center' }}>
          <Revela>
            <div style={{ width: 64, height: 64, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '0 auto 20px', filter: 'drop-shadow(0 0 16px rgba(240,180,41,0.5))' }}>
              <model-viewer 
                src="/Meshy_AI_Golden_Geometric_Embl_0722051208_texture.glb" 
                auto-rotate 
                rotation-per-second="10deg" 
                disable-zoom 
                interaction-prompt="none"
                camera-orbit="0deg 90deg 100%"
                style={{ width: '90px', height: '90px', pointerEvents: 'none', transform: 'scale(1.3) translateY(-4px)', '--poster-color': 'transparent' } as React.CSSProperties} 
              ></model-viewer>
            </div>
            <h2 className="cm-display" style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, color: 'var(--text)', margin: 0, lineHeight: 1.05 }}>
              O pregão de hoje<br/>já está no radar.
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, marginTop: 16 }}>
              Relatórios diários quantitativos, recomendações e gerenciamento de risco em um único terminal.
            </p>
            <div style={{ marginTop: 30 }}>
              <Link href="/login" className="cm-cta">Acessar a Plataforma →</Link>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 26 }}>
              Ferramenta educacional quantitativa · Não configura recomendação de investimento
            </p>
          </Revela>
        </div>
      </section>
    </main>
  )
}
