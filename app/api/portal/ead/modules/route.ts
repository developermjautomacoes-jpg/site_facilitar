import { NextRequest, NextResponse } from 'next/server'
import { listEadModules, createEadModule, getUserByEmail } from '@/lib/db'

function isAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email')
  if (!adminEmail) return false
  const user = getUserByEmail(adminEmail)
  return user !== null && user.role === 'admin'
}

export async function GET(req: NextRequest) {
  try {
    const modules = listEadModules()
    return NextResponse.json({ success: true, modules })
  } catch (err) {
    console.error('GET modules error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao listar módulos.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Não autorizado.' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, description } = body
    if (!title) {
      return NextResponse.json({ success: false, message: 'Título é obrigatório.' }, { status: 400 })
    }

    const newModule = createEadModule(title, description || '')
    return NextResponse.json({ success: true, module: newModule })
  } catch (err) {
    console.error('POST modules error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao criar módulo.' }, { status: 500 })
  }
}
