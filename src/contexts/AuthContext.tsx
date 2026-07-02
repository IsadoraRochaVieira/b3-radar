'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type User = {
  nome: string
  capital: number
  createdAt: string
}

type AuthCtx = {
  user: User | null
  login: (nome: string, senha: string) => 'ok' | 'senha_errada' | 'nao_encontrado'
  cadastrar: (nome: string, senha: string, capital: number) => 'ok' | 'ja_existe'
  logout: () => void
  atualizarCapital: (capital: number) => void
}

const Ctx = createContext<AuthCtx | null>(null)

const KEY_USERS = 'b3radar_users'
const KEY_SESSION = 'b3radar_session'

type StoredUser = User & { senha: string }

function getUsers(): Record<string, StoredUser> {
  try { return JSON.parse(localStorage.getItem(KEY_USERS) || '{}') } catch { return {} }
}
function setUsers(u: Record<string, StoredUser>) {
  localStorage.setItem(KEY_USERS, JSON.stringify(u))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const s = localStorage.getItem(KEY_SESSION)
    if (s) {
      try {
        const u = JSON.parse(s) as User
        setUser(u)
      } catch { localStorage.removeItem(KEY_SESSION) }
    }
  }, [])

  const login = (nome: string, senha: string): 'ok' | 'senha_errada' | 'nao_encontrado' => {
    const users = getUsers()
    const key = nome.trim().toLowerCase()
    const stored = users[key]
    if (!stored) return 'nao_encontrado'
    if (stored.senha !== senha) return 'senha_errada'
    const u: User = { nome: stored.nome, capital: stored.capital, createdAt: stored.createdAt }
    setUser(u)
    localStorage.setItem(KEY_SESSION, JSON.stringify(u))
    return 'ok'
  }

  const cadastrar = (nome: string, senha: string, capital: number): 'ok' | 'ja_existe' => {
    const users = getUsers()
    const key = nome.trim().toLowerCase()
    if (users[key]) return 'ja_existe'
    const u: StoredUser = { nome: nome.trim(), senha, capital, createdAt: new Date().toISOString() }
    users[key] = u
    setUsers(users)
    const session: User = { nome: u.nome, capital: u.capital, createdAt: u.createdAt }
    setUser(session)
    localStorage.setItem(KEY_SESSION, JSON.stringify(session))
    return 'ok'
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(KEY_SESSION)
  }

  const atualizarCapital = (capital: number) => {
    if (!user) return
    const users = getUsers()
    const key = user.nome.trim().toLowerCase()
    if (users[key]) { users[key].capital = capital; setUsers(users) }
    const updated = { ...user, capital }
    setUser(updated)
    localStorage.setItem(KEY_SESSION, JSON.stringify(updated))
  }

  return <Ctx.Provider value={{ user, login, cadastrar, logout, atualizarCapital }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
