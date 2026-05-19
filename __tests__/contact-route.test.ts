import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/email', () => ({ sendContactEmail: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/lib/db', () => ({ saveLead: vi.fn() }))
vi.mock('@/lib/rateLimit', () => ({ checkRateLimit: vi.fn().mockReturnValue(true) }))

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextRequest: class MockNextRequest {
      headers: Headers
      _body: unknown
      url: string
      constructor(url: string, init: RequestInit) {
        this.headers = new Headers(init.headers as Record<string, string>)
        this._body = init.body
        this.url = url
      }
      async json() { return JSON.parse(this._body as string) }
    },
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  }
})

import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validBody = {
  nome: 'João Silva',
  empresa: 'Empresa Teste',
  email: 'joao@empresa.com',
  whatsapp: '(27) 99999-9999',
  assunto: 'Orçamento',
  mensagem: 'Gostaria de um orçamento completo.',
  website: '',
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 for valid data', async () => {
    const res = await POST(makeRequest(validBody) as unknown as import('next/server').NextRequest)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 422 for invalid email', async () => {
    const res = await POST(makeRequest({ ...validBody, email: 'bad' }) as unknown as import('next/server').NextRequest)
    expect(res.status).toBe(422)
  })

  it('returns 422 when honeypot filled', async () => {
    const res = await POST(makeRequest({ ...validBody, website: 'http://bot.com' }) as unknown as import('next/server').NextRequest)
    expect(res.status).toBe(422)
  })

  it('returns 429 when rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/rateLimit')
    vi.mocked(checkRateLimit).mockReturnValueOnce(false)
    const res = await POST(makeRequest(validBody) as unknown as import('next/server').NextRequest)
    expect(res.status).toBe(429)
  })
})
