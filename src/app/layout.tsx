import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
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
            borderTop: '1px solid #1c2538',
            marginTop: '5rem',
            padding: '2rem 1rem',
          }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32,
                    background: 'linear-gradient(135deg, #1052cc, #2563eb)',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: '#fff',
                    fontFamily: 'var(--mono)',
                  }}>B3</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.02em' }}>B3 Radar</div>
                    <div style={{ fontSize: 11, color: '#4d5f7a', marginTop: 1 }}>by Pequi Estúdio · Brasília, DF</div>
                  </div>
                </div>
                <FooterLinks />
              </div>

              <div style={{ borderTop: '1px solid #1c2538', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p style={{ color: '#2d3a4f', fontSize: 12 }}>
                  Não é recomendação de investimento · Dados meramente educacionais
                </p>
                <p style={{ color: '#2d3a4f', fontSize: 11, fontFamily: 'var(--mono)' }}>© 2026 Pequi Estúdio</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
