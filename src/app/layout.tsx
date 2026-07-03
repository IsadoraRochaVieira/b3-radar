import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import PequiIcon from '@/components/PequiIcon'
import FooterLinks from '@/components/FooterLinks'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'B3 Radar · Pequi Estúdio',
  description: 'Análise técnica e geopolítica de ações da B3 — by Pequi Estúdio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}

          <footer style={{
            borderTop: '1px solid #162b1a',
            marginTop: '5rem',
            padding: '2.5rem 1rem',
            background: 'linear-gradient(to top, rgba(0,39,118,0.06), transparent)',
          }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PequiIcon size={32} />
                  <div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #e2f0e4, #00c44a)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.02em',
                    }}>B3 Radar</div>
                    <div style={{ color: '#4a6a52', fontSize: '0.7rem', marginTop: 1 }}>by Pequi Estúdio · Brasília, DF</div>
                  </div>
                </div>

                <FooterLinks />
              </div>

              <div style={{ borderTop: '1px solid #162b1a', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p style={{ color: '#2e4a34', fontSize: '0.72rem' }}>
                  Não é recomendação de investimento · Use com responsabilidade · Dados meramente educacionais
                </p>
                <p style={{ color: '#2e4a34', fontSize: '0.7rem' }}>© 2026 Pequi Estúdio</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
