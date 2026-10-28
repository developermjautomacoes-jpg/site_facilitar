import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/session'
import path from 'path'
import fs from 'fs'
import { UPLOADS_DIR } from '@/lib/paths'

function isAdmin(req: NextRequest): boolean {
  return isAdminRequest(req)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Não autorizado.' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(UPLOADS_DIR, 'ead')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Sanitize filename to avoid weird character issues
    const safeName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filePath = path.join(uploadDir, safeName)

    await fs.promises.writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/ead/${safeName}`,
      name: file.name
    })
  } catch (err) {
    console.error('File upload error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao fazer upload do arquivo.' }, { status: 500 })
  }
}
