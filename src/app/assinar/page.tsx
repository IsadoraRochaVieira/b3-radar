import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Planos pausados · Caryo Map', robots: { index: false, follow: false } }

export default function AssinarPage() {
  return <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
    <section style={{ maxWidth: 580, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
      <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '.14em', fontWeight: 700 }}>FASE DE DESENVOLVIMENTO</div>
      <h1 className="mono" style={{ color: 'var(--text)', margin: '12px 0' }}>Planos e pagamentos pausados</h1>
      <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>O Caryo Map está restrito ao uso interno enquanto passa por revisão regulatória. Não há versão Pro, gratuita, assinatura ou cobrança ativa.</p>
      <Link href="/painel" className="cm-cta" style={{ display: 'inline-flex', marginTop: 16 }}>Voltar ao painel</Link>
    </section>
  </main>
}
