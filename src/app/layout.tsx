import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import FooterLinks from '@/components/FooterLinks'
import BackgroundFX from '@/components/BackgroundFX'

/* Sistema tipográfico "Editorial do Cerrado":
   Fraunces (serifada quente e orgânica) = a voz da marca, o fruto.
   IBM Plex Sans + Mono (engenharia, dígitos tabulares) = o dado, o mercado. */
const display = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-display',
})
const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Caryo Map · Radar de análise da B3',
  description: 'Descascamos o mercado, mapeamos o ouro e blindamos o investidor contra os espinhos. Análise técnica, fundamentalista e macro das ações da B3 — Caryo Map, por Pequi Estúdio.',
  icons: { icon: '/icone-pequi.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <AuthProvider>
          <BackgroundFX />
          {children}

          <footer style={{
            borderTop: '1px solid #1c2538',
            marginTop: '5rem',
            padding: '2rem 1rem',
          }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icone-pequi.png" alt="Caryo Map" width={34} height={34} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(240,180,41,0.3))' }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Caryo <span style={{ color: '#f0b429' }}>Map</span></div>
                    <div style={{ fontSize: 11, color: '#4d5f7a', marginTop: 1 }}>por Pequi Estúdio · Brasília, DF</div>
                  </div>
                </div>
                <FooterLinks />
              </div>

              <div style={{ borderTop: '1px solid #1c2538', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p style={{ color: '#2d3a4f', fontSize: 12 }}>
                  Não é recomendação de investimento · Ferramenta educacional ·{' '}
                  <a href="/termos" style={{ color: '#4d5f7a', textDecoration: 'underline' }}>Termos & Avisos</a>
                </p>
                <p style={{ color: '#2d3a4f', fontSize: 11, fontFamily: 'var(--mono)' }}>© 2026 Caryo Map · Pequi Estúdio</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
