import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import path from 'path'
import fs from 'fs'

function isAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email')
  if (!adminEmail) return false
  const user = getUserByEmail(adminEmail)
  return user !== null && user.role === 'admin'
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'ead')
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
