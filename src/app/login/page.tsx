'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PequiIcon from '@/components/PequiIcon'

export default function LoginPage() {
  const { user, login, cadastrar } = useAuth()
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [capital, setCapital] = useState('10000')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    setTimeout(() => {
      if (modo === 'login') {
        const r = login(nome, senha)
        if (r === 'ok') router.replace('/')
        else if (r === 'nao_encontrado') setErro('Usuário não encontrado. Crie uma conta.')
        else setErro('Senha incorreta.')
      } else {
        if (!nome.trim() || !senha) { setErro('Preencha todos os campos.'); setLoading(false); return }
        if (senha.length < 4) { setErro('Senha deve ter pelo menos 4 caracteres.'); setLoading(false); return }
        const cap = parseFloat(capital.replace(',', '.'))
        if (isNaN(cap) || cap < 100) { setErro('Capital deve ser pelo menos R$ 100.'); setLoading(false); return }
        const r = cadastrar(nome, senha, cap)
        if (r === 'ok') router.replace('/')
        else setErro('Nome de usuário já existe. Escolha outro.')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <PequiIcon size={64} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.03em', marginTop: '0.75rem' }}>
            B3 Radar
          </h1>
          <span style={{ fontSize: '0.72rem', color: '#d4a017', background: '#d4a01720', border: '1px solid #d4a01740', borderRadius: 4, padding: '0.2rem 0.6rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            PEQUI ESTÚDIO
          </span>
          <p style={{ color: '#5a7a60', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Análise técnica · Macro · Geopolítica
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#0d1a10', border: '1px solid #1a2e1e', borderRadius: 16, padding: '2rem' }}>

          {/* Toggle */}
          <div style={{ display: 'flex', background: '#07100a', border: '1px solid #1a2e1e', borderRadius: 10, padding: '0.25rem', marginBottom: '1.75rem' }}>
            {(['login', 'cadastro'] as const).map(m => (
              <button key={m} onClick={() => { setModo(m); setErro('') }} style={{
                flex: 1, padding: '0.55rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.15s',
                background: modo === m ? '#009c3b' : 'transparent',
                color: modo === m ? '#fff' : '#5a7a60',
              }}>
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                Nome de usuário
              </label>
              <input
                value={nome} onChange={e => setNome(e.target.value)}
                placeholder="ex: isadora"
                autoComplete="username"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                Senha
              </label>
              <input
                type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                style={inputStyle}
                required
              />
            </div>

            {modo === 'cadastro' && (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#5a7a60', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                  Capital para investir (R$)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#5a7a60', fontSize: '0.88rem' }}>R$</span>
                  <input
                    type="number" value={capital} onChange={e => setCapital(e.target.value)}
                    min="100" step="100"
                    style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                  />
                </div>
                <p style={{ color: '#5a7a60', fontSize: '0.72rem', marginTop: '0.35rem' }}>
                  Você pode alterar isso depois no perfil.
                </p>
              </div>
            )}

            {erro && (
              <div style={{ background: '#ff446615', border: '1px solid #cc224440', borderRadius: 8, padding: '0.65rem 0.9rem', color: '#ff4466', fontSize: '0.83rem' }}>
                {erro}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: '0.5rem',
              background: loading ? '#1a2e1e' : '#009c3b',
              color: loading ? '#5a7a60' : '#fff',
              border: 'none', borderRadius: 10, padding: '0.85rem',
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}>
              {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#5a7a60', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Não é recomendação de investimento · Pequi Estúdio © 2026
        </p>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#07100a',
  border: '1px solid #1a2e1e',
  borderRadius: 8,
  padding: '0.7rem 0.9rem',
  color: '#e8f5e9',
  fontSize: '0.92rem',
  outline: 'none',
  boxSizing: 'border-box',
}
