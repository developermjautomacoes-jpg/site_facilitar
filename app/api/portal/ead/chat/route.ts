import { NextRequest, NextResponse } from 'next/server'
import { getEadChatForLesson, listAllEadChats, postEadChatMessage, replyEadChatMessage } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true'

    if (all) {
      const chats = listAllEadChats()
      return NextResponse.json({ success: true, chats })
    }

    const moduleIdStr = searchParams.get('moduleId')
    const lessonId = searchParams.get('lessonId')

    if (!moduleIdStr || !lessonId) {
      return NextResponse.json({ success: false, message: 'Dados insuficientes para carregar chat.' }, { status: 400 })
    }

    const moduleId = parseInt(moduleIdStr, 10)
    if (isNaN(moduleId)) {
      return NextResponse.json({ success: false, message: 'ID do módulo inválido.' }, { status: 400 })
    }

    const chats = getEadChatForLesson(moduleId, lessonId)
    return NextResponse.json({ success: true, chats })
  } catch (err) {
    console.error('GET chat error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao carregar chat.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'post_message') {
      const { moduleId, lessonId, email, name, role, message } = body
      if (!moduleId || !lessonId || !email || !name || !role || !message) {
        return NextResponse.json({ success: false, message: 'Campos obrigatórios ausentes.' }, { status: 400 })
      }
      const msg = postEadChatMessage(parseInt(moduleId, 10), lessonId, email, name, role, message)
      return NextResponse.json({ success: true, chat: msg })
    }

    if (action === 'reply_message') {
      const { messageId, name, role, message } = body
      if (!messageId || !name || !role || !message) {
        return NextResponse.json({ success: false, message: 'Campos obrigatórios ausentes.' }, { status: 400 })
      }
      const updated = replyEadChatMessage(parseInt(messageId, 10), name, role, message)
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Mensagem não encontrada.' }, { status: 404 })
      }
      return NextResponse.json({ success: true, chat: updated })
    }

    return NextResponse.json({ success: false, message: 'Ação inválida.' }, { status: 400 })
  } catch (err) {
    console.error('POST chat error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao enviar mensagem.' }, { status: 500 })
  }
}
