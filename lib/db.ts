import type { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'

let db: DatabaseType | null = null

function getDb(): DatabaseType | null {
  if (typeof window !== 'undefined') return null

  try {
    // Dynamic require so it doesn't fail if native binary isn't built (Windows dev)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3')
    if (!db) {
      const dbPath = path.join(process.cwd(), 'leads.db')
      db = new Database(dbPath) as DatabaseType
      ;(db as DatabaseType).exec(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          empresa TEXT,
          email TEXT NOT NULL,
          whatsapp TEXT,
          assunto TEXT,
          mensagem TEXT,
          ip TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)
    }
    return db
  } catch {
    return null
  }
}

export interface LeadData {
  nome: string
  empresa?: string
  email: string
  whatsapp: string
  assunto: string
  mensagem: string
  ip?: string
}

export function saveLead(data: LeadData): void {
  const database = getDb()
  if (!database) return

  const stmt = database.prepare(`
    INSERT INTO leads (nome, empresa, email, whatsapp, assunto, mensagem, ip)
    VALUES (@nome, @empresa, @email, @whatsapp, @assunto, @mensagem, @ip)
  `)
  stmt.run(data)
}
