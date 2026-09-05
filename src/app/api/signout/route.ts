import { NextResponse } from 'next/server'
import { ACCESS_COOKIE } from '../../../lib/access'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/acesso', request.url), 303)
  response.cookies.set(ACCESS_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
  return response
}
