import { NextResponse } from 'next/server'
import { ACCESS_COOKIE, safeReturnTo, secretsMatch } from '../../../lib/access'

export async function POST(request: Request) {
  const form = await request.formData()
  const password = String(form.get('password') ?? '').slice(0, 128)
  const expected = process.env.CARYO_ACCESS_PASSWORD
  const session = process.env.CARYO_ACCESS_SESSION
  const returnTo = safeReturnTo(form.get('next'))
  if (!expected || !session) return NextResponse.redirect(new URL('/acesso?erro=config', request.url), 303)
  if (!(await secretsMatch(password, expected))) {
    const failed = new URL('/acesso', request.url); failed.searchParams.set('erro', 'senha'); failed.searchParams.set('next', returnTo)
    return NextResponse.redirect(failed, 303)
  }
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303)
  response.cookies.set(ACCESS_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 8 })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
