'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'

export default function PortalLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotError, setForgotError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        sessionStorage.setItem('portal_user', JSON.stringify(data.user))
        const params = new URLSearchParams(window.location.search)
        const redirectUrl = params.get('redirect') || '/portal/dashboard'
        router.push(redirectUrl)
      } else {
        setError(data.message || 'E-mail ou senha incorretos. Verifique suas credenciais.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Ocorreu um erro ao conectar ao servidor. Tente novamente.')
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')
    setForgotLoading(true)

    try {
      const response = await fetch('/api/portal/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (data.success) {
        setForgotSuccess('Solicitação enviada! A Facilitar irá redefinir sua senha e entrar em contato.')
        setForgotEmail('')
      } else {
        setForgotError(data.message || 'Erro ao enviar solicitação.')
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      setForgotError('Erro de conexão. Tente novamente.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao site
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-14" style={{ mixBlendMode: 'screen' }}>
              <Image src="/img/logo_com_fundo.png" alt="Facilitar" fill className="object-contain" priority />
            </div>
          </div>

          {!showForgotPassword ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Área do Cliente
                </h1>
                <p className="text-slate-400 text-sm">
                  Acesse com as credenciais fornecidas pela Facilitar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="seu@email.com.br"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true)
                      setForgotSuccess('')
                      setForgotError('')
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verificando...
                    </>
                  ) : (
                    'Entrar no Portal'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Forgot Password Flow */}
              <div className="text-center mb-8">
                <h1 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Recuperar Senha
                </h1>
                <p className="text-slate-400 text-sm">
                  Informe seu e-mail cadastrado e a equipe Facilitar redefinirá sua senha
                </p>
              </div>

              {forgotSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 text-sm font-semibold">{forgotSuccess}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setForgotSuccess('')
                    }}
                    className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    ← Voltar ao login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Seu e-mail cadastrado</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="seu@email.com.br"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                      {forgotError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
                  >
                    {forgotLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Solicitar Redefinição
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-center text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    ← Voltar ao login
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Acesso restrito a clientes da Facilitar Serviços Contábeis
        </p>
      </div>
    </div>
  )
}
