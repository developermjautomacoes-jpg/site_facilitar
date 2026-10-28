'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Users,
  Lock,
  Play,
  CheckCircle,
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  FileText,
  X,
  ExternalLink,
  Eye,
  Settings,
  AlertCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Check
} from 'lucide-react'

// Interfaces
interface PortalUser {
  id?: number
  name: string
  email: string
  role: 'admin' | 'client'
  company?: string
  whatsapp?: string
}

interface EadSlide {
  title: string
  content: string
  bgGradient?: string
}

interface EadLesson {
  id: string
  title: string
  description: string
  type: 'video' | 'pdf' | 'ppt'
  url: string
  duration: string
  order: number
  slides?: EadSlide[]
}

interface EadModule {
  id: number
  title: string
  description: string
  lessons: EadLesson[]
  created_at: string
}

interface EadChatMessage {
  id: number
  moduleId: number
  lessonId: string
  userEmail: string
  userName: string
  userRole: 'admin' | 'client'
  message: string
  created_at: string
  replies?: Array<{
    userName: string
    userRole: 'admin' | 'client'
    message: string
    created_at: string
  }>
}

export default function FacilitoEad() {
  const router = useRouter()
  const [user, setUser] = useState<PortalUser | null>(null)
  const [loading, setLoading] = useState(true)

  // View control
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [activeLesson, setActiveLesson] = useState<EadLesson | null>(null)
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<EadModule | null>(null)

  // DB Data States
  const [modules, setModules] = useState<EadModule[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([]) // moduleId-lessonId
  const [allChats, setAllChats] = useState<EadChatMessage[]>([]) // for admin central chat
  const [currentLessonChats, setCurrentLessonChats] = useState<EadChatMessage[]>([])

  // Modal Control
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showEditModuleModal, setShowEditModuleModal] = useState(false)
  const [showAddLessonModal, setShowAddLessonModal] = useState(false)
  const [showEditLessonModal, setShowEditLessonModal] = useState(false)

  // Active items for editing
  const [editingModule, setEditingModule] = useState<EadModule | null>(null)
  const [editingLesson, setEditingLesson] = useState<EadLesson | null>(null)

  // Slide viewing state for active PPT lesson
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  // Forms States
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' })
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'pdf' | 'ppt',
    url: '',
    duration: '',
    order: 1
  })
  const [pptSlides, setPptSlides] = useState<EadSlide[]>([])
  const [newChatText, setNewChatText] = useState('')
  const [replyTexts, setReplyTexts] = useState<{ [msgId: number]: string }>({})

  // Admin file upload state
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // UI Error & loading states
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  // Check authentication
  useEffect(() => {
    const session = sessionStorage.getItem('portal_user')
    if (!session) {
      router.push('/portal/login?redirect=/portal/ead')
      return
    }
    const parsedUser = JSON.parse(session) as PortalUser
    setUser(parsedUser)
    setLoading(false)
  }, [router])

  // Fetch initial EAD data
  const fetchEadData = async () => {
    try {
      const res = await fetch('/api/portal/ead/modules')
      const data = await res.json()
      if (data.success) {
        setModules(data.modules)
      }
    } catch (err) {
      console.error('Error fetching modules:', err)
    }
  }

  const fetchProgress = async (email: string) => {
    try {
      const res = await fetch(`/api/portal/ead/progress?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.success) {
        setCompletedLessons(data.completedLessons)
      }
    } catch (err) {
      console.error('Error fetching progress:', err)
    }
  }

  const fetchAllChats = async () => {
    try {
      const res = await fetch('/api/portal/ead/chat?all=true')
      const data = await res.json()
      if (data.success) {
        setAllChats(data.chats)
      }
    } catch (err) {
      console.error('Error fetching central chats:', err)
    }
  }

  useEffect(() => {
    if (!user) return
    fetchEadData()
    fetchProgress(user.email)
    if (user.role === 'admin') {
      fetchAllChats()
    }
  }, [user])

  // Fetch chats for the active lesson
  useEffect(() => {
    if (!activeLesson || !activeModuleForLesson) return

    const fetchLessonChats = async () => {
      try {
        const res = await fetch(
          `/api/portal/ead/chat?moduleId=${activeModuleForLesson.id}&lessonId=${activeLesson.id}`
        )
        const data = await res.json()
        if (data.success) {
          setCurrentLessonChats(data.chats)
        }
      } catch (err) {
        console.error('Error fetching lesson chats:', err)
      }
    }

    fetchLessonChats()
    // Reset slide index for presentations
    setActiveSlideIndex(0)
  }, [activeLesson, activeModuleForLesson])

  const handleLogout = () => {
    sessionStorage.removeItem('portal_user')
    router.push('/portal/login')
  }

  // --- ADMIN ACTIONS ---

  // Module Creation & Editing
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'admin') return
    setFormLoading(true)
    setFormError('')

    try {
      const res = await fetch('/api/portal/ead/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email
        },
        body: JSON.stringify(moduleForm)
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModuleModal(false)
        setModuleForm({ title: '', description: '' })
        fetchEadData()
      } else {
        setFormError(data.message || 'Erro ao criar módulo.')
      }
    } catch (err) {
      setFormError('Erro ao conectar ao servidor.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingModule || user.role !== 'admin') return
    setFormLoading(true)
    setFormError('')

    try {
      const res = await fetch(`/api/portal/ead/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email
        },
        body: JSON.stringify({
          action: 'update_module',
          title: moduleForm.title,
          description: moduleForm.description
        })
      })
      const data = await res.json()
      if (data.success) {
        setShowEditModuleModal(false)
        setEditingModule(null)
        setModuleForm({ title: '', description: '' })
        fetchEadData()
      } else {
        setFormError(data.message || 'Erro ao atualizar módulo.')
      }
    } catch (err) {
      setFormError('Erro ao conectar ao servidor.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteModule = async (id: number) => {
    if (!user || user.role !== 'admin') return
    if (!confirm('Deseja realmente excluir este módulo e todos os seus treinamentos associados?')) return

    try {
      const res = await fetch(`/api/portal/ead/modules/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-email': user.email
        }
      })
      const data = await res.json()
      if (data.success) {
        fetchEadData()
      } else {
        alert(data.message || 'Erro ao excluir módulo.')
      }
    } catch (err) {
      alert('Erro de conexão ao excluir módulo.')
    }
  }

  // Files uploading helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    setUploadError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/portal/ead/upload', {
        method: 'POST',
        headers: {
          'x-admin-email': user.email
        },
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setLessonForm((prev) => ({ ...prev, url: data.url }))
      } else {
        setUploadError(data.message || 'Erro no upload.')
      }
    } catch (err) {
      setUploadError('Erro na conexão com o servidor de upload.')
    } finally {
      setUploading(false)
    }
  }

  // Slide builder helpers for custom presentations (PPT style)
  const addSlide = () => {
    setPptSlides((prev) => [...prev, { title: '', content: '', bgGradient: 'from-slate-900 to-slate-950' }])
  }

  const removeSlide = (index: number) => {
    setPptSlides((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSlideField = (index: number, field: keyof EadSlide, val: string) => {
    setPptSlides((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: val }
      return copy
    })
  }

  // Lesson actions inside module
  const handleOpenAddLesson = (mod: EadModule) => {
    setEditingModule(mod)
    setLessonForm({
      title: '',
      description: '',
      type: 'video',
      url: '',
      duration: '',
      order: mod.lessons.length + 1
    })
    setPptSlides([])
    setFormError('')
    setUploadError('')
    setShowAddLessonModal(true)
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingModule || user.role !== 'admin') return
    setFormLoading(true)
    setFormError('')

    // Slides content check for custom PPT
    if (lessonForm.type === 'ppt' && pptSlides.length === 0) {
      setFormError('Por favor, adicione pelo menos um slide para a apresentação.')
      setFormLoading(false)
      return
    }

    try {
      const payload = {
        action: 'add_lesson',
        lesson: {
          ...lessonForm,
          slides: lessonForm.type === 'ppt' ? pptSlides : undefined
        }
      }

      const res = await fetch(`/api/portal/ead/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setShowAddLessonModal(false)
        fetchEadData()
      } else {
        setFormError(data.message || 'Erro ao adicionar aula.')
      }
    } catch (err) {
      setFormError('Erro ao conectar ao servidor.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleOpenEditLesson = (mod: EadModule, les: EadLesson) => {
    setEditingModule(mod)
    setEditingLesson(les)
    setLessonForm({
      title: les.title,
      description: les.description,
      type: les.type,
      url: les.url,
      duration: les.duration,
      order: les.order
    })
    setPptSlides(les.slides || [])
    setFormError('')
    setUploadError('')
    setShowEditLessonModal(true)
  }

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingModule || !editingLesson || user.role !== 'admin') return
    setFormLoading(true)
    setFormError('')

    try {
      const payload = {
        action: 'update_lesson',
        lessonId: editingLesson.id,
        lessonData: {
          ...lessonForm,
          slides: lessonForm.type === 'ppt' ? pptSlides : undefined
        }
      }

      const res = await fetch(`/api/portal/ead/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setShowEditLessonModal(false)
        setEditingLesson(null)
        fetchEadData()
      } else {
        setFormError(data.message || 'Erro ao atualizar aula.')
      }
    } catch (err) {
      setFormError('Erro ao conectar ao servidor.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteLesson = async (modId: number, lessonId: string) => {
    if (!user || user.role !== 'admin') return
    if (!confirm('Deseja realmente excluir este conteúdo?')) return

    try {
      const res = await fetch(`/api/portal/ead/modules/${modId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email
        },
        body: JSON.stringify({
          action: 'delete_lesson',
          lessonId
        })
      })
      const data = await res.json()
      if (data.success) {
        fetchEadData()
      } else {
        alert(data.message || 'Erro ao excluir aula.')
      }
    } catch (err) {
      alert('Erro de conexão ao excluir aula.')
    }
  }

  // --- CLIENT ACTIONS ---

  // Lesson completion toggle
  const handleToggleCompletion = async (modId: number, lessonId: string, isCompleted: boolean) => {
    if (!user) return

    try {
      const res = await fetch('/api/portal/ead/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          moduleId: modId,
          lessonId,
          completed: isCompleted
        })
      })
      const data = await res.json()
      if (data.success) {
        setCompletedLessons(data.completedLessons)
      }
    } catch (err) {
      console.error('Error toggling progress:', err)
    }
  }

  // Post Discussion Comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !activeLesson || !activeModuleForLesson || !newChatText.trim()) return

    try {
      const res = await fetch('/api/portal/ead/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post_message',
          moduleId: activeModuleForLesson.id,
          lessonId: activeLesson.id,
          email: user.email,
          name: user.name,
          role: user.role,
          message: newChatText.trim()
        })
      })
      const data = await res.json()
      if (data.success) {
        setCurrentLessonChats((prev) => [...prev, data.chat])
        setNewChatText('')
        if (user.role === 'admin') {
          fetchAllChats()
        }
      }
    } catch (err) {
      console.error('Error posting comment:', err)
    }
  }

  // Reply to Student Comment
  const handlePostReply = async (messageId: number) => {
    const text = replyTexts[messageId]
    if (!user || !text || !text.trim()) return

    try {
      const res = await fetch('/api/portal/ead/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply_message',
          messageId,
          name: user.name,
          role: user.role,
          message: text.trim()
        })
      })
      const data = await res.json()
      if (data.success) {
        // Update lesson chat list if active
        setCurrentLessonChats((prev) =>
          prev.map((c) => (c.id === messageId ? data.chat : c))
        )
        // Update central chat list for admin
        setAllChats((prev) =>
          prev.map((c) => (c.id === messageId ? data.chat : c))
        )
        setReplyTexts((prev) => ({ ...prev, [messageId]: '' }))
      }
    } catch (err) {
      console.error('Error posting reply:', err)
    }
  }

  // Netflix-style featured training (takes the first lesson of the first module or recent incomplete)
  const getFeaturedLesson = (): { module: EadModule; lesson: EadLesson } | null => {
    if (modules.length === 0) return null
    for (const mod of modules) {
      for (const les of mod.lessons) {
        const key = `${mod.id}-${les.id}`
        if (!completedLessons.includes(key)) {
          return { module: mod, lesson: les }
        }
      }
    }
    // All complete, return first
    if (modules[0].lessons.length > 0) {
      return { module: modules[0], lesson: modules[0].lessons[0] }
    }
    return null
  }

  const featured = getFeaturedLesson()

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-990 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-400 text-sm">Carregando portal de treinamentos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-900/60 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative w-40 h-11" style={{ mixBlendMode: 'screen' }}>
              <Image src="/img/logo_com_fundo.png" alt="Facilitar" fill className="object-contain" priority />
            </Link>
            <span className="px-2.5 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-xs text-blue-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Facilito EAD
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/portal/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Portal Principal</span>
            </Link>

            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                  isAdminMode
                    ? 'bg-amber-600 border-amber-500 hover:bg-amber-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
                }`}
              >
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>{isAdminMode ? 'Sair do Gerencial' : 'Gerenciar EAD'}</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/20 text-slate-300 hover:text-red-400 transition-all"
              title="Sair"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        
        {/* ================= VIEW: ADMIN MODE ================= */}
        {user.role === 'admin' && isAdminMode ? (
          <div className="space-y-10">
            {/* Header Admin */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Painel de Administração EAD
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Gerencie módulos de aprendizagem, suba apostilas, vídeos ou crie slides integrados de treinamento.
                </p>
              </div>
              <button
                onClick={() => {
                  setModuleForm({ title: '', description: '' })
                  setShowAddModuleModal(true)
                }}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Criar Novo Módulo
              </button>
            </div>

            {/* Admin Modules Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">
                  Estrutura de Aulas e Módulos ({modules.length})
                </h3>

                {modules.length === 0 ? (
                  <div className="bg-slate-900/35 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <p className="font-semibold text-slate-400">Nenhum módulo criado ainda.</p>
                    <p className="text-sm mt-1 text-slate-600">Clique em "Criar Novo Módulo" para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {modules.map((mod) => (
                      <div
                        key={mod.id}
                        className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <h4 className="font-bold text-white text-base leading-snug">{mod.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{mod.description || 'Sem descrição.'}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingModule(mod)
                                setModuleForm({ title: mod.title, description: mod.description })
                                setShowEditModuleModal(true)
                              }}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="Editar Módulo"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(mod.id)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                              title="Excluir Módulo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons inside Module list */}
                        <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                              Treinamentos / Materiais ({mod.lessons.length})
                            </span>
                            <button
                              onClick={() => handleOpenAddLesson(mod)}
                              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Adicionar Aula
                            </button>
                          </div>

                          {mod.lessons.length === 0 ? (
                            <p className="text-xs text-slate-600 py-2">Nenhuma aula cadastrada neste módulo.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                              {mod.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className="flex justify-between items-center bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-850 hover:border-slate-800"
                                >
                                  <div className="flex items-center gap-2.5 overflow-hidden">
                                    <span className="text-xs font-bold text-slate-500 min-w-5">
                                      #{les.order}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 bg-blue-900/30 text-blue-400">
                                      {les.type}
                                    </span>
                                    <p className="text-xs text-slate-200 truncate leading-none">{les.title}</p>
                                  </div>
                                  <div className="flex gap-1.5 shrink-0">
                                    <button
                                      onClick={() => handleOpenEditLesson(mod, les)}
                                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(mod.id, les.id)}
                                      className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Central Questions Dashboard for Admins */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Central de Dúvidas & Feedback ({allChats.length})
                </h3>

                {allChats.length === 0 ? (
                  <div className="bg-slate-900/35 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <p className="font-semibold text-slate-400">Nenhuma dúvida registrada ainda.</p>
                    <p className="text-sm mt-1 text-slate-600">Dúvidas postadas nas aulas aparecerão aqui.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {allChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                              Módulo #{chat.moduleId}
                            </span>
                            <p className="text-xs font-semibold text-slate-200 mt-0.5">
                              {chat.userName} ({chat.userEmail})
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(chat.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                          {chat.message}
                        </p>

                        {/* Existing replies */}
                        {chat.replies && chat.replies.length > 0 && (
                          <div className="pl-4 border-l-2 border-slate-800 space-y-2">
                            {chat.replies.map((reply, rid) => (
                              <div key={rid} className="text-xs">
                                <p className="font-bold text-slate-400 leading-none">
                                  {reply.userName}{' '}
                                  {reply.userRole === 'admin' && (
                                    <span className="text-[9px] px-1 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                                      Facilitar Suporte
                                    </span>
                                  )}
                                </p>
                                <p className="text-slate-300 mt-1">{reply.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="flex gap-2 pt-1.5">
                          <input
                            type="text"
                            placeholder="Responder dúvida..."
                            value={replyTexts[chat.id] || ''}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({ ...prev, [chat.id]: e.target.value }))
                            }
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button
                            onClick={() => handlePostReply(chat.id)}
                            className="px-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-xs transition-colors flex items-center justify-center"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ================= VIEW: CLIENT STREAMING VIEW ================= */
          <div className="space-y-12">
            
            {/* Netflix Featured Banner */}
            {featured ? (
              <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl h-[420px] bg-slate-950 flex flex-col justify-end p-6 sm:p-12">
                {/* Background overlay image / colored cover */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'linear-gradient(to top, #020617 15%, rgba(15,23,42,0.85) 50%, rgba(30,41,59,0.3) 100%)'
                  }}
                />
                
                {/* Neon backglow */}
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-4">
                  <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                    Destaque EAD
                  </span>
                  
                  <div>
                    <span className="text-xs text-blue-400 font-semibold">{featured.module.title}</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {featured.lesson.title}
                    </h2>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {featured.lesson.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => {
                        setActiveModuleForLesson(featured.module)
                        setActiveLesson(featured.lesson)
                      }}
                      className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-white/5"
                    >
                      <Play className="w-5 h-5 fill-slate-950 stroke-none" />
                      Começar Treinamento
                    </button>
                    
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 px-4 py-3 border border-slate-800 rounded-xl bg-slate-900/50">
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-black bg-blue-900/30 text-blue-400">
                        {featured.lesson.type}
                      </span>
                      Duração: {featured.lesson.duration || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/30 p-12 text-center text-slate-500 shadow-2xl">
                <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-300">Boas-vindas ao Facilito EAD</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  A Facilitar ainda não disponibilizou treinamentos ou apostilas na EAD. Fique atento, novidades estarão disponíveis em breve!
                </p>
              </div>
            )}

            {/* Modules Horizontal Carousels (Netflix style) */}
            <div className="space-y-10 pt-4">
              {modules.map((mod) => (
                <div key={mod.id} className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 leading-none" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{mod.description}</p>
                    </div>
                  </div>

                  {mod.lessons.length === 0 ? (
                    <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 text-xs text-slate-600">
                      Nenhum treinamento disponível neste módulo ainda.
                    </div>
                  ) : (
                    /* Horizontal rows */
                    <div className="relative group/row">
                      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 pr-10">
                        {mod.lessons.map((les) => {
                          const isComplete = completedLessons.includes(`${mod.id}-${les.id}`)
                          return (
                            <div
                              key={les.id}
                              onClick={() => {
                                setActiveModuleForLesson(mod)
                                setActiveLesson(les)
                              }}
                              className="w-72 bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 shrink-0 transition-all duration-300 hover:scale-[1.03] hover:bg-slate-900 cursor-pointer relative group flex flex-col justify-between h-48 shadow"
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-blue-900/30 text-blue-400 tracking-wider">
                                    {les.type}
                                  </span>
                                  {isComplete ? (
                                    <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-md">
                                      <Check className="w-3 h-3" /> Concluído
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-500 font-semibold">
                                      {les.duration || 'N/A'}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                  {les.title}
                                </h4>
                                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                  {les.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                                <span className="text-[10px] font-black text-slate-600">
                                  TREINAMENTO #{les.order}
                                </span>
                                <span className="text-xs text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                                  Acessar <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: VIDEO / PDF / PPT READER PLAYER ================= */}
      <AnimatePresence>
        {activeLesson && activeModuleForLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full h-full md:max-w-6xl md:h-[90vh] bg-slate-900 md:border md:border-slate-800 md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveLesson(null)
                  setActiveModuleForLesson(null)
                  setCurrentLessonChats([])
                }}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Fechar Player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Player Side */}
              <div className="flex-1 bg-black flex flex-col justify-between p-4 sm:p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                      {activeModuleForLesson.title}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      {activeLesson.title}
                    </h3>
                  </div>
                </div>

                {/* Main Media Render */}
                <div className="flex-1 flex items-center justify-center relative min-h-[220px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-850">
                  {activeLesson.type === 'video' && (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full max-h-[480px] object-contain rounded-xl"
                      src={activeLesson.url}
                    >
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                  )}

                  {activeLesson.type === 'pdf' && (
                    <iframe
                      src={activeLesson.url}
                      className="w-full h-full min-h-[420px] rounded-xl border-none"
                    />
                  )}

                  {activeLesson.type === 'ppt' && activeLesson.slides && (
                    <div className="w-full h-full min-h-[420px] flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative">
                      <div className="absolute top-4 left-4 text-xs font-bold text-slate-500">
                        Slide {activeSlideIndex + 1} de {activeLesson.slides.length}
                      </div>

                      {/* Active Slide Render */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto space-y-4">
                        <h4 className="text-xl sm:text-2xl font-extrabold text-blue-400 leading-tight">
                          {activeLesson.slides[activeSlideIndex].title}
                        </h4>
                        <p className="text-sm text-slate-200 leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {activeLesson.slides[activeSlideIndex].content}
                        </p>
                      </div>

                      {/* Navigation slide control */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <button
                          disabled={activeSlideIndex === 0}
                          onClick={() => setActiveSlideIndex((prev) => prev - 1)}
                          className="px-4 py-2 border border-slate-800 bg-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" /> Anterior
                        </button>
                        <button
                          disabled={activeSlideIndex === activeLesson.slides.length - 1}
                          onClick={() => setActiveSlideIndex((prev) => prev + 1)}
                          className="px-4 py-2 border border-slate-800 bg-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                        >
                          Próximo <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-slate-950">
                  <p className="text-xs text-slate-400 max-w-md">
                    {activeLesson.description}
                  </p>

                  <button
                    onClick={() => {
                      const completed = completedLessons.includes(`${activeModuleForLesson.id}-${activeLesson.id}`)
                      handleToggleCompletion(activeModuleForLesson.id, activeLesson.id, !completed)
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all w-full sm:w-auto justify-center ${
                      completedLessons.includes(`${activeModuleForLesson.id}-${activeLesson.id}`)
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {completedLessons.includes(`${activeModuleForLesson.id}-${activeLesson.id}`)
                        ? 'Concluído! Desmarcar'
                        : 'Marcar como Concluído'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Chat discussion side */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between bg-slate-900/60 backdrop-blur-sm h-[320px] md:h-full">
                
                {/* Chat Header */}
                <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> Discussões
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded-full">
                    {currentLessonChats.length} msgs
                  </span>
                </div>

                {/* Message list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                  {currentLessonChats.length === 0 ? (
                    <div className="text-center py-10 text-slate-650 text-xs">
                      <MessageSquare className="w-8 h-8 mx-auto text-slate-800 mb-2" />
                      Nenhuma dúvida ainda. Seja o primeiro a comentar!
                    </div>
                  ) : (
                    currentLessonChats.map((chat) => (
                      <div key={chat.id} className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-1.5">
                        <div className="flex justify-between items-baseline gap-1">
                          <p className="text-[11px] font-extrabold text-slate-300 truncate leading-none">
                            {chat.userName}
                          </p>
                          <span className="text-[9px] text-slate-500 font-bold shrink-0">
                            {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-350 leading-relaxed font-medium">
                          {chat.message}
                        </p>

                        {/* Replies to comment */}
                        {chat.replies && chat.replies.length > 0 && (
                          <div className="pl-3 border-l-2 border-slate-800 space-y-1.5 pt-1 mt-1">
                            {chat.replies.map((rep, rid) => (
                              <div key={rid} className="text-[10px] space-y-0.5">
                                <p className="font-bold text-slate-400 leading-none">
                                  {rep.userName}{' '}
                                  {rep.userRole === 'admin' && (
                                    <span className="text-[8px] px-1 py-0.1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-black">
                                      Suporte
                                    </span>
                                  )}
                                </p>
                                <p className="text-slate-300 font-medium">{rep.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Admin Inline Reply inside Player */}
                        {user.role === 'admin' && (
                          <div className="flex gap-1 pt-1 border-t border-slate-900/60 mt-1">
                            <input
                              type="text"
                              placeholder="Responder..."
                              value={replyTexts[chat.id] || ''}
                              onChange={(e) =>
                                setReplyTexts((prev) => ({ ...prev, [chat.id]: e.target.value }))
                              }
                              className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-white placeholder-slate-655 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => handlePostReply(chat.id)}
                              className="px-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>



                {/* Form to submit chat */}
                <form onSubmit={handlePostComment} className="p-3 bg-slate-950/60 border-t border-slate-850 flex gap-2">
                  <input
                    type="text"
                    placeholder="Deixe sua dúvida / feedback..."
                    required
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500/80 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: ADD MODULE ================= */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddModuleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Criar Novo Módulo
            </h3>

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Título do Módulo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Introdução ao Faturamento"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Descrição Curta
                </label>
                <textarea
                  rows={3}
                  placeholder="Uma breve introdução sobre os treinamentos deste módulo."
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="w-1/2 py-3 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Processando...' : 'Salvar Módulo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: EDIT MODULE ================= */}
      {showEditModuleModal && editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => {
                setShowEditModuleModal(false)
                setEditingModule(null)
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Editar Módulo
            </h3>

            <form onSubmit={handleUpdateModule} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Título do Módulo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Introdução ao Faturamento"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Descrição Curta
                </label>
                <textarea
                  rows={3}
                  placeholder="Uma breve introdução sobre os treinamentos deste módulo."
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModuleModal(false)
                    setEditingModule(null)
                  }}
                  className="w-1/2 py-3 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Módulo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: ADD LESSON / CONTENT ================= */}
      {showAddLessonModal && editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
          >
            <button
              onClick={() => setShowAddLessonModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
              Adicionar Conteúdo de Treinamento
            </h3>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider font-bold">
              Módulo: {editingModule.title}
            </p>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Título do Treinamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução ao eSocial"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Tipo do Conteúdo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        type: e.target.value as 'video' | 'pdf' | 'ppt'
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="video">Vídeo (Streaming)</option>
                    <option value="pdf">Apostila / Manual (PDF)</option>
                    <option value="ppt">Apresentação / Slides (PPT Builder)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  placeholder="Resumo do que o cliente irá aprender."
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Duração Estimada (Minutos)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 15 min"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Upload section for VIDEO or PDF */}
              {lessonForm.type !== 'ppt' && (
                <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl space-y-3">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Link de arquivo / Fazer Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ficha do arquivo ou Link externo (ex: https://...)"
                      value={lessonForm.url}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, url: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="lesson-file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept={lessonForm.type === 'video' ? 'video/*' : 'application/pdf'}
                      />
                      <label
                        htmlFor="lesson-file"
                        className="px-4 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" /> Upload
                      </label>
                    </div>
                  </div>
                  {uploading && (
                    <p className="text-xs text-blue-400 animate-pulse">Enviando mídia para o servidor...</p>
                  )}
                  {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                </div>
              )}

              {/* Interactive Presentation Slide Builder (PPT) */}
              {lessonForm.type === 'ppt' && (
                <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Slides da Apresentação ({pptSlides.length})
                    </span>
                    <button
                      type="button"
                      onClick={addSlide}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Slide
                    </button>
                  </div>

                  {pptSlides.length === 0 ? (
                    <p className="text-xs text-slate-600 py-2">Nenhum slide adicionado. Clique no botão acima.</p>
                  ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                      {pptSlides.map((slide, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeSlide(idx)}
                            className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <span className="text-[10px] font-black text-slate-500">SLIDE #{idx + 1}</span>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Título do Slide"
                                required
                                value={slide.title}
                                onChange={(e) => updateSlideField(idx, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Fundo (Gradient CSS, ex: from-slate-900 to-slate-950)"
                                value={slide.bgGradient || ''}
                                onChange={(e) => updateSlideField(idx, 'bgGradient', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650"
                              />
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            placeholder="Conteúdo descritivo do slide."
                            required
                            value={slide.content}
                            onChange={(e) => updateSlideField(idx, 'content', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="w-1/2 py-3.5 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading || uploading}
                  className="w-1/2 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Adicionar Aula'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: EDIT LESSON / CONTENT ================= */}
      {showEditLessonModal && editingModule && editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
          >
            <button
              onClick={() => {
                setShowEditLessonModal(false)
                setEditingLesson(null)
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
              Editar Conteúdo de Treinamento
            </h3>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider font-bold">
              Módulo: {editingModule.title}
            </p>

            <form onSubmit={handleUpdateLesson} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Título do Treinamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução ao eSocial"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Tipo do Conteúdo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        type: e.target.value as 'video' | 'pdf' | 'ppt'
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="video">Vídeo (Streaming)</option>
                    <option value="pdf">Apostila / Manual (PDF)</option>
                    <option value="ppt">Apresentação / Slides (PPT Builder)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  placeholder="Resumo do que o cliente irá aprender."
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Duração Estimada (Minutos)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 15 min"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Upload section for VIDEO or PDF */}
              {lessonForm.type !== 'ppt' && (
                <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl space-y-3">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Link de arquivo / Fazer Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ficha do arquivo ou Link externo (ex: https://...)"
                      value={lessonForm.url}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, url: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="edit-lesson-file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept={lessonForm.type === 'video' ? 'video/*' : 'application/pdf'}
                      />
                      <label
                        htmlFor="edit-lesson-file"
                        className="px-4 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" /> Upload
                      </label>
                    </div>
                  </div>
                  {uploading && (
                    <p className="text-xs text-blue-400 animate-pulse">Enviando mídia para o servidor...</p>
                  )}
                  {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                </div>
              )}

              {/* Interactive Presentation Slide Builder (PPT) */}
              {lessonForm.type === 'ppt' && (
                <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Slides da Apresentação ({pptSlides.length})
                    </span>
                    <button
                      type="button"
                      onClick={addSlide}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Slide
                    </button>
                  </div>

                  {pptSlides.length === 0 ? (
                    <p className="text-xs text-slate-600 py-2">Nenhum slide adicionado. Clique no botão acima.</p>
                  ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                      {pptSlides.map((slide, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeSlide(idx)}
                            className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <span className="text-[10px] font-black text-slate-500">SLIDE #{idx + 1}</span>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Título do Slide"
                                required
                                value={slide.title}
                                onChange={(e) => updateSlideField(idx, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-655"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Fundo (Gradient CSS, ex: from-slate-900 to-slate-950)"
                                value={slide.bgGradient || ''}
                                onChange={(e) => updateSlideField(idx, 'bgGradient', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-655"
                              />
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            placeholder="Conteúdo descritivo do slide."
                            required
                            value={slide.content}
                            onChange={(e) => updateSlideField(idx, 'content', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-655"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditLessonModal(false)
                    setEditingLesson(null)
                  }}
                  className="w-1/2 py-3.5 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading || uploading}
                  className="w-1/2 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
