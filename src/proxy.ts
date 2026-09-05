import { NextRequest, NextResponse } from 'next/server'
import { ACCESS_COOKIE } from './lib/access'

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/acesso' || pathname === '/api/access') return NextResponse.next()
  const token = process.env.CARYO_ACCESS_SESSION
  if (token && request.cookies.get(ACCESS_COOKIE)?.value === token) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }
  const login = new URL('/acesso', request.url)
  login.searchParams.set('next', `${pathname}${search}`)
  return NextResponse.redirect(login, 307)
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
