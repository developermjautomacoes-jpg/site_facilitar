import { NextRequest, NextResponse } from 'next/server'
import { getStudentProgress, toggleLessonCompletion } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email') || req.headers.get('x-user-email')

    if (!email) {
      return NextResponse.json({ success: false, message: 'E-mail do usuário não fornecido.' }, { status: 400 })
    }

    const completed = getStudentProgress(email)
    return NextResponse.json({ success: true, completedLessons: completed })
  } catch (err) {
    console.error('GET progress error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao obter progresso.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, moduleId, lessonId, completed } = body

    if (!email || !moduleId || !lessonId) {
      return NextResponse.json({ success: false, message: 'Dados incompletos.' }, { status: 400 })
    }

    const updated = toggleLessonCompletion(email, moduleId, lessonId, completed)
    return NextResponse.json({ success: true, completedLessons: updated })
  } catch (err) {
    console.error('POST progress error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao salvar progresso.' }, { status: 500 })
  }
}
