import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/session'
import { listLeads } from '@/lib/db'

function isAdmin(req: NextRequest): boolean {
  return isAdminRequest(req)
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { success: false, message: 'Acesso não autorizado.' },
      { status: 403 }
    )
  }

  try {
    const leads = listLeads()
    return NextResponse.json({ success: true, leads })
  } catch (err) {
    console.error('List leads error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao listar contatos.' },
      { status: 500 }
    )
  }
}
