import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, updateClientPassword } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, currentPassword, newPassword } = body

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'A nova senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      )
    }

    const user = getUserByEmail(email)
    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado.' },
        { status: 404 }
      )
    }

    if (!verifyPassword(currentPassword, user.password)) {
      return NextResponse.json(
        { success: false, message: 'Senha atual incorreta.' },
        { status: 401 }
      )
    }

    const newHash = hashPassword(newPassword)
    const updated = updateClientPassword(email, newHash)

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar a senha.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso!',
    })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}
