import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Por favor, preencha todos os campos.' },
        { status: 400 }
      )
    }

    const user = getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'E-mail ou senha incorretos.' },
        { status: 401 }
      )
    }

    // Check if client account is deactivated
    if (user.role === 'client' && user.active === false) {
      return NextResponse.json(
        { success: false, message: 'Seu acesso está temporariamente desativado. Entre em contato com a Facilitar.' },
        { status: 403 }
      )
    }

    const isValid = verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'E-mail ou senha incorretos.' },
        { status: 401 }
      )
    }

    // Success response - omit password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        whatsapp: user.whatsapp,
        active: user.active !== false,
      },
    })
  } catch (err) {
    console.error('Login API error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}
