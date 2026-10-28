import { NextRequest, NextResponse } from 'next/server'
import { listLeads, getUserByEmail } from '@/lib/db'

// Helper to verify if the requester is an admin
function isAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email')
  if (!adminEmail) return false

  const user = getUserByEmail(adminEmail)
  return user !== null && user.role === 'admin'
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
