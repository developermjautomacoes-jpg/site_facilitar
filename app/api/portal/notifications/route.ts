import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, listNotifications, createNotification } from '@/lib/db'

// Helper to verify if the requester is an admin
function isAdmin(req: NextRequest): boolean {
  const adminEmail = req.headers.get('x-admin-email')
  if (!adminEmail) return false

  const user = getUserByEmail(adminEmail)
  return user !== null && user.role === 'admin'
}

// GET - Admin: list all notifications
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { success: false, message: 'Acesso não autorizado.' },
      { status: 403 }
    )
  }

  try {
    const notifications = listNotifications()
    return NextResponse.json({ success: true, notifications })
  } catch (err) {
    console.error('List notifications error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao listar notificações.' },
      { status: 500 }
    )
  }
}

// POST - Public: client requests password reset (creates notification for admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'E-mail é obrigatório.' },
        { status: 400 }
      )
    }

    const user = getUserByEmail(email)
    if (!user || user.role !== 'client') {
      // Return success even if not found (security: don't reveal if email exists)
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, a solicitação foi enviada.',
      })
    }

    createNotification({
      type: 'password_reset',
      clientEmail: user.email,
      clientName: user.name,
      message: `O cliente ${user.name} (${user.email}) solicitou a redefinição de senha.`,
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitação enviada! A Facilitar irá redefinir sua senha e entrar em contato.',
    })
  } catch (err) {
    console.error('Create notification error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao enviar solicitação.' },
      { status: 500 }
    )
  }
}
