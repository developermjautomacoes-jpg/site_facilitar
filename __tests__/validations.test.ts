import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validations'

describe('contactSchema', () => {
  const valid = {
    nome: 'João Silva',
    empresa: 'Empresa Teste',
    email: 'joao@empresa.com',
    whatsapp: '(27) 99999-9999',
    assunto: 'Orçamento',
    mensagem: 'Gostaria de um orçamento para abertura de empresa.',
    website: '',
  }

  it('accepts valid input', () => {
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects empty nome', () => {
    const result = contactSchema.safeParse({ ...valid, nome: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects mensagem too short', () => {
    const result = contactSchema.safeParse({ ...valid, mensagem: 'curto' })
    expect(result.success).toBe(false)
  })

  it('rejects honeypot filled', () => {
    const result = contactSchema.safeParse({ ...valid, website: 'http://bot.com' })
    expect(result.success).toBe(false)
  })

  it('accepts empresa as optional', () => {
    const { empresa, ...noEmpresa } = valid
    const result = contactSchema.safeParse({ ...noEmpresa, website: '' })
    expect(result.success).toBe(true)
  })
})
