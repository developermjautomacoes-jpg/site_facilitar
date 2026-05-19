import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sanitizeContactData } from '@/lib/sanitize'
import { checkRateLimit } from '@/lib/rateLimit'
import { saveLead } from '@/lib/db'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Dados inválidos.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Dados inválidos.', errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const safe = sanitizeContactData(parsed.data as Record<string, string>)

  const lead = {
    nome: safe.nome,
    empresa: safe.empresa,
    email: safe.email,
    whatsapp: safe.whatsapp,
    assunto: safe.assunto,
    mensagem: safe.mensagem,
    ip,
  }

  try { saveLead(lead) } catch { /* silently skip if SQLite unavailable */ }

  try {
    await sendContactEmail(lead)
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao enviar mensagem. Tente novamente ou ligue para (27) 3068-8502.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: 'Mensagem enviada com sucesso!' })
}
