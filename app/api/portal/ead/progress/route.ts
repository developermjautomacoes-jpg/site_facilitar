import { NextRequest, NextResponse } from 'next/server'
import { getStudentProgress, toggleLessonCompletion } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

const unauthorized = () =>
  NextResponse.json({ success: false, message: 'Faça login novamente.' }, { status: 401 })

export async function GET(req: NextRequest) {
  try {
    const user = getSessionUser(req)
    if (!user) return unauthorized()

    const completed = getStudentProgress(user.email)
    return NextResponse.json({ success: true, completedLessons: completed })
  } catch (err) {
    console.error('GET progress error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao obter progresso.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUser(req)
    if (!user) return unauthorized()

    const body = await req.json()
    const { moduleId, lessonId, completed } = body

    if (!moduleId || !lessonId) {
      return NextResponse.json({ success: false, message: 'Dados incompletos.' }, { status: 400 })
    }

    const updated = toggleLessonCompletion(user.email, moduleId, lessonId, completed)
    return NextResponse.json({ success: true, completedLessons: updated })
  } catch (err) {
    console.error('POST progress error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao salvar progresso.' }, { status: 500 })
  }
}
