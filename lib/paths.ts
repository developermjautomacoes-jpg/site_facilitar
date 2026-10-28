import path from 'path'

/**
 * Pastas de dados persistentes.
 * Em produção (Easypanel/Docker) aponte DATA_DIR para o volume montado, ex.: /app/storage
 * Em desenvolvimento usa ./data e ./data/uploads.
 */
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data')

export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(DATA_DIR, 'uploads')

export function dataFile(name: string): string {
  return path.join(DATA_DIR, name)
}
