import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { UPLOADS_DIR } from '@/lib/paths'
import { getSessionUser } from '@/lib/session'

// Serve os arquivos enviados pelo portal (aulas do EAD) a partir do volume persistente.
// As URLs antigas /uploads/... chegam aqui pelo rewrite do next.config.ts.
// Só usuários logados no portal têm acesso.

const MIME: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!getSessionUser(req)) {
    return new NextResponse('Não autorizado', { status: 401 })
  }

  const { path: parts } = await params
  const root = path.resolve(UPLOADS_DIR)
  const filePath = path.resolve(root, ...parts)
  if (!filePath.startsWith(root + path.sep)) {
    return new NextResponse('Não encontrado', { status: 404 })
  }

  let stat: fs.Stats
  try {
    stat = await fs.promises.stat(filePath)
    if (!stat.isFile()) throw new Error('not a file')
  } catch {
    return new NextResponse('Não encontrado', { status: 404 })
  }

  const contentType = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
  const baseHeaders = {
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=3600',
  }

  // Suporte a Range para o player de vídeo conseguir avançar/voltar
  const range = req.headers.get('range')
  const match = range?.match(/^bytes=(\d*)-(\d*)$/)
  if (match) {
    const start = match[1] ? parseInt(match[1], 10) : 0
    const end = match[2] ? Math.min(parseInt(match[2], 10), stat.size - 1) : stat.size - 1
    if (start > end || start >= stat.size) {
      return new NextResponse(null, { status: 416, headers: { 'Content-Range': `bytes */${stat.size}` } })
    }
    const stream = fs.createReadStream(filePath, { start, end })
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Content-Length': String(end - start + 1),
      },
    })
  }

  const stream = fs.createReadStream(filePath)
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: { ...baseHeaders, 'Content-Length': String(stat.size) },
  })
}
