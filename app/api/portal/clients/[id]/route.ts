import { NextRequest, NextResponse } from 'next/server'
import { deleteUser, getUserByEmail, updateClient } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// Helper to verify if the requester is an admin
function isAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email')
  if (!adminEmail) return false

  const user = getUserByEmail(adminEmail)
  return user !== null && user.role === 'admin'
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

    const body = await req.json()
    const { name, email, company, whatsapp, password, active } = body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (company !== undefined) updateData.company = company
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp
    if (password !== undefined && password !== '') updateData.password = hashPassword(password)
    if (active !== undefined) updateData.active = active

    const updated = updateClient(numericId, updateData)

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente atualizado com sucesso!',
      client: updated,
    })
  } catch (err) {
    console.error('Update client error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao atualizar cliente.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    deleteUser(numericId)

    return NextResponse.json({
      success: true,
      message: 'Cliente excluído com sucesso!',
    })
  } catch (err) {
    console.error('Delete client error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao excluir cliente.' },
      { status: 500 }
    )
  }
}
