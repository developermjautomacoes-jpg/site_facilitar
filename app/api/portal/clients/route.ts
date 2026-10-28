import { NextRequest, NextResponse } from 'next/server'
import { listClients, createClient, getUserByEmail } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

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
    const clients = listClients()
    return NextResponse.json({ success: true, clients })
  } catch (err) {
    console.error('List clients error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao listar clientes.' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { success: false, message: 'Acesso não autorizado.' },
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const { name, email, password, company, whatsapp } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Nome, E-mail e Senha são obrigatórios.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Já existe um usuário cadastrado com este e-mail.' },
        { status: 409 }
      )
    }

    const passwordHash = hashPassword(password)

    createClient({
      name,
      email,
      password: passwordHash,
      company,
      whatsapp,
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente cadastrado com sucesso!',
    })
  } catch (err) {
    console.error('Create client error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao cadastrar cliente.' },
      { status: 500 }
    )
  }
}
