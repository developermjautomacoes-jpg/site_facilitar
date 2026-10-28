import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, isAdminRequest } from '@/lib/session'
import { listEadModules, createEadModule } from '@/lib/db'

function isAdmin(req: NextRequest): boolean {
  return isAdminRequest(req)
}

export async function GET(req: NextRequest) {
  if (!getSessionUser(req)) {
    return NextResponse.json({ success: false, message: 'Faça login novamente.' }, { status: 401 })
  }
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
