import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B3 Radar · Pequi Estúdio',
  description: 'Análise técnica e geopolítica de ações da B3 — by Pequi Estúdio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <footer style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          borderTop: '1px solid #1a2e1e',
          color: '#5a7a60',
          fontSize: '0.78rem',
          marginTop: '4rem',
          letterSpacing: '0.05em',
        }}>
          🌿 Pequi Estúdio · B3 Radar · Não é recomendação de investimento
        </footer>
      </body>
    </html>
  )
}
