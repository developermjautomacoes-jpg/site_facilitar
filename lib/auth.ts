import crypto from 'crypto'

// Formato novo: scrypt$<salt hex>$<hash hex>
// Formato legado (aceito só para migrar): SHA-256 hex de 64 caracteres, sem sal.

const KEYLEN = 64

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, KEYLEN)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function isLegacyHash(stored: string): boolean {
  return /^[0-9a-f]{64}$/i.test(stored)
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false

  if (stored.startsWith('scrypt$')) {
    const [, saltHex, hashHex] = stored.split('$')
    if (!saltHex || !hashHex) return false
    const expected = Buffer.from(hashHex, 'hex')
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
    return safeEqual(actual, expected)
  }

  if (isLegacyHash(stored)) {
    const actual = crypto.createHash('sha256').update(password).digest()
    return safeEqual(actual, Buffer.from(stored, 'hex'))
  }

  return false
}
