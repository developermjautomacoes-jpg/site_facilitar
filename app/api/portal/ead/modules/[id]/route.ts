import { NextRequest, NextResponse } from 'next/server'
import {
  getUserByEmail,
  updateEadModule,
  deleteEadModule,
  addEadLesson,
  updateEadLesson,
  deleteEadLesson
} from '@/lib/db'

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
    return NextResponse.json({ success: false, message: 'Não autorizado.' }, { status: 403 })
  }

  try {
    const { id } = await params
    const moduleId = parseInt(id, 10)
    if (isNaN(moduleId)) {
      return NextResponse.json({ success: false, message: 'ID inválido.' }, { status: 400 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'update_module') {
      const { title, description } = body
      if (!title) {
        return NextResponse.json({ success: false, message: 'Título é obrigatório.' }, { status: 400 })
      }
      const updated = updateEadModule(moduleId, title, description || '')
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Módulo não encontrado.' }, { status: 404 })
      }
      return NextResponse.json({ success: true, module: updated })
    }

    if (action === 'add_lesson') {
      const { lesson } = body
      if (!lesson || !lesson.title || !lesson.type) {
        return NextResponse.json({ success: false, message: 'Dados da aula inválidos.' }, { status: 400 })
      }
      const newLesson = addEadLesson(moduleId, lesson)
      if (!newLesson) {
        return NextResponse.json({ success: false, message: 'Módulo não encontrado.' }, { status: 404 })
      }
      return NextResponse.json({ success: true, lesson: newLesson })
    }

    if (action === 'update_lesson') {
      const { lessonId, lessonData } = body
      if (!lessonId || !lessonData) {
        return NextResponse.json({ success: false, message: 'ID da aula ou dados ausentes.' }, { status: 400 })
      }
      const updatedLesson = updateEadLesson(moduleId, lessonId, lessonData)
      if (!updatedLesson) {
        return NextResponse.json({ success: false, message: 'Aula ou módulo não encontrado.' }, { status: 404 })
      }
      return NextResponse.json({ success: true, lesson: updatedLesson })
    }

    if (action === 'delete_lesson') {
      const { lessonId } = body
      if (!lessonId) {
        return NextResponse.json({ success: false, message: 'ID da aula ausente.' }, { status: 400 })
      }
      const deleted = deleteEadLesson(moduleId, lessonId)
      if (!deleted) {
        return NextResponse.json({ success: false, message: 'Aula ou módulo não encontrado.' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: 'Aula excluída com sucesso.' })
    }

    return NextResponse.json({ success: false, message: 'Ação inválida.' }, { status: 400 })
  } catch (err) {
    console.error('PUT module error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao processar requisição.' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Não autorizado.' }, { status: 403 })
  }

  try {
    const { id } = await params
    const moduleId = parseInt(id, 10)
    if (isNaN(moduleId)) {
      return NextResponse.json({ success: false, message: 'ID inválido.' }, { status: 400 })
    }

    const deleted = deleteEadModule(moduleId)
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Módulo não encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Módulo excluído com sucesso.' })
  } catch (err) {
    console.error('DELETE module error:', err)
    return NextResponse.json({ success: false, message: 'Erro ao excluir módulo.' }, { status: 500 })
  }
}
