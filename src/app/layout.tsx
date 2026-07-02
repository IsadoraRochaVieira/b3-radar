import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import PequiIcon from '@/components/PequiIcon'

const inter = Inter({ subsets: ['latin'] })

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
            borderTop: '1px solid #1a2e1e',
            marginTop: '4rem',
            padding: '2rem 1rem',
          }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <PequiIcon size={28} />
                <div>
                  <div style={{ color: '#e8f5e9', fontSize: '0.85rem', fontWeight: 700 }}>B3 Radar</div>
                  <div style={{ color: '#5a7a60', fontSize: '0.72rem' }}>by Pequi Estúdio</div>
                </div>
              </div>
              <p style={{ color: '#5a7a60', fontSize: '0.75rem', textAlign: 'center', flex: 1 }}>
                Não é recomendação de investimento · Use com responsabilidade
              </p>
              <p style={{ color: '#1a2e1e', fontSize: '0.72rem' }}>© 2026 Pequi Estúdio</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
