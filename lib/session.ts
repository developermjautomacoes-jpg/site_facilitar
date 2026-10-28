import crypto from 'crypto'
import type { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, type UserData } from './db'

export const SESSION_COOKIE = 'facilitar_session'
const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 horas

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.CSRF_SECRET
  if (secret && secret.length >= 32) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET (mínimo 32 caracteres) não configurado.')
  }
  return 'dev-only-secret-nao-usar-em-producao-000000'
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function createSessionToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function readToken(token: string | undefined): string | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email?: string; exp?: number }
    if (!data.email || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
    return data.email
  } catch {
    return null
  }
}

/** Usuário logado (pelo cookie assinado), ou null. Clientes desativados não contam. */
export function getSessionUser(req: NextRequest): UserData | null {
  const email = readToken(req.cookies.get(SESSION_COOKIE)?.value)
  if (!email) return null
  const user = getUserByEmail(email)
  if (!user) return null
  if (user.role === 'client' && user.active === false) return null
  return user
}

export function isAdminRequest(req: NextRequest): boolean {
  return getSessionUser(req)?.role === 'admin'
}

export function setSessionCookie(res: NextResponse, email: string): void {
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}
