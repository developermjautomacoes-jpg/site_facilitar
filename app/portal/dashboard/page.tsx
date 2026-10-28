'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  Mail,
  Plus,
  Trash2,
  LogOut,
  User,
  Building2,
  Phone,
  Calendar,
  MessageSquare,
  Clock,
  AlertCircle,
  FileText,
  ExternalLink,
  HelpCircle,
  X,
  Pencil,
  Lock,
  CheckCircle,
  Bell
} from 'lucide-react'

interface PortalUser {
  id?: number
  name: string
  email: string
  role: 'admin' | 'client'
  company?: string
  whatsapp?: string
  created_at?: string
}

interface Lead {
  id: number
  nome: string
  empresa?: string
  email: string
  whatsapp?: string
  assunto?: string
  mensagem?: string
  ip?: string
  created_at: string
}

interface NotificationData {
  id: number
  type: 'password_reset' | 'general'
  clientEmail: string
  clientName: string
  message: string
  read: boolean
  resolved: boolean
  created_at: string
}

export default function PortalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<PortalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'clients' | 'leads' | 'notifications'>('clients')
  const [clients, setClients] = useState<PortalUser[]>()
  const [leads, setLeads] = useState<Lead[]>()
  const [notifications, setNotifications] = useState<NotificationData[]>()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    whatsapp: '',
  })

  // Edit client modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingClient, setEditingClient] = useState<PortalUser | null>(null)
  const [editClientForm, setEditClientForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    whatsapp: '',
  })

  // Change password modal states (for Client)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [changePasswordError, setChangePasswordError] = useState('')
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('')
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)

  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Check auth
  useEffect(() => {
    const session = sessionStorage.getItem('portal_user')
    if (!session) {
      router.push('/portal/login')
      return
    }
    const parsedUser = JSON.parse(session) as PortalUser
    setUser(parsedUser)
    setLoading(false)
  }, [router])

  // Fetch admin data
  useEffect(() => {
    if (!user || user.role !== 'admin') return

    const fetchClients = async () => {
      try {
        const res = await fetch('/api/portal/clients', {
          headers: { 'x-admin-email': user.email }
        })
        const data = await res.json()
        if (data.success) {
          setClients(data.clients)
        }
      } catch (err) {
        console.error('Error fetching clients:', err)
      }
    }

    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/portal/leads', {
          headers: { 'x-admin-email': user.email }
        })
        const data = await res.json()
        if (data.success) {
          setLeads(data.leads)
        }
      } catch (err) {
        console.error('Error fetching leads:', err)
      }
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/portal/notifications', {
          headers: { 'x-admin-email': user.email }
        })
        const data = await res.json()
        if (data.success) {
          setNotifications(data.notifications)
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
      }
    }

    fetchClients()
    fetchLeads()
    fetchNotifications()
  }, [user])

  const handleLogout = () => {
    sessionStorage.removeItem('portal_user')
    router.push('/portal/login')
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setFormLoading(true)
    setFormError('')
    setSuccessMessage('')

    try {
      const res = await fetch('/api/portal/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email,
        },
        body: JSON.stringify(newClientForm),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMessage('Cliente cadastrado com sucesso!')
        setNewClientForm({ name: '', email: '', password: '', company: '', whatsapp: '' })
        
        // Refresh clients list
        const cRes = await fetch('/api/portal/clients', {
          headers: { 'x-admin-email': user.email }
        })
        const cData = await cRes.json()
        if (cData.success) {
          setClients(cData.clients)
        }

        setTimeout(() => {
          setShowAddModal(false)
          setSuccessMessage('')
        }, 1500)
      } else {
        setFormError(data.message || 'Erro ao cadastrar cliente.')
      }
    } catch (err) {
      console.error(err)
      setFormError('Erro de conexão ao cadastrar cliente.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClient = async (id: number) => {
    if (!user) return
    if (!confirm('Deseja realmente excluir este cliente? O acesso dele ao portal será revogado imediatamente.')) return

    try {
      const res = await fetch(`/api/portal/clients/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': user.email },
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setClients((prev) => prev?.filter((c) => c.id !== id))
      } else {
        alert(data.message || 'Erro ao excluir cliente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao excluir cliente.')
    }
  }

  const handleOpenEditModal = (client: PortalUser) => {
    setEditingClient(client)
    setEditClientForm({
      name: client.name || '',
      email: client.email || '',
      password: '',
      company: client.company || '',
      whatsapp: client.whatsapp || '',
    })
    setFormError('')
    setSuccessMessage('')
    setShowEditModal(true)
  }

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingClient || !editingClient.id) return
    setFormLoading(true)
    setFormError('')
    setSuccessMessage('')

    try {
      const res = await fetch(`/api/portal/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email,
        },
        body: JSON.stringify({
          name: editClientForm.name,
          email: editClientForm.email,
          company: editClientForm.company,
          whatsapp: editClientForm.whatsapp,
          password: editClientForm.password || undefined,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMessage('Cliente atualizado com sucesso!')
        
        // Refresh clients list
        const cRes = await fetch('/api/portal/clients', {
          headers: { 'x-admin-email': user.email }
        })
        const cData = await cRes.json()
        if (cData.success) {
          setClients(cData.clients)
        }

        // Also refresh notifications in case password was changed to resolve requests
        const nRes = await fetch('/api/portal/notifications', {
          headers: { 'x-admin-email': user.email }
        })
        const nData = await nRes.json()
        if (nData.success) {
          setNotifications(nData.notifications)
        }

        setTimeout(() => {
          setShowEditModal(false)
          setEditingClient(null)
          setSuccessMessage('')
        }, 1500)
      } else {
        setFormError(data.message || 'Erro ao atualizar cliente.')
      }
    } catch (err) {
      console.error(err)
      setFormError('Erro de conexão ao atualizar cliente.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleResolveNotification = async (id: number) => {
    if (!user) return

    try {
      const res = await fetch(`/api/portal/notifications/${id}`, {
        method: 'PUT',
        headers: { 'x-admin-email': user.email },
      })
      const data = await res.json()

      if (res.ok && data.success) {
        // Refresh notifications list
        const nRes = await fetch('/api/portal/notifications', {
          headers: { 'x-admin-email': user.email }
        })
        const nData = await nRes.json()
        if (nData.success) {
          setNotifications(nData.notifications)
        }
      } else {
        alert(data.message || 'Erro ao resolver notificação.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao resolver notificação.')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    if (changePasswordForm.newPassword.length < 6) {
      setChangePasswordError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword) {
      setChangePasswordError('A nova senha e a confirmação não coincidem.')
      return
    }

    setChangePasswordLoading(true)
    setChangePasswordError('')
    setChangePasswordSuccess('')

    try {
      const res = await fetch('/api/portal/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          currentPassword: changePasswordForm.currentPassword,
          newPassword: changePasswordForm.newPassword,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setChangePasswordSuccess('Senha alterada com sucesso!')
        setChangePasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
        setTimeout(() => {
          setShowChangePasswordModal(false)
          setChangePasswordSuccess('')
        }, 2000)
      } else {
        setChangePasswordError(data.message || 'Erro ao alterar a senha.')
      }
    } catch (err) {
      console.error(err)
      setChangePasswordError('Erro de conexão ao alterar a senha.')
    } finally {
      setChangePasswordLoading(false)
    }
  }

  const formatWhatsAppLink = (number?: string) => {
    if (!number) return '#'
    const cleanNumber = number.replace(/\D/g, '')
    return `https://wa.me/${cleanNumber.startsWith('55') ? cleanNumber : '55' + cleanNumber}`
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-400 text-sm">Carregando painel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative w-40 h-11" style={{ mixBlendMode: 'screen' }}>
              <Image src="/img/logo_com_fundo.png" alt="Facilitar" fill className="object-contain" priority />
            </Link>
            <span className="hidden sm:inline px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-400 font-semibold tracking-wider uppercase">
              {user.role === 'admin' ? 'Painel Admin' : 'Área do Cliente'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-200 leading-none">{user.name}</p>
                <p className="text-xs text-slate-500 mt-1">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/20 text-slate-300 hover:text-red-400 text-sm font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ================= ADMIN VIEW ================= */}
        {user.role === 'admin' && (
          <div>
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Painel de Controle
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Gerencie o acesso de seus clientes e acompanhe as mensagens enviadas pelo site.
                </p>
              </div>

              {activeTab === 'clients' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Cliente
                </button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-8 gap-6">
              <button
                onClick={() => setActiveTab('clients')}
                className={`pb-4 text-sm font-semibold flex items-center gap-2 transition-all relative ${
                  activeTab === 'clients' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
                Clientes Cadastrados ({clients?.length ?? 0})
                {activeTab === 'clients' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-4 text-sm font-semibold flex items-center gap-2 transition-all relative ${
                  activeTab === 'leads' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-4.5 h-4.5" />
                Mensagens de Contato ({leads?.length ?? 0})
                {activeTab === 'leads' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-4 text-sm font-semibold flex items-center gap-2 transition-all relative ${
                  activeTab === 'notifications' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bell className="w-4.5 h-4.5" />
                Solicitações de Senha
                {notifications && notifications.filter(n => !n.resolved).length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full leading-none">
                    {notifications.filter(n => !n.resolved).length}
                  </span>
                )}
                {activeTab === 'notifications' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            </div>

            {/* TAB CONTENT: CLIENTS */}
            {activeTab === 'clients' && (
              <div>
                {!clients || clients.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <p className="text-base font-semibold">Nenhum cliente cadastrado ainda.</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Clique no botão no topo direito para criar o primeiro acesso de cliente.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/70">
                            <th className="py-4 px-6">Nome</th>
                            <th className="py-4 px-6">Empresa</th>
                            <th className="py-4 px-6">E-mail</th>
                            <th className="py-4 px-6">WhatsApp</th>
                            <th className="py-4 px-6">Criado em</th>
                            <th className="py-4 px-6 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-800/20 transition-colors">
                              <td className="py-4 px-6 font-semibold text-slate-200">{client.name}</td>
                              <td className="py-4 px-6 text-slate-300">
                                {client.company ? (
                                  <div className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                    {client.company}
                                  </div>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-slate-300 font-mono text-xs">{client.email}</td>
                              <td className="py-4 px-6 text-slate-300">
                                {client.whatsapp ? (
                                  <a
                                    href={formatWhatsAppLink(client.whatsapp)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-slate-300 hover:text-green-400 hover:underline transition-colors"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-green-500" />
                                    {client.whatsapp}
                                  </a>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-slate-400 text-xs">
                                {client.created_at
                                  ? new Date(client.created_at).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })
                                  : '-'}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(client)}
                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-blue-500/10 border border-slate-700 hover:border-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors"
                                    title="Editar Cadastro"
                                  >
                                    <Pencil className="w-4.5 h-4.5" />
                                  </button>
                                  <button
                                    onClick={() => client.id && handleDeleteClient(client.id)}
                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                    title="Excluir Acesso"
                                  >
                                    <Trash2 className="w-4.5 h-4.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: LEADS */}
            {activeTab === 'leads' && (
              <div>
                {!leads || leads.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <Mail className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <p className="text-base font-semibold">Nenhuma mensagem registrada no banco de dados.</p>
                    <p className="text-sm text-slate-600 mt-1">
                      As mensagens enviadas pelo formulário do site aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-6 shadow-md transition-all flex flex-col gap-4"
                      >
                        {/* Title and metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                              Assunto: {lead.assunto || 'Contato Geral'}
                            </span>
                            <h3 className="text-lg font-bold text-slate-200 mt-1.5">{lead.nome}</h3>
                          </div>
                          <div className="flex flex-col items-start sm:items-end text-slate-500 text-xs font-mono gap-1">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(lead.created_at).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="text-[10px]">IP: {lead.ip || 'desconhecido'}</span>
                          </div>
                        </div>

                        {/* Sender info */}
                        <div className="grid sm:grid-cols-3 gap-4 text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800/50">
                          <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Empresa</p>
                            <p className="text-slate-300 font-semibold mt-0.5">
                              {lead.empresa || <span className="text-slate-600">Não fornecido</span>}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">E-mail</p>
                            <p className="text-slate-300 font-mono text-xs mt-1 selection:bg-blue-600/30">
                              {lead.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">WhatsApp</p>
                            {lead.whatsapp ? (
                              <a
                                href={formatWhatsAppLink(lead.whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-slate-300 hover:text-green-400 hover:underline transition-colors mt-0.5 font-semibold"
                              >
                                <Phone className="w-3.5 h-3.5 text-green-500" />
                                {lead.whatsapp}
                              </a>
                            ) : (
                              <span className="text-slate-600">Não fornecido</span>
                            )}
                          </div>
                        </div>

                        {/* Message content */}
                        <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/40">
                          <p className="text-slate-500 text-xs font-medium uppercase mb-2">Mensagem</p>
                          <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                            {lead.mensagem}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div>
                {!notifications || notifications.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    <Bell className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <p className="text-base font-semibold">Nenhuma notificação registrada.</p>
                    <p className="text-sm text-slate-600 mt-1">
                      As solicitações de redefinição de senha dos clientes aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`bg-slate-900/40 border ${
                          notif.resolved ? 'border-slate-800/80 opacity-60' : 'border-blue-500/30 bg-blue-500/5'
                        } rounded-2xl p-6 shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl border ${
                            notif.resolved ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                          }`}>
                            <Lock className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                                notif.resolved ? 'bg-slate-800 text-slate-400' : 'bg-blue-600/10 text-blue-400'
                              }`}>
                                {notif.resolved ? 'Resolvido' : 'Pendente'}
                              </span>
                              <span className="text-slate-500 text-xs font-mono">
                                {new Date(notif.created_at).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-200 mt-1.5">{notif.clientName}</h3>
                            <p className="text-slate-400 text-sm mt-1">{notif.message}</p>
                          </div>
                        </div>

                        {!notif.resolved && (
                          <div className="flex gap-2 shrink-0">
                            {(() => {
                              const associatedClient = clients?.find(c => c.email.toLowerCase() === notif.clientEmail.toLowerCase())
                              return associatedClient ? (
                                <button
                                  onClick={() => handleOpenEditModal(associatedClient)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-xs transition-all shadow-md"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Alterar Senha do Cliente
                                </button>
                              ) : null
                            })()}
                            <button
                              onClick={() => handleResolveNotification(notif.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              Marcar Resolvido
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= CLIENT VIEW ================= */}
        {user.role === 'client' && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: Client Profile & Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25 mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">E-mail: {user.email}</p>
                </div>

                <div className="pt-6 space-y-4 text-sm">
                  {user.company && (
                    <div className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                      <Building2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase">Empresa</p>
                        <p className="text-slate-200 font-bold mt-0.5">{user.company}</p>
                      </div>
                    </div>
                  )}

                  {user.whatsapp && (
                    <div className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                      <Phone className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase">WhatsApp Cadastrado</p>
                        <p className="text-slate-200 font-semibold mt-0.5">{user.whatsapp}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setChangePasswordError('')
                      setChangePasswordSuccess('')
                      setChangePasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
                      setShowChangePasswordModal(true)
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-slate-300 font-semibold transition-all text-xs border border-slate-700"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Box Suporte Direto */}
              <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 rounded-3xl p-6 shadow-lg">
                <HelpCircle className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-slate-100 mb-2">Suporte Rápido</h3>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  Precisa de alguma certidão, folha de pagamento ou tem dúvidas fiscais? Nosso time está pronto para ajudar.
                </p>
                <a
                  href="https://wa.me/5527999858502"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-all text-sm shadow-md"
                >
                  <Phone className="w-4.5 h-4.5" />
                  Chamar no WhatsApp
                </a>
              </div>
            </div>

            {/* Right: Dashboard Action panels & mock document storage */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome box */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Olá, {user.name.split(' ')[0]}!
                  </h2>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Seja bem-vindo ao portal da Facilitar Serviços Contábeis. Aqui você tem acesso aos seus dados cadastrados e atalhos de contato prioritário com a nossa equipe.
                  </p>
                </div>
              </div>

              {/* Documents box (Mock center) */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-5 mb-6">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-blue-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">Central de Documentos</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Seus arquivos e guias mensais enviados pela equipe</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                  <FileText className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-400 font-semibold text-sm">Pronto para receber arquivos</p>
                  <p className="text-xs text-slate-600 max-w-sm mt-1 leading-relaxed">
                    Nossa equipe disponibilizará as guias de impostos, DAS, certidões e holerites diretamente aqui no seu painel. Caso precise de uma via urgente, utilize o suporte rápido ao lado.
                  </p>
                </div>

                {/* Useful pre-filled request actions */}
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <a
                    href="https://wa.me/5527999858502?text=Olá,%20gostaria%20de%20solicitar%20uma%20Certidão%20Negativa%20de%20Débitos%20(CND)."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Solicitar CND</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </a>

                  <a
                    href="https://wa.me/5527999858502?text=Olá,%20estou%20enviando%20os%20comprovantes%20para%20o%20fechamento%20contábil."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Enviar Comprovantes</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ================= MODAL: ADD CLIENT ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Cadastrar Novo Acesso de Cliente
            </h3>

            <form onSubmit={handleAddClient} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Nome do Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  placeholder="Nome Completo"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={newClientForm.company}
                    onChange={(e) => setNewClientForm({ ...newClientForm, company: e.target.value })}
                    placeholder="Nome da Empresa"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    WhatsApp (Celular)
                  </label>
                  <input
                    type="text"
                    value={newClientForm.whatsapp}
                    onChange={(e) => setNewClientForm({ ...newClientForm, whatsapp: e.target.value })}
                    placeholder="DDD + Número"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  placeholder="cliente@email.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Senha Provisória <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newClientForm.password}
                  onChange={(e) => setNewClientForm({ ...newClientForm, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold">
                  {successMessage}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-3 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-xl text-white font-semibold transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Cadastrando...
                    </>
                  ) : (
                    'Salvar Cadastro'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: EDIT CLIENT ================= */}
      {showEditModal && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            <button
              onClick={() => {
                setShowEditModal(false)
                setEditingClient(null)
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Editar Cadastro de Cliente
            </h3>

            <form onSubmit={handleEditClient} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Nome do Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editClientForm.name}
                  onChange={(e) => setEditClientForm({ ...editClientForm, name: e.target.value })}
                  placeholder="Nome Completo"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={editClientForm.company}
                    onChange={(e) => setEditClientForm({ ...editClientForm, company: e.target.value })}
                    placeholder="Nome da Empresa"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    WhatsApp (Celular)
                  </label>
                  <input
                    type="text"
                    value={editClientForm.whatsapp}
                    onChange={(e) => setEditClientForm({ ...editClientForm, whatsapp: e.target.value })}
                    placeholder="DDD + Número"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editClientForm.email}
                  onChange={(e) => setEditClientForm({ ...editClientForm, email: e.target.value })}
                  placeholder="cliente@email.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Nova Senha (Deixe em branco para manter a atual)
                </label>
                <input
                  type="password"
                  value={editClientForm.password}
                  onChange={(e) => setEditClientForm({ ...editClientForm, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres se for alterar"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold">
                  {successMessage}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingClient(null)
                  }}
                  className="w-1/2 py-3 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-xl text-white font-semibold transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: CHANGE PASSWORD ================= */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            <button
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Alterar Minha Senha
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  required
                  value={changePasswordForm.currentPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                  placeholder="Sua senha atual"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={changePasswordForm.newPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={changePasswordForm.confirmNewPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmNewPassword: e.target.value })}
                  placeholder="Repita a nova senha"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              {changePasswordError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{changePasswordError}</span>
                </div>
              )}

              {changePasswordSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold">
                  {changePasswordSuccess}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="w-1/2 py-3 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-xl text-white font-semibold transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {changePasswordLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
