import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/session'
import { markNotificationResolved } from '@/lib/db'

function isAdmin(req: NextRequest): boolean {
  return isAdminRequest(req)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { success: false, message: 'Acesso não autorizado.' },
      { status: 403 }
    )
  }

  try {
    const { id } = await params
    const numericId = parseInt(id, 10)

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido.' },
        { status: 400 }
      )
    }

    const resolved = markNotificationResolved(numericId)

    if (!resolved) {
      return NextResponse.json(
        { success: false, message: 'Notificação não encontrada.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notificação marcada como resolvida!',
    })
  } catch (err) {
    console.error('Update notification error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao atualizar notificação.' },
      { status: 500 }
    )
  }
}
