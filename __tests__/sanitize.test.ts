import { describe, it, expect } from 'vitest'
import { sanitizeField, sanitizeContactData } from '@/lib/sanitize'

describe('sanitizeField', () => {
  it('strips HTML tags', () => {
    expect(sanitizeField('<script>alert(1)</script>Olá')).toBe('Olá')
  })

  it('preserves plain text', () => {
    expect(sanitizeField('João Silva')).toBe('João Silva')
  })

  it('strips XSS attempts', () => {
    expect(sanitizeField('<img src=x onerror=alert(1)>texto')).toBe('texto')
  })
})

describe('sanitizeContactData', () => {
  it('sanitizes all fields', () => {
    const input = {
      nome: '<b>João</b>',
      email: 'joao@test.com',
      whatsapp: '(27) 99999-9999',
      assunto: '<em>Orçamento</em>',
      mensagem: '<script>xss</script>Mensagem normal',
      website: '',
    }
    const result = sanitizeContactData(input)
    expect(result.nome).toBe('João')
    expect(result.assunto).toBe('Orçamento')
    expect(result.mensagem).toBe('Mensagem normal')
  })
})
